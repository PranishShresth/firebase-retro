import { Board, List, Item } from "utils/interfaces";

export interface RetroBoardState {
  board: Partial<Board>;
  lists: List[];
  items: Item[];
  allBoards: Board[];
  status: string;
}
export const initialState = {
  board: {},
  allBoards: [],
  lists: [],
  items: [],
  status: "",
} as unknown as RetroBoardState;

interface PayloadAction<T> {
  type: string;
  payload?: T;
}

export function RetroBoardReducer(
  state: RetroBoardState,
  action: PayloadAction<any>
) {
  const { payload } = action;
  switch (action.type) {
    case "FETCH_BOARD_REQUESTED": {
      return { ...state, status: "pending" };
    }
    case "FETCH_BOARDS_FULFILLED": {
      return { ...state, allBoards: payload };
    }
    case "FETCH_BOARD_FULFILLED": {
      return { ...state, ...payload, status: "fulfilled" };
    }
    case "FETCH_LISTS_FULFILLED": {
      return { ...state, lists: payload, status: "fulfilled" };
    }

    case "FETCH_ITEMS_FULFILLED": {
      return { ...state, items: payload, status: "fulfilled" };
    }
    case "REORDER_ITEM_REQUESTED": {
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
    default:
      return state;
  }
}
