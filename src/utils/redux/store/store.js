import { configureStore } from "@reduxjs/toolkit";
import weatherReducer from "../weatherSlice";
import unitsReducer from "../unitsSlice";
import positionReducer from "../positionSlice";

export const store = configureStore({
  reducer: {
    weather: weatherReducer,
    units: unitsReducer,
    position: positionReducer,
  },
});
