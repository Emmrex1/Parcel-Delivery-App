import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "sonner";
import axios from "axios";

const API_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

const getErrorMessage = (error) =>
  error?.response?.data?.message ||
  error?.message ||
  "Something went wrong";

// LOGIN

export const loginThunk = createAsyncThunk(
  "auth/login",
  async ({ email, password, remember }, thunkAPI) => {
    try {
      const { data } = await axios.post(
        `${API_URL}/auth/login`,
        {
          email,
          password,
        },
        {
          withCredentials: true,
        }
      );

      const storage = remember ? localStorage : sessionStorage;

      if (data?.token) {
        storage.setItem("token", data.token);
      }

      if (data?.accessToken) {
        storage.setItem("accessToken", data.accessToken);
      }

      if (data?.user) {
        storage.setItem("user", JSON.stringify(data.user));
      }

      toast.success("Welcome back!");

      return data;
    } catch (error) {
      const message = getErrorMessage(error);

      toast.error(message);

      return thunkAPI.rejectWithValue(message);
    }
  }
);

// REGISTER

export const registerThunk = createAsyncThunk(
  "auth/register",
  async (payload, thunkAPI) => {
    try {
      const { data } = await axios.post(
        `${API_URL}/auth/register`,
        payload,
        {
          withCredentials: true,
        }
      );

      toast.success(
        data?.message || "Account created successfully"
      );

      return data;
    } catch (error) {
      const message = getErrorMessage(error);

      toast.error(message);

      return thunkAPI.rejectWithValue(message);
    }
  }
);

// INITIAL AUTH STATE

const getStoredUser = () => {
  try {
    const user =
      localStorage.getItem("user") ||
      sessionStorage.getItem("user");

    return user ? JSON.parse(user) : null;
  } catch {
    return null;
  }
};

const getStoredToken = () =>
  localStorage.getItem("token") ||
  sessionStorage.getItem("token") ||
  localStorage.getItem("accessToken") ||
  sessionStorage.getItem("accessToken");

const initialState = {
  user: getStoredUser(),
  token: getStoredToken(),
  isAuthenticated: Boolean(getStoredToken()),
  loading: false,
  error: null,
};

// SLICE

const authSlice = createSlice({
  name: "auth",

  initialState,

  reducers: {
    logout: (state) => {
      localStorage.removeItem("token");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");

      sessionStorage.removeItem("token");
      sessionStorage.removeItem("accessToken");
      sessionStorage.removeItem("user");

      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;

      toast.success("Logged out successfully");
    },

    clearAuthError: (state) => {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder

      // LOGIN
      .addCase(loginThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(loginThunk.fulfilled, (state, action) => {
        state.loading = false;

        state.user = action.payload?.user || null;

        state.token =
          action.payload?.token ||
          action.payload?.accessToken ||
          null;

        state.isAuthenticated = Boolean(state.token);
      })

      .addCase(loginThunk.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload || "Unable to sign in";
      })

      // REGISTER
      .addCase(registerThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(registerThunk.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })

      .addCase(registerThunk.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload || "Unable to create account";
      });
  },
});

export const {
  logout,
  clearAuthError,
} = authSlice.actions;

export default authSlice.reducer;