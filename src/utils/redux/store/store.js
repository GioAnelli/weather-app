import { configureStore } from "@reduxjs/toolkit";
import unitsReducer from "../unitsSlice";
import positionReducer from "../positionSlice";

export const store = configureStore({
  reducer: {
    units: unitsReducer,
    position: positionReducer,
  },
});
