import { Timestamp } from "firebase/firestore";
import { User } from "firebase/auth";

export type PermissionLevel = "public" | "private";

export type AnonymousUser = Pick<User, "uid" | "isAnonymous" | "metadata">;

type WorkspacesIds = string[]

export interface UserDetails {
  birthDate?: string;
  createdAt: { seconds: number; nanoseconds: number };
  email: string;
  firstName: string;
  workspaces: WorkspacesIds
  lastName: string;
  userId: string;
}


export interface Workspace{
  workspaceId:string;
  workspaceTitle:string;
  workspaceDescription:string;
  createdAt: Timestamp;
  updatedAt:Timestamp;

}

export interface Auth {
  isLoadingUserData: boolean;
  updateUser: (data: User) => void;
  updateUserDetails: (data: UserDetails) => void;
  user: null | AnonymousUser;
  userDetails: null | UserDetails;
}

export interface Preference {
  permissionLevel: PermissionLevel;
  customBackground: boolean;
  closed: boolean;

}

export interface Board {
  boardColour: string;
  boardId: string;
  boardTitle: string;
  workspaceId: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  prefs: Preference;
  createdBy: UserDetails;
  timer: {
    seconds: number;
    startAt: Timestamp | null;
  };
}

export interface BoardWithDocId extends Board {
  doc_id: string;
}

export interface List {
  listColour: string;
  listId: string;
  listOrder: number;
  listTitle: string;
  boardId: string;
  createdAt: Timestamp;
}

export interface Item {
  itemId: string;
  itemTitle: string;
  itemOrder: number;
  boardId: string;
  listId: string;
  createdBy: UserDetails;
  itemUpvotes: string[];
  createdAt: Timestamp;
}

export interface Upvotes {
  userId: string;
}
