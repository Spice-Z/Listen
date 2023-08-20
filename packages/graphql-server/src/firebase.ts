import { initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

const app = initializeApp()

const getFirebaseUIdFromTokenOrThrow= async (token: string) => {
 try {
  const decodedToken = await getAuth().verifyIdToken(token)
  const uid = decodedToken.uid;
  return uid
 } catch (error) {
  console.log(error)
  throw new Error('Invalid firebase token')
 }
}

export {
 app,
 getFirebaseUIdFromTokenOrThrow
}