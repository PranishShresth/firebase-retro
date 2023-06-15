import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Board, Item, List, Workspace } from "utils/interfaces";

export type RetroState = {
  board: Board;
  workspace: Workspace;
  lists: List[];
  items: Item[];
  allBoards: Board[];
  status: string;
};

export const boardInitialState = {
  board: {},
  allBoards: [],
  lists: [],
  workspace: {},
  items: [],
  status: "pending",
} as unknown as RetroState;

const pref = {
  filterString: "",
  sortByLikes: false,
};

type ReorderItemPayload = {
  source: string;
  destination: string;
  position: number;
  itemId: string;
};

type ReorderListPayload = {
  sourceIndex: number;
  destinationIndex: number;
};

type BoardPayload = { items?: Item[]; lists?: List[]; board?: Board };

const boardSlice = createSlice({
  name: "boardReducer",
  initialState: boardInitialState,
  reducers: {
    updateBoards(state, action) {
      state.allBoards = action.payload;

      state.status = "fulfilled";
    },
    updateBoard(state, action: PayloadAction<BoardPayload>) {
      const { board, lists, items } = action.payload;
      if (board) {
        state.board = board;
      }
      if (items) {
        state.items = items;
      }
      if (lists) {
        state.lists = lists;
      }

      state.status = "fulfilled";
    },
    reorderItem(state, action: PayloadAction<ReorderItemPayload>) {
      const { source, destination, itemId, position } = action.payload;
      const itemIdx = state.items.findIndex((s) => s.itemId === itemId);
      const item = state.items[itemIdx];
      if (source === destination) {
        item.itemOrder = position;
      } else {
        const item = state.items[itemIdx];
        item.itemOrder = position;
        item.listId = destination;
      }
    },
    reorderList(state, action: PayloadAction<ReorderListPayload>) {
      const { sourceIndex, destinationIndex } = action.payload;
      const lists = state.lists.sort((a, b) => a.listOrder - b.listOrder);
      const sourceList = lists[sourceIndex];
      const destList = lists[destinationIndex];

      [sourceList.listOrder, destList.listOrder] = [
        destList.listOrder,
        sourceList.listOrder,
      ];
    },

    updateLists(state, action: PayloadAction<List[]>) {
      state.lists = action.payload;
    },
    updateItems(state, action: PayloadAction<Item[]>) {
      state.items = action.payload;
    },
    updateWorkspace(state, action: PayloadAction<Workspace>) {
      state.workspace = action.payload;
    },
    updateBoardToPending(state) {
      state.status = "pending";
    },
  },
});

const {
  updateBoard,
  updateBoardToPending,
  updateBoards,
  updateItems,
  updateLists,
  updateWorkspace,
  reorderItem,
  reorderList,
} = boardSlice.actions;

const retroBoardReducer = boardSlice.reducer;

export {
  updateBoard,
  updateBoardToPending,
  updateBoards,
  updateItems,
  updateLists,
  updateWorkspace,
  reorderItem,
  reorderList,
  retroBoardReducer,
};
