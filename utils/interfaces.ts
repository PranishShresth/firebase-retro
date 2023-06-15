import { Timestamp } from "firebase/firestore";
import { User } from "firebase/auth";
import { add } from "date-fns";

export type PermissionLevel = "public" | "private";

export type AnonymousUser = Pick<User, "uid" | "isAnonymous" | "metadata">;

type WorkspacesIds = string[];
type BoardIds = string[];
type UserUpvotes = string[];

export interface Member {
  /* UUID - unique userId per user*/
  userId: string;
  /* Birth Date of the user*/
  birthDate?: string;
  /* User creation timestamp */
  createdAt?: Timestamp;
  /* Unique email of the user */
  email: string;
  /* First name of the user */
  firstName: string;
  /* Last name of the user */
  lastName: string;
  /* List of the workspace user belongs to*/
  workspaces: WorkspacesIds;
  /* List of the boards user belongs to*/
  boards: BoardIds;
}

export interface Workspace {
  /* Id of the workspace */
  workspaceId: string;
  /* Title of the workspace */
  workspaceTitle: string;
  /* Description of the workspace */
  workspaceDescription: string;
  /* Members of the workspace */
  members: Member[];
  /* Id of workspace creator*/
  userId: string;
  /*Timestamps  of the workspace */
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Auth {
  isLoading: boolean;
  updateUser: (data: User) => void;
  updateMember: (data: Member) => void;
  user: null | AnonymousUser;
  member: null | Member;
}

interface Timer {
  /* Countdown duration */
  duration: number;
  /* Countdown timestamp */
  startAt: Timestamp | null;
}

export interface Preference {
  /* Permission level if board can viewed publicly or privately */
  permissionLevel: PermissionLevel;
  /* Archiving a board which is not used */
  closed: boolean;
  /* Creates a timer for that board */
  timer: Timer | null;
  /* Visibility of items, if set to true, user can only see their own items */
  hideItems?: boolean;
}

export interface Board {
  /* Colour of the board */
  boardColour: string;
  /* UUID - unique identifier of the board */
  boardId: string;
  /* Title of the board  */
  boardTitle: string;
  /* Workspace of the board it belongs to  */
  workspaceId: string;
  /* Creation timestamp */
  createdAt: Timestamp;
  /* Update timestamp - anytime user writes/updates information */
  updatedAt: Timestamp;
  /* Board preference */
  prefs: Preference;
  /* Members of the board who have access */
  members: Member[];
  /*Id of the owner of the board*/
  userId: string;
  /*Short Id of the board for better readability*/
  slug: string;
}

export interface BoardWithDocId extends Board {
  doc_id: string;
}

export interface List {
  /* Colour identifier of the list*/
  listColour: string;
  /* List identifer */
  listId: string;
  /* Position of the list - future implementation */
  listOrder: number;
  /* Title of the list */
  listTitle: string;
  /* Id of the board*/
  boardId: string;
  /*Id of the user who created this item*/
  userId: Member;
  /* creation timestamp*/
  createdAt: Timestamp;
  /* update timestamp*/
  updatedAt: Timestamp;
}

export interface Item {
  /*UUID for each item*/
  itemId: string;
  /*Title of the item*/
  itemTitle: string;
  /*Position of the list that item belongs to*/
  itemOrder: number;
  /*Id of the board that item belongs to*/
  boardId: string;
  /*Id of the list that item belongs to*/
  listId: string;
  /*Id of the user who created this item*/
  userId: string;
  /*List of the user ids who have voted on this item*/
  itemUpvotes: UserUpvotes;
  /* Created timestamp */
  createdAt: Timestamp;
}

export interface Upvotes {
  userId: string;
}
