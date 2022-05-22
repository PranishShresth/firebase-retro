import { Timestamp } from "firebase/firestore";
import { User } from "firebase/auth";

export type PermissionLevel = "public" | "private"

export type AnonymousUser = Pick<User, "uid" | "isAnonymous" | "metadata">;

export interface UserDetails {
  created_at: { seconds: number; nanoseconds: number };
  email: string;
  first_name: string;
  surname: string;
  user_id: string;
}

export interface Auth {
  isLoadingUserData: boolean;
  updateUser: (data: User) => void;
  updateUserDetails: (data: UserDetails) => void;
  user: null | AnonymousUser;
  userDetails: null | UserDetails;
}


export interface Preference {
  permissionLevel: PermissionLevel
  customBackground: boolean;
  closed: boolean;
  teamId: string;
}

export interface Board {
  board_colour: string;
  board_id: string;
  board_title: string;
  board_limit: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  prefs: Preference
  createdBy: UserDetails
}

export interface BoardWithDocId extends Board {
  doc_id: string;
}

export interface List {
  list_colour: string;
  list_id: string;
  list_order: number;
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
