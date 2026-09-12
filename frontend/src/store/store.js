import { configureStore } from "@reduxjs/toolkit";
import parcelReducer from "./slice/parcelSlice";

export const store = configureStore({
  reducer: {
    parcels: parcelReducer,
  },
});
