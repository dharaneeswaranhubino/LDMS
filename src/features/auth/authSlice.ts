import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { AuthState, ChangePasswordPayload, UpdateProfilePayload, User } from "./authTypes";
import { api } from "../../lib/axios";

//initialize auth (page refresh)
export const initializeAuth = createAsyncThunk(
  "auth/initializeAuth",
  async (_, { rejectWithValue }) => {
    try {
      // RefreshToken cookie automatic send -> new accessToken came
      const res = await api.post("/auth/refreshToken");
      return res.data.data as { accessToken: string; user: User };
    } catch (err) {
      console.error("Refresh failed:", err);
      return rejectWithValue(null);
    }
  }
);

// login
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (
    data: { email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const res = await api.post("/auth/login", data);
      return res.data.data as { accessToken: string; user: User };
    } catch (err: unknown) {
      const error = err as import("axios").AxiosError<{ message: string }>;
      return rejectWithValue(
        error.response?.data?.message || "Login failed"
      );
    }
  }
);

// register
export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (
    data: { name: string; email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const res = await api.post("/auth/register", data);
      return res.data.data as { accessToken: string; user: User };
    } catch (err: unknown) {
      const error = err as import("axios").AxiosError<{ message: string }>;
      return rejectWithValue(
        error.response?.data?.message || "Registration failed"
      );
    }
  }
);

// logout
export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async (_, { rejectWithValue }) => {
    try {
      await api.post("/auth/logout");
    } catch (err: unknown) {
      const error = err as import("axios").AxiosError<{ message: string }>;
      return rejectWithValue(
        error.response?.data?.message || "Logout failed"
      );
    }
  }
);


const IS_DEV = true;

export const updateProfile = createAsyncThunk(
  "auth/updateProfile",
  async (payload: UpdateProfilePayload, thunkAPI) => {
    try {
      if (IS_DEV) {
        await new Promise((r) => setTimeout(r, 800));
        // mock: return merged with current user from state
        const state = thunkAPI.getState() as { auth: { user: User } };
        return {
          ...state.auth.user,
          name: payload.name,
          phoneNumber: payload.phoneNumber,
        };
      }
      // const res = await axiosInstance.patch("/api/v1/auth/profile", payload);
      // return res.data.data;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to update profile";
      return thunkAPI.rejectWithValue(msg);
    }
  }
);

export const changePassword = createAsyncThunk(
  "auth/changePassword",
  async (payload: ChangePasswordPayload, thunkAPI) => {
    try {
      if (IS_DEV) {
        await new Promise((r) => setTimeout(r, 800));
        // simulate wrong password error
        if (payload.currentPassword !== "test123") {
          return thunkAPI.rejectWithValue("Current password is incorrect");
        }
        return { success: true };
      }
      // const res = await axiosInstance.patch("/api/v1/auth/change-password", payload);
      // return res.data;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to change password";
      return thunkAPI.rejectWithValue(msg);
    }
  }
);

const initialState: AuthState = {
  user: null,
  accessToken: null,
  loading: false,
  error: null,
  isInitialized: false,

  updateProfileLoading: false,
  updateProfileError: null,
  updateProfileSuccess: null,
  changePasswordLoading: false,
  changePasswordError: null,
  changePasswordSuccess: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // here interceptor new accessToken update
    setAccessToken(state, action: PayloadAction<string>) {
      state.accessToken = action.payload;
    },

    setUser(state, action: PayloadAction<User>) {
      state.user = action.payload;
    },

    // here interceptor refresh failed force logout
    logout(state) {
      state.user = null;
      state.accessToken = null;
      state.isInitialized = true;
    },

    clearProfileMessages(state) {
      state.updateProfileError = null;
      state.updateProfileSuccess = null;
      state.changePasswordError = null;
      state.changePasswordSuccess = null;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(initializeAuth.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.isInitialized = true;

      })
      .addCase(initializeAuth.rejected, (state) => {
        state.user = null;
        state.accessToken = null;
        state.isInitialized = true;
      })

      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.loading = false;
        // state.user = action.payload.user;    //if add (state, action)
        // state.accessToken = action.payload.accessToken;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;

      })

      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.accessToken = null;
        state.isInitialized = true;

      })
      .addCase(logoutUser.rejected, (state) => {
        state.user = null;
        state.accessToken = null;
        state.isInitialized = true;
      })

      // updateProfile
      .addCase(updateProfile.pending, (state) => {
        state.updateProfileLoading = true;
        state.updateProfileError = null;
        state.updateProfileSuccess = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.updateProfileLoading = false;
        state.updateProfileSuccess = "Profile updated successfully!";
        if (state.user && action.payload) {
          state.user = { ...state.user, ...action.payload };
        }
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.updateProfileLoading = false;
        state.updateProfileError = action.payload as string ?? "Update failed";
      })

      // changePassword
      .addCase(changePassword.pending, (state) => {
        state.changePasswordLoading = true;
        state.changePasswordError = null;
        state.changePasswordSuccess = null;
      })
      .addCase(changePassword.fulfilled, (state) => {
        state.changePasswordLoading = false;
        state.changePasswordSuccess = "Password changed successfully!";
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.changePasswordLoading = false;
        state.changePasswordError = action.payload as string ?? "Password change failed";
      })
  },
});

export const { logout, setAccessToken, clearProfileMessages } = authSlice.actions;
export default authSlice.reducer;