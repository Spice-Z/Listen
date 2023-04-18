import * as admin from 'firebase-admin';
import * as Parser from 'rss-parser';
import { CHANNEL_DOCUMENT_NAME, EPISODE_DOCUMENT_NAME } from '../constans';

const parser = new Parser();
export async function fetchAndSavePodcast(feedUrl: string) {
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

  const channelSnapshot = await admin
    .firestore()
    .collection(CHANNEL_DOCUMENT_NAME)
    .where('feedUrl', '==', feedUrl)
    .get();
  let channelRef: FirebaseFirestore.DocumentReference;
  let isNewPodcastShow = false;
  if (channelSnapshot.empty) {
    // 新規ポッドキャストの場合
    channelRef = await admin.firestore().collection(CHANNEL_DOCUMENT_NAME).add(podcastData);
    isNewPodcastShow = true;
    console.log('new ');
  } else {
    // 既存のポッドキャストの場合
    channelRef = channelSnapshot.docs[0].ref;
    await channelRef.update(podcastData);
    console.log('old');
  }

  const episodesData = feed.items.map((item) => {
    return {
      guid: item.guid || item.link, // 一部のフィードでは、GUIDが存在しない場合があるため、その場合はlinkを代替として使用します
      title: item.title,
      description: item.content,
      url: item.enclosure ? item.enclosure.url : undefined,
      content: item.contentSnippet || item.content || '',
      duration: item.itunes ? item.itunes.duration : undefined,
      imageUrl: item.itunes && item.itunes.image ? item.itunes.image : '',
      pubDate: item.pubDate ? new Date(item.pubDate) : now,
      season: item.itunes ? item.itunes.season : undefined,
      episode: item.itunes ? item.itunes.episode : undefined,
    };
  });

  const episodePromises = episodesData.map(async (episodeData) => {
    let episodeId: string | undefined;
    let pubDate: Date | undefined;
    let url = episodeData.url;
    if (isNewPodcastShow) {
      // 新規ポッドキャストの場合、重複チェックなしでエピソードを追加
      const episodeDocRef = await channelRef.collection(EPISODE_DOCUMENT_NAME).add(episodeData);
      episodeId = episodeDocRef.id;
      pubDate = episodeData.pubDate;
    } else {
      // 既存のポッドキャストの場合、重複チェックを行い、必要に応じてエピソードを更新
      const episodeSnapshot = await channelRef
        .collection(EPISODE_DOCUMENT_NAME)
        .where('guid', '==', episodeData.guid)
        .get();

      if (episodeSnapshot.empty) {
        // 新規エピソードの場合
        const episodeDocRef = await channelRef.collection(EPISODE_DOCUMENT_NAME).add(episodeData);
        episodeId = episodeDocRef.id;
        pubDate = episodeData.pubDate;
      } else {
        // 既存のエピソードの場合
        const episodeDocRef = episodeSnapshot.docs[0].ref;

        // pubDateが一ヶ月以上前の場合、エピソードを更新しない
        if (episodeData.pubDate < new Date(new Date().setMonth(new Date().getMonth() - 1))) {
          return { episodeId, pubDate, url };
        }

        // rssから取得した更新日時変更されていたらエピソードも更新
        if (episodeData.pubDate !== episodeSnapshot.docs[0].data().pubDate) {
          await episodeDocRef.update(episodeData);
          if (episodeData.url !== episodeSnapshot.docs[0].data().url) {
            episodeId = episodeDocRef.id;
            pubDate = episodeData.pubDate;
          }
        }
      }
    }
    return { episodeId, pubDate, url };
  });

  const newEpisodes = await Promise.all(episodePromises);
  return {
    channelId: channelRef.id,
    episodes: newEpisodes.filter<{ episodeId: string; pubDate: Date; url: string }>(
      (episode): episode is { episodeId: string; pubDate: Date; url: string } =>
        episode.episodeId !== undefined && episode.pubDate !== undefined
    ),
  };
}
