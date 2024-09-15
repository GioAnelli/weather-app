import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  meteoDescription: null,
};

const weatherSlice = createSlice({
  name: "weather",
  initialState: {
    weather: null,
    loading: false,
    error: null,
  },
  reducers: {
    setMeteoDescription(state, action) {
      state.meteoDescription = action.payload;
    },
  },
});

export const { setMeteoDescription } = weatherSlice.actions;
export default weatherSlice.reducer;
