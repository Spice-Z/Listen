import * as functions from 'firebase-functions';
import { getFirestore } from 'firebase-admin/firestore';

import {
  ALL_EPISODES_DOCUMENT_NAME,
  CHANNEL_DOCUMENT_NAME,
  EPISODE_DOCUMENT_NAME,
} from '../constants.js';

export const onEpisodeUpdate = functions
  .region('asia-northeast1')
  .firestore.document(`${CHANNEL_DOCUMENT_NAME}/{channelId}/${EPISODE_DOCUMENT_NAME}/{episodeId}`)
  .onWrite(async (change, context) => {
    const { channelId, episodeId } = context.params;
    console.log({ channelId, episodeId });
    const store = getFirestore();
    const document = change.after.exists ? change.after.data() : null;
    // 削除パターン
    // AvailableEpisodesからも削除する
    if (document == null) {
      console.log('delete episode');
      const episodeSnapShot = await store
        .collection(ALL_EPISODES_DOCUMENT_NAME)
        .where('channelId', '==', channelId)
        .where('episodeId', '==', episodeId)
        .get();
      await Promise.all(
        episodeSnapShot.docs.map(async (doc) => {
          await doc.ref.delete();
        }),
      );
      return;
    }

    // AvailableEpisodesに存在しない場合は追加し、ない場合は更新する
    const episodeSnapShot = await store
      .collection(ALL_EPISODES_DOCUMENT_NAME)
      .where('channelId', '==', channelId)
      .where('episodeId', '==', episodeId)
      .get();

    if (episodeSnapShot.empty) {
      console.log('add episode');
      await store.collection(ALL_EPISODES_DOCUMENT_NAME).add({
        ...document,
        channelId: channelId,
        episodeId: episodeId,
      });
      return;
    }
    console.log('update episode');
    await Promise.all(
      episodeSnapShot.docs.map(async (doc) => {
        await doc.ref.update({
          ...document,
          channelId: channelId,
          episodeId: episodeId,
        });
      }),
    );
  });
