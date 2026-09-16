import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "sonner";
import { axiosInstance } from "@/services/axiosInstance";

const getErrorMessage = (error) =>
  error?.response?.data?.message ||
  error?.message ||
  "Something went wrong";

//  Fetch All Analytics

export const fetchAnalyticsThunk = createAsyncThunk(
  "analytics/fetchAll",
  async (_, thunkAPI) => {
    try {
      const [
        summaryRes,
        revenueRes,
        parcelGrowthRes,
        topCitiesRes,
        deliveryPerformanceRes,
      ] = await Promise.all([
        axiosInstance.get("/analytics/summary"),

        axiosInstance.get("/analytics/revenue"),

        axiosInstance.get("/analytics/parcels-growth"),

        axiosInstance.get("/analytics/top-cities"),

        axiosInstance.get("/analytics/delivery-performance"),
      ]);

      return {
        summary: summaryRes.data?.data || null,

        revenueData: revenueRes.data?.data || [],

        parcelGrowthData: parcelGrowthRes.data?.data || [],

        topCitiesData: topCitiesRes.data?.data || [],

        deliveryPerformanceData:
          deliveryPerformanceRes.data?.data || [],
      };
    } catch (error) {
      const message = getErrorMessage(error);

      toast.error(message);

      return thunkAPI.rejectWithValue(message);
    }
  },
);

//  Initial State


const initialState = {
  summary: null,

  revenueData: [],

  parcelGrowthData: [],

  topCitiesData: [],

  deliveryPerformanceData: [],

  loading: false,

  error: null,
};

//  Analytics Slice

const analyticsSlice = createSlice({
  name: "analytics",

  initialState,

  reducers: {
    clearAnalytics: (state) => {
      state.summary = null;
      state.revenueData = [];
      state.parcelGrowthData = [];
      state.topCitiesData = [];
      state.deliveryPerformanceData = [];
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder

      //  Pending
      

      .addCase(fetchAnalyticsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      //  Fulfilled
      

      .addCase(fetchAnalyticsThunk.fulfilled, (state, action) => {
        state.loading = false;

        state.summary = action.payload?.summary || null;

        state.revenueData = action.payload?.revenueData || [];

        state.parcelGrowthData =
          action.payload?.parcelGrowthData || [];

        state.topCitiesData =
          action.payload?.topCitiesData || [];

        state.deliveryPerformanceData =
          action.payload?.deliveryPerformanceData || [];
      })

      //  Rejected
      

      .addCase(fetchAnalyticsThunk.rejected, (state, action) => {
        state.loading = false;

        state.error =
          action.payload || "Failed to load analytics";
      });
  },
});

export const { clearAnalytics } = analyticsSlice.actions;

export default analyticsSlice.reducer;