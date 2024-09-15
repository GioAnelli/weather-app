import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  temperature: "C°",
  wind: "kn",
};

const unitsSlice = createSlice({
  name: "units",
  initialState,
  reducers: {
    setTemperature: (state, action) => {
      state.temperature = action.payload;
    },
    setWind: (state, action) => {
      state.wind = action.payload;
    },
  },
});

export const { setTemperature, setWind } = unitsSlice.actions;
export default unitsSlice.reducer;
