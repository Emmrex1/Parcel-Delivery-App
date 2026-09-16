import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "sonner";
import { axiosInstance } from "@/services/axiosInstance";

const getErrorMessage = (error) =>
  error?.response?.data?.message ||
  error?.message ||
  "Something went wrong";

//  Login


export const loginThunk = createAsyncThunk(
  "auth/login",
  async (payload, thunkAPI) => {
    try {
      const { data } = await axiosInstance.post("/auth/login", payload);

      // Save JWT for authenticated API requests
      if (data?.token) {
        localStorage.setItem("token", data.token);
      }

      // Save user information separately
      if (data?.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
      }

      toast.success("Logged in successfully");

      return data;
    } catch (error) {
      const message = getErrorMessage(error);

      toast.error(message);

      return thunkAPI.rejectWithValue(message);
    }
  },
);


//  Add Admin/User


export const addUserThunk = createAsyncThunk(
  "auth/add-user",
  async (payload, thunkAPI) => {
    try {
      const { data } = await axiosInstance.post(
        "/auth/add-user",
        payload,
      );

      toast.success("User created successfully");

      return data;
    } catch (error) {
      const message = getErrorMessage(error);

      toast.error(message);

      return thunkAPI.rejectWithValue(message);
    }
  },
);

//  Initial State


const savedUser = localStorage.getItem("user");

const initialState = {
  token: localStorage.getItem("token") || null,

  user: savedUser ? JSON.parse(savedUser) : null,

  loading: false,

  addUserLoading: false,

  error: null,

  addUserError: null,
};

//  Auth Slice


const authSlice = createSlice({
  name: "auth",

  initialState,

  reducers: {
    logout: (state) => {
      // Remove authentication data
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      // Clear Redux authentication state
      state.token = null;
      state.user = null;
      state.loading = false;
      state.addUserLoading = false;
      state.error = null;
      state.addUserError = null;
    },

    clearAuthError: (state) => {
      state.error = null;
      state.addUserError = null;
    },
  },

  extraReducers: (builder) => {
    builder

      //  Login
      

      .addCase(loginThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(loginThunk.fulfilled, (state, action) => {
        state.loading = false;

        state.token = action.payload?.token || null;

        state.user = action.payload?.user || null;

        state.error = null;
      })

      .addCase(loginThunk.rejected, (state, action) => {
        state.loading = false;

        state.error =
          action.payload || "Login failed";
      })

      //  Add User
      

      .addCase(addUserThunk.pending, (state) => {
        state.addUserLoading = true;
        state.addUserError = null;
      })

      .addCase(addUserThunk.fulfilled, (state) => {
        state.addUserLoading = false;
        state.addUserError = null;
      })

      .addCase(addUserThunk.rejected, (state, action) => {
        state.addUserLoading = false;

        state.addUserError =
          action.payload || "Failed to create user";
      });
  },
});

export const {
  logout,
  clearAuthError,
} = authSlice.actions;

export default authSlice.reducer;