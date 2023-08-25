import { initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

const app = initializeApp();

const getFirebaseUIdFromTokenOrThrow = async (token: string) => {
  try {
    const decodedToken = await getAuth().verifyIdToken(token);
    const uid = decodedToken.uid;
    return uid;
  } catch (error) {
    console.log(error);
    throw new Error('Invalid firebase token');
  }
};

const firestore = getFirestore();

export { app, firestore, getFirebaseUIdFromTokenOrThrow };
