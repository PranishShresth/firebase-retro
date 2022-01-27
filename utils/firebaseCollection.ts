import { firestore } from "configs/firebase/firestore";
import { collection } from "firebase/firestore";

export const boardsRef = collection(firestore, "boards");
export const listsRef = collection(firestore, "lists");
export const itemsRef = collection(firestore, "items");
