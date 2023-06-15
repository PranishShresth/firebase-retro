import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type RetroBoardPrefState = {
  filterString: string;
  sortByLikes: boolean;
};

export const prefIniitalState: RetroBoardPrefState = {
  filterString: "",
  sortByLikes: false,
};

const prefSlice = createSlice({
  name: "boardPref",
  initialState: prefIniitalState,
  reducers: {
    updateItemFilter(state, action: PayloadAction<string>) {
      state.filterString = action.payload;
    },
    updateItemsSort(state, action: PayloadAction<boolean>) {
      state.sortByLikes = action.payload;
    },
  },
});

const { updateItemFilter, updateItemsSort } = prefSlice.actions;
const prefReducer = prefSlice.reducer;
export { updateItemFilter, updateItemsSort, prefReducer };
