import * as functions from 'firebase-functions';
import { FieldValue, getFirestore } from 'firebase-admin/firestore';
import { CHANNEL_DOCUMENT_NAME, EPISODE_DOCUMENT_NAME } from '../../constants.js';

export const tmp = functions
  .runWith({
    timeoutSeconds: 540,
  })
  .region('asia-northeast1')
  .https.onCall(async () => {
    const store = getFirestore();

    // 全てのチャンネルとエピソードに対して、canDirectionフィールドで設定している値をcanDictationフィールドにコピーする
    // また、全てのチャンネルとエピソードのcanDirectionフィールドを削除する

    const channelCollectionShapshot = await store.collection(CHANNEL_DOCUMENT_NAME).get();
    // for文でchannelCollectionShapshotを回す
    for (const channelDoc of channelCollectionShapshot.docs) {
      const channelFromDB = channelDoc.data();
      // channelFromDBのid,nameをログに出す
      console.log({ title: channelFromDB.title });
      console.log({ id: channelDoc.id });
      // canDirectionの値をcanDictationにコピー
      await store
        .collection(CHANNEL_DOCUMENT_NAME)
        .doc(channelDoc.id)
        .update({ canDictation: channelFromDB.canDirection });

      // canDirectionフィールド自体を削除
      await store
        .collection(CHANNEL_DOCUMENT_NAME)
        .doc(channelDoc.id)
        .update({ canDirection: FieldValue.delete() });

      // channelDocのidを元に、channelのエピソードを取得する
      const episodesFromDB = await store
        .collection(CHANNEL_DOCUMENT_NAME)
        .doc(channelDoc.id)
        .collection(EPISODE_DOCUMENT_NAME)
        .get();

      // batchアップデートで、エピソードのcanDirectionをfalseにする
      // batchは500件までしかupdateできないので、episodeを500件ずつに分けた配列を作る
      // その配列をfor文で回して、batchアップデートをする
      const episodesArray = episodesFromDB.docs;
      const episodesArrayLength = episodesArray.length;
      const episodesArray500 = [];
      for (let i = 0; i < episodesArrayLength; i += 500) {
        episodesArray500.push(episodesArray.slice(i, i + 500));
      }
      console.log('episodesArray500.length', episodesArray500.length);
      for (const episodesArray500Item of episodesArray500) {
        const batch = store.batch();
        episodesArray500Item.forEach((episodeDoc) => {
          batch.update(episodeDoc.ref, { canDictation: episodeDoc.data().canDirection });
          batch.update(episodeDoc.ref, { canDirection: FieldValue.delete() });
        });
        console.log('commit');
        console.log({
          channelId: channelDoc.id,
        });
        await batch.commit();
      }
    }

    return { success: true };
  });
