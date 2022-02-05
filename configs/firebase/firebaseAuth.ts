import { getAuth, signInAnonymously, UserCredential } from "firebase/auth";

export const signInWithAnonymousCredentials = (): Promise<UserCredential> => {
  return signInAnonymously(getAuth());
};
