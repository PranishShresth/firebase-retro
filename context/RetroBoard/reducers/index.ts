import { combineReducers } from "@reduxjs/toolkit";
import {
  boardInitialState,
  reorderItem,
  reorderList,
  retroBoardReducer,
  RetroState,
  updateBoard,
  updateBoards,
  updateBoardToPending,
  updateItems,
  updateLists,
  updateWorkspace,
} from "./RetroBoardReducer";
import {
  prefIniitalState,
  prefReducer,
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
