import { Board, List, Item } from "utils/interfaces";

export interface RetroBoardState {
  board: Partial<Board>;
  lists: List[];
  items: Item[];
  status: string;
}
export const initialState = {
  board: {},
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
    case "FETCH_BOARD_FULFILLED": {
      return { ...payload, status: "fulfilled" };
    }
    case "FETCH_LISTS_FULFILLED": {
      return { ...state, lists: payload, status: "fulfilled" };
    }
  }
}
