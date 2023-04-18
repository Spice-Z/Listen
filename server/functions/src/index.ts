import * as admin from 'firebase-admin';
import { registerChannel } from './endPoint/registerChannel';
import { getChannels } from './endPoint/getChannels';
import { getChannelById } from './endPoint/getChannelById';
import { getEpisodesByChannelId } from './endPoint/getEpisodesByChannelId';
import { getEpisodeById } from './endPoint/getEpisodeById';
import { generateTranscript } from './endPoint/generateTranscript';
import { generateTranslatedTranscript } from './endPoint/generateTranslatedTranscript';
import { generateTranscriptFromIds } from './endPoint/generateTranscriptFromIds';
import { updateShow } from './endPoint/updateShow';

admin.initializeApp();
admin.firestore().settings({
  ignoreUndefinedProperties: true,
});

export {
  registerChannel,
  getChannels,
  getChannelById,
  getEpisodesByChannelId,
  getEpisodeById,
  generateTranscript,
  generateTranslatedTranscript,
  generateTranscriptFromIds,
  updateShow,
};
