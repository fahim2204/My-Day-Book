// ** Redux Imports
import { createSlice } from "@reduxjs/toolkit";

export const filterDataSlice = createSlice({
  name: "filterData",
  initialState: {
    data: [],
  },
  reducers: {
    handleFilterData: (state, action) => {
      state.data = action.payload;
    },
  },
});

export const { handleFilterData } = filterDataSlice.actions;

export default filterDataSlice.reducer;
