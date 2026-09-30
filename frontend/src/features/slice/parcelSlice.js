import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "sonner";
import { axiosInstance } from "@/services/axiosInstance";

const getErrorMessage = (error) =>
  error?.response?.data?.message ||
  error?.message ||
  "Something went wrong";


// Track Parcel
export const trackParcelThunk = createAsyncThunk(
  "parcels/tracking",
  async (trackingId, thunkAPI) => {
    try {
      const { data } = await axiosInstance.get(
        `/parcels/tracking/${trackingId}`
      );

      toast.success("Parcel found");

      return data;
    } catch (error) {
      const message = getErrorMessage(error);

      toast.error(message);

      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Calculate Cost

export const calculateCostThunk = createAsyncThunk(
  "parcels/calculateCost",
  async (payload, thunkAPI) => {
    try {
      const { data } = await axiosInstance.post(
        "/parcels/calculate-cost",
        payload
      );

      toast.success("Cost calculated");

      return data.cost;
    } catch (error) {
      const message = getErrorMessage(error);

      toast.error(message);

      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Create Customer Parcel
export const createParcelThunk = createAsyncThunk(
  "parcels/createCustomerParcel",
  async (payload, thunkAPI) => {
    try {
      const { data } = await axiosInstance.post(
        "/parcels/customer",
        payload
      );

      toast.success(
        data?.message || "Shipment created successfully"
      );

      return data;
    } catch (error) {
      const message = getErrorMessage(error);

      toast.error(message);

      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Fetch My Shipments

export const fetchMyShipmentsThunk = createAsyncThunk(
  "parcels/fetchMyShipments",
  async (_, thunkAPI) => {
    try {
      const { data } = await axiosInstance.get(
        "/parcels/my-shipments"
      );

      return data?.data || [];
    } catch (error) {
      const message = getErrorMessage(error);

      toast.error(message);

      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Fetch Single Shipment

export const fetchMyShipmentByIdThunk = createAsyncThunk(
  "parcels/fetchMyShipmentById",
  async (id, thunkAPI) => {
    try {
      const { data } = await axiosInstance.get(
        `/parcels/my-shipments/${id}`
      );

      return data?.parcel || null;
    } catch (error) {
      const message = getErrorMessage(error);

      toast.error(message);

      return thunkAPI.rejectWithValue(message);
    }
  }
);


//  Initial State

const initialState = {
  // Tracking
  trackParcel: null,
  trackLoading: false,
  trackError: null,
  
  // Cost
  costQuote: null,
  costLoading: false,
  costError: null,

  createLoading: false,
  createError: null,

  // Customer shipments
  myShipments: [],
  shipmentsLoading: false,
  shipmentsError: null,

  // Single shipment
  selectedShipment: null,
  selectedShipmentLoading: false,
  selectedShipmentError: null,
};

//  Initial State

const parcelSlice = createSlice({
  name: "parcels",

  initialState,

  reducers: {
    clearTrack: (state) => {
      state.trackParcel = null;
      state.trackError = null;
    },

    clearCost: (state) => {
      state.costQuote = null;
      state.costError = null;
    },

    clearMyShipments: (state) => {
      state.myShipments = [];
      state.shipmentsError = null;
    },

    clearSelectedShipment: (state) => {
      state.selectedShipment = null;
      state.selectedShipmentError = null;
    },
  },

  extraReducers: (builder) => {
    builder

      //  Track Parcel
      
      .addCase(trackParcelThunk.pending, (state) => {
        state.trackLoading = true;
        state.trackError = null;
        state.trackParcel = null;
      })

      .addCase(trackParcelThunk.fulfilled, (state, action) => {
        state.trackLoading = false;
        state.trackParcel = action.payload?.parcel || null;
      })

      .addCase(trackParcelThunk.rejected, (state, action) => {
        state.trackLoading = false;
        state.trackError =
          action.payload || "Failed to track parcel";
      })

      //  Calculate Cost
      
      .addCase(calculateCostThunk.pending, (state) => {
        state.costLoading = true;
        state.costError = null;
        state.costQuote = null;
      })

      .addCase(calculateCostThunk.fulfilled, (state, action) => {
        state.costLoading = false;
        state.costQuote = action.payload;
      })

      .addCase(calculateCostThunk.rejected, (state, action) => {
        state.costLoading = false;
        state.costError =
          action.payload || "Failed to calculate cost";
      })

      //  My Shipments

      .addCase(fetchMyShipmentsThunk.pending, (state) => {
        state.shipmentsLoading = true;
        state.shipmentsError = null;
      })

      .addCase(
        fetchMyShipmentsThunk.fulfilled,
        (state, action) => {
          state.shipmentsLoading = false;
          state.myShipments = action.payload;
        }
      )

      .addCase(
        fetchMyShipmentsThunk.rejected,
        (state, action) => {
          state.shipmentsLoading = false;
          state.shipmentsError =
            action.payload ||
            "Failed to load your shipments";
        }
      )

      //  Single Shipment

      .addCase(
        fetchMyShipmentByIdThunk.pending,
        (state) => {
          state.selectedShipmentLoading = true;
          state.selectedShipmentError = null;
          state.selectedShipment = null;
        }
      )

      .addCase(
        fetchMyShipmentByIdThunk.fulfilled,
        (state, action) => {
          state.selectedShipmentLoading = false;
          state.selectedShipment = action.payload;
        }
      )

      .addCase(
        fetchMyShipmentByIdThunk.rejected,
        (state, action) => {
          state.selectedShipmentLoading = false;
          state.selectedShipmentError =
            action.payload ||
            "Failed to load shipment";
        }
      )

      .addCase(createParcelThunk.pending, (state) => {
        state.createLoading = true;
        state.createError = null;
      })

      .addCase(createParcelThunk.fulfilled, (state, action) => {
       state.createLoading = false;
       state.createError = null;

       const newParcel = action.payload?.parcel;

      if (newParcel) {
      state.myShipments.unshift(newParcel);
        }
        })

      .addCase(createParcelThunk.rejected, (state, action) => {
        state.createLoading = false;
        state.createError =
          action.payload || "Failed to create shipment";
      });
  },
});

export const {
  clearTrack,
  clearCost,
  clearMyShipments,
  clearSelectedShipment,
} = parcelSlice.actions;

export default parcelSlice.reducer;