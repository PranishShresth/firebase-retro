import { combineReducers } from "@reduxjs/toolkit";
import {
  updateBoard,
  updateBoardToPending,
  updateBoards,
  updateItems,
  updateLists,
  updateWorkspace,
  reorderItem,
  reorderList,
  boardInitialState,
  retroBoardReducer,
  RetroState,
} from "./RetroBoardReducer";

import {
  prefReducer,
  prefIniitalState,
  RetroBoardPrefState,
  updateItemFilter,
  updateItemsSort,
} from "./RetroPrefReducer";

export const initialState = {
  board: boardInitialState,
  boardPref: prefIniitalState,
};

export type RetroBoardState = {
  board: RetroState;
  boardPref: RetroBoardPrefState;
};

export const rootReducer = combineReducers({
  board: retroBoardReducer,
  boardPref: prefReducer,
});

export {
  updateBoard,
  updateBoardToPending,
  updateBoards,
  updateItems,
  updateLists,
  updateWorkspace,
  reorderItem,
  reorderList,
  updateItemFilter,
  updateItemsSort,
};
