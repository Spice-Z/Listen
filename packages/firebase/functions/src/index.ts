import { initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { registerChannel } from './endPoint/registerChannel.js';
import { autoGenerateTranscript } from './endPoint/autoGenerateTranscript.js';
import { autoGenerateTranslatedTranscript } from './endPoint/autoGenerateTranslatedTranscript.js';
import { autoUpdateChannelAndEpisodes } from './endPoint/autoUpdateChannelAndEpisodes.js';
import { generateTranslatedTranscript } from './endPoint/generateTranslatedTranscript.js';
import { generateTranscriptFromIds } from './endPoint/generateTranscriptFromIds.js';
import { updateShow } from './endPoint/updateShow.js';
import { onEpisodeUpdate } from './endPoint/onEpisodeUpdate.js';

initializeApp();
getFirestore().settings({
  ignoreUndefinedProperties: true,
});

export {
  autoGenerateTranscript,
  autoGenerateTranslatedTranscript,
  autoUpdateChannelAndEpisodes,
  registerChannel,
  generateTranslatedTranscript,
  generateTranscriptFromIds,
  updateShow,
  onEpisodeUpdate,
};
