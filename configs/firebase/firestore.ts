import { initializeFirestore } from "@firebase/firestore";
import app from "./firebaseClient";

const firestore = initializeFirestore(app, {
  experimentalAutoDetectLongPolling: true,
});

export { firestore };
