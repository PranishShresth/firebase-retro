import { firestore } from "configs/firebase/firestore";
import { collection } from "firebase/firestore";



export enum Collection {
    Boards = "boards",
    Lists = "lists",
    Items = "items",
    Users = "users",
    Workspaces = "workspaces"
    
}
export const boardsCollection = collection(firestore, Collection.Boards);
export const listsCollection = collection(firestore, Collection.Lists);
export const itemsCollection = collection(firestore, Collection.Items);
export const usersCollection = collection(firestore, Collection.Users);
export const workSpaceCollection = collection(firestore,Collection.Workspaces)
