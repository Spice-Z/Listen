import * as admin from 'firebase-admin';
import { registerChannel } from './endPoint/registerChannel';
import { getChannels } from './endPoint/getChannels';
import { getChannelById } from './endPoint/getChannelById';

admin.initializeApp();
admin.firestore().settings({
  ignoreUndefinedProperties: true,
});

export { registerChannel, getChannels, getChannelById };
