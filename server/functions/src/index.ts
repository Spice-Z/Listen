import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as Parser from 'rss-parser';

admin.initializeApp();
admin.firestore().settings({
  ignoreUndefinedProperties: true,
});

const parser = new Parser();

const CHANNEL_DOCUMENT_NAME = 'Channels';

exports.registerChannel = functions
  .runWith({
    timeoutSeconds: 300,
  })
  .region('asia-northeast1')
  .https.onCall(async (data: { url: string }, context: functions.https.CallableContext) => {
    if (!context.auth) {
      throw new functions.https.HttpsError(
        'unauthenticated',
        'The function must be called while authenticated.'
      );
    }

    const feedUrl = data.url;
    if (!feedUrl) {
      throw new functions.https.HttpsError(
        'invalid-argument',
        'The function must be called with a "url" argument.'
      );
    }

    const existingChannelSnapshot = await admin
      .firestore()
      .collection(CHANNEL_DOCUMENT_NAME)
      .where('url', '==', feedUrl)
      .get();

    if (!existingChannelSnapshot.empty) {
      throw new functions.https.HttpsError('already-exists', 'The channel is already registered.');
    }

    await fetchAndSavePodcast(feedUrl, true);

    return { success: true };
  });

exports.getPodcasts = functions.region('asia-northeast1').https.onCall(async (request) => {
  if (request.app == null) {
    throw new functions.https.HttpsError(
      'failed-precondition',
      'The function must be called from an App Check verified app.'
    );
  }

  const snapshot = await admin.firestore().collection(CHANNEL_DOCUMENT_NAME).get();
  return snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      title: data.title,
      imageUrl: data.imageUrl,
      description: data.description,
      author: data.author,
      categories: data.categories,
      categoriesWithSubs: data.categoriesWithSubs,
      language: data.language,
      copyright: data.copyright,
    };
  });
});

async function fetchAndSavePodcast(feedUrl: string, isNewPodcast: boolean) {
  const feed = await parser.parseURL(feedUrl);

  const now = new Date();
  const author = feed.itunes ? feed.itunes.author : '';
  const imageUrl = feed.itunes ? feed.itunes.image : '';
  const categories = feed.itunes ? feed.itunes.categories : [];
  const categoriesWithSubs = feed.itunes ? feed.itunes.categoriesWithSubs : [];
  const podcastData = {
    title: feed.title,
    author: author,
    description: feed.description,
    imageUrl,
    feedUrl,
    categories,
    categoriesWithSubs,
    language: feed.language,
    copyright: feed.copyright,
    updatedAt: feed.lastBuildDate ? new Date(feed.lastBuildDate) : now,
  };

  const podcastSnapshot = await admin
    .firestore()
    .collection(CHANNEL_DOCUMENT_NAME)
    .where('url', '==', feedUrl)
    .get();
  let podcastRef: FirebaseFirestore.DocumentReference;

  if (podcastSnapshot.empty) {
    // 新規ポッドキャストの場合
    podcastRef = await admin.firestore().collection(CHANNEL_DOCUMENT_NAME).add(podcastData);
  } else {
    // 既存のポッドキャストの場合
    podcastRef = podcastSnapshot.docs[0].ref;
    await podcastRef.update(podcastData);
  }

  const episodesData = feed.items.map((item) => {
    return {
      guid: item.guid || item.link, // 一部のフィードでは、GUIDが存在しない場合があるため、その場合はlinkを代替として使用します
      title: item.title,
      description: item.content,
      url: item.enclosure ? item.enclosure.url : undefined,
      content: item.contentSnippet || item.content || '',
      duration: item.itunes ? item.itunes.duration : undefined,
      pubDate: item.pubDate ? new Date(item.pubDate) : now,
      season: item.itunes ? item.itunes.season : undefined,
      episode: item.itunes ? item.itunes.episode : undefined,
    };
  });

  const episodePromises = episodesData.map(async (episodeData) => {
    if (isNewPodcast) {
      // 新規ポッドキャストの場合、重複チェックなしでエピソードを追加
      await podcastRef.collection('Episodes').add(episodeData);
    } else {
      // 既存のポッドキャストの場合、重複チェックを行い、必要に応じてエピソードを更新
      const episodeSnapshot = await podcastRef
        .collection('Episodes')
        .where('guid', '==', episodeData.guid)
        .get();

      if (episodeSnapshot.empty) {
        // 新規エピソードの場合
        await podcastRef.collection('Episodes').add(episodeData);
      } else {
        // 既存のエピソードの場合
        const episodeRef = episodeSnapshot.docs[0].ref;

        // 必要に応じてエピソードを更新
        // 例えば、説明が異なる場合に更新する
        if (episodeData.description !== episodeSnapshot.docs[0].data().description) {
          await episodeRef.update(episodeData);
        }
      }
    }
  });

  await Promise.all(episodePromises);
}
