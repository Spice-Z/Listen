import { initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { registerChannel } from './endPoint/registerChannel.js';
import { autoGenerateTranscript } from './endPoint/autoGenerateTranscript.js';
import { autoGenerateTranslatedTranscript } from './endPoint/autoGenerateTranslatedTranscript.js';
import { autoUpdateChannelAndEpisodes } from './endPoint/autoUpdateChannelAndEpisodes.js';
import { generateTranslatedTranscript } from './endPoint/generateTranslatedTranscript.js';
import { generateTranscriptFromIds } from './endPoint/generateTranscriptFromIds.js';
import { updateShow } from './endPoint/updateShow.js';
import { getAvailableEpisodes } from './endPoint/getAvailableEpisodes.js';

initializeApp();
getFirestore().settings({
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
