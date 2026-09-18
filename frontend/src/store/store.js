import { configureStore } from "@reduxjs/toolkit";

import parcelReducer from "../features/slice/parcelSlice";
import authReducer from "../features/slice/authSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    parcels: parcelReducer,
  },
});