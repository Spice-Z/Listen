import * as admin from 'firebase-admin';
import { registerChannel } from './endPoint/registerChannel';
import { getChannels } from './endPoint/getChannels';
import { getChannelById } from './endPoint/getChannelById';
import { getEpisodesByChannelId } from './endPoint/getEpisodesByChannelId';
import { getEpisodeById } from './endPoint/getEpisodeById';
import { autoGenerateTranscript } from './endPoint/autoGenerateTranscript';
import { autoGenerateTranslatedTranscript } from './endPoint/autoGenerateTranslatedTranscript';
import { generateTranslatedTranscript } from './endPoint/generateTranslatedTranscript';
import { generateTranscriptFromIds } from './endPoint/generateTranscriptFromIds';
import { updateShow } from './endPoint/updateShow';
import { autoUpdateShows } from './endPoint/autoUpdateShows';
import { getAvailableEpisodes } from './endPoint/getAvailableEpisodes';

admin.initializeApp();
admin.firestore().settings({
  ignoreUndefinedProperties: true,
});

export {
  autoGenerateTranscript,
  autoGenerateTranslatedTranscript,
  autoUpdateShows,
  registerChannel,
  getChannels,
  getChannelById,
  getEpisodesByChannelId,
  getAvailableEpisodes,
  getEpisodeById,
  generateTranslatedTranscript,
  generateTranscriptFromIds,
  updateShow,
};
