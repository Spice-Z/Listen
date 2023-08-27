import * as admin from 'firebase-admin';
import { registerChannel } from './endPoint/registerChannel';
import { autoGenerateTranscript } from './endPoint/autoGenerateTranscript';
import { autoGenerateTranslatedTranscript } from './endPoint/autoGenerateTranslatedTranscript';
import { autoUpdateChannelAndEpisodes } from './endPoint/autoUpdateChannelAndEpisodes';
import { generateTranslatedTranscript } from './endPoint/generateTranslatedTranscript';
import { generateTranscriptFromIds } from './endPoint/generateTranscriptFromIds';
import { updateShow } from './endPoint/updateShow';
import { getAvailableEpisodes } from './endPoint/getAvailableEpisodes';

admin.initializeApp();
admin.firestore().settings({
  ignoreUndefinedProperties: true,
});

export {
  autoGenerateTranscript,
  autoGenerateTranslatedTranscript,
  autoUpdateChannelAndEpisodes,
  registerChannel,
  getAvailableEpisodes,
  generateTranslatedTranscript,
  generateTranscriptFromIds,
  updateShow,
};
