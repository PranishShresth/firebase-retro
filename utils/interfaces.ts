import { serverTimestamp, Timestamp } from "firebase/firestore";

export interface Board {
  board_id: string;
  board_title: string;
  board_limit: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface BoardWithDocId extends Board {
  doc_id: string;
}

export interface List {
  list_id: string;
  list_title: string;
  board_id: string;
  user_id: string;
  createdAt: Timestamp;
}

export interface Item {
  item_id: string;
  item_title: string;
  item_order: number;
  board_id: string;
  list_id: string;
  user_id: string;
  item_upvotes: string[];
  createdAt: Timestamp;
}

export interface Upvotes {
  user_id: string;
}
