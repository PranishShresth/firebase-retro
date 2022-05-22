import { Board, List, Item } from "utils/interfaces";

export interface RetroBoardState {
  board:Board;
  lists: List[];
  items: Item[];
  allBoards: Board[];
  status: string;
  filterPayload: string
}


export const initialState = {
  board: {},
  allBoards: [],
  lists: [],
  items: [],
  status: "",
  filterPayload: ""
} as unknown as RetroBoardState;




interface Reorder_Item_Payload {
  source: string;
  destination: string;
  item_id: string;
  position: number;
}




const FETCH_BOARD_REQUESTED = "FETCH_BOARD_REQUESTED"
const FETCH_BOARD_FULFILLED = "FETCH_BOARD_FULFILLED"
const FETCH_BOARDS_FULFILLED = "FETCH_BOARDS_FULFILLED"
const FETCH_ITEMS_FULFILLED = "FETCH_ITEMS_FULFILLED"
const FETCH_LISTS_FULFILLED = "FETCH_LISTS_FULFILLED"
const REORDER_ITEM_REQUESTED = "REORDER_ITEM_REQUESTED"
const SET_FILTER_ITEM_PAYLOAD = "SET_FILTER_ITEM_PAYLOAD"



type BoardPayload = { items: Item[]; lists: List[]; board: Board }


export type ActionTypes = {
  type: typeof FETCH_BOARD_REQUESTED,

} | { type: typeof FETCH_BOARDS_FULFILLED, payload: Board[] }
  | { type: typeof FETCH_ITEMS_FULFILLED, payload: Item[] }
  | { type: typeof FETCH_LISTS_FULFILLED, payload: List[] }
  | { type: typeof REORDER_ITEM_REQUESTED, payload: Reorder_Item_Payload }
  | { type: typeof FETCH_BOARD_FULFILLED, payload: BoardPayload }
  | { type: typeof SET_FILTER_ITEM_PAYLOAD, payload: string }






export function RetroBoardReducer(
  state: RetroBoardState,
  action: ActionTypes
) {
  switch (action.type) {
    case FETCH_BOARD_REQUESTED: {
      return { ...state, status: "pending" };
    }
    case FETCH_BOARDS_FULFILLED: {
      return { ...state, allBoards: action.payload, status: "fulfilled" };
    }
    case FETCH_BOARD_FULFILLED: {
      return { ...state, ...action.payload, status: "fulfilled" };
    }
    case FETCH_LISTS_FULFILLED: {
      return { ...state, lists: action.payload, status: "fulfilled" };
    }
    case FETCH_ITEMS_FULFILLED: {
      return { ...state, items: action.payload, status: "fulfilled" };
    }
    case REORDER_ITEM_REQUESTED: {
      const { source, destination, item_id, position } = action.payload;
      const items = [...state.items];
      const itemIdx = state.items.findIndex((s) => s.item_id === item_id);
      const item = items[itemIdx];
      if (source === destination) {
        item.item_order = position;
      } else {
        const item = state.items[itemIdx];
        item.item_order = position;
        item.list_id = destination;
      }
      return { ...state, items: items };
    }
    case SET_FILTER_ITEM_PAYLOAD: {
      return { ...state, filterPayload: action.payload }
    }
    default:
      return state;
  }
}




export const updateBoards = (payload: Board[]): ActionTypes => ({
  type: FETCH_BOARDS_FULFILLED,
  payload
})


export const updateBoard = (payload: BoardPayload): ActionTypes => ({
  type: FETCH_BOARD_FULFILLED,
  payload
})

export const reorderItem = (payload: Reorder_Item_Payload): ActionTypes => ({
  type: REORDER_ITEM_REQUESTED,
  payload
})

export const updateLists = (payload: List[]): ActionTypes => ({
  type: FETCH_LISTS_FULFILLED,
  payload
})

export const updateItems = (payload: Item[]): ActionTypes => ({
  type: FETCH_ITEMS_FULFILLED,
  payload
})

export const updateBoardToPending = (): ActionTypes => ({
  type: FETCH_BOARD_REQUESTED,
})

export const setFilterPayload = (filterString: string): ActionTypes => ({
  type: SET_FILTER_ITEM_PAYLOAD,
  payload: filterString
})