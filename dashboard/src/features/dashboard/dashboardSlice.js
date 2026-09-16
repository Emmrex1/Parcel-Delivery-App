import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "sonner";
import { axiosInstance } from "@/services/axiosInstance";

const getErrorMessage = (error) =>
  error?.response?.data?.message ||
  error?.message ||
  "Something went wrong";

//  Fetch Dashboard Statistics

export const fetchDashboardStatsThunk = createAsyncThunk(
  "dashboard/fetchStats",

  async (_, thunkAPI) => {
    try {
      const { data } = await axiosInstance.get(
        "/dashboard/stats",
      );

      return data;
    } catch (error) {
      const message = getErrorMessage(error);

      toast.error(message);

      return thunkAPI.rejectWithValue(message);
    }
  },
);

//  Initial State

const initialState = {
  stats: null,
  loading: false,
  error: null,
};
 

// Dashboard Slice

const dashboardSlice = createSlice({
  name: "dashboard",

  initialState,

  reducers: {},

  extraReducers: (builder) => {
    builder

      .addCase(
        fetchDashboardStatsThunk.pending,
        (state) => {
          state.loading = true;
          state.error = null;
        },
      )

      .addCase(
        fetchDashboardStatsThunk.fulfilled,
        (state, action) => {
          state.loading = false;

          /*
           * Backend response:
           *
           * {
           *   success: true,
           *   data: {
           *     totals: ...,
           *     statusDistribution: ...,
           *     monthlyParcels: ...,
           *     monthlyRevenue: ...,
           *     weightDistribution: ...
           *   }
           * }
           */

          state.stats = action.payload?.data || null;
        },
      )

      .addCase(
        fetchDashboardStatsThunk.rejected,
        (state, action) => {
          state.loading = false;

          state.error =
            action.payload ||
            "Failed to load dashboard stats";
        },
      );
  },
});

export default dashboardSlice.reducer;