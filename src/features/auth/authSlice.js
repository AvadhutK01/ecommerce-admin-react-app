import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getFriendlyErrorMessage } from '../../utils/errorMessages';
import * as adminService from './adminService';
import * as authService from './authService';

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const { token, user } = await authService.loginUser(email, password);
      return { token, user };
    } catch (error) {
      const message = getFriendlyErrorMessage(error.message || error);
      return rejectWithValue(message);
    }
  }
);

export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async (email, { rejectWithValue }) => {
    try {
      await authService.resetPassword(email);
      return true;
    } catch (error) {
      return rejectWithValue(getFriendlyErrorMessage(error.message || error));
    }
  }
);

export const fetchAdminProfile = createAsyncThunk(
  'auth/fetchAdminProfile',
  async (uid, { rejectWithValue }) => {
    try {
      const profile = await adminService.getAdminProfile(uid);
      return profile;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch profile');
    }
  }
);

export const updateAdminName = createAsyncThunk(
  'auth/updateAdminName',
  async ({ uid, name }, { rejectWithValue, dispatch }) => {
    try {
      await adminService.updateAdminProfile(uid, name);
      dispatch(setProfileName(name));
      return { name };
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to update profile');
    }
  }
);

const initialState = {
  user: JSON.parse(localStorage.getItem('user')) || null,
  token: localStorage.getItem('token') || null,
  profile: null,
  isLoading: false,
  error: null,
  resetEmailSent: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.profile = null;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },
    clearError: (state) => {
      state.error = null;
      state.resetEmailSent = false;
    },
    setProfileName: (state, action) => {
      if (state.user) {
        state.user.displayName = action.payload;
        localStorage.setItem('user', JSON.stringify(state.user));
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(resetPassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.resetEmailSent = false;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.isLoading = false;
        state.resetEmailSent = true;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchAdminProfile.fulfilled, (state, action) => {
        state.profile = action.payload;
        if (action.payload?.name) {
          state.user.displayName = action.payload.name;
        }
      })
      .addCase(updateAdminName.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateAdminName.fulfilled, (state, action) => {
        state.isLoading = false;
        if (!state.profile) state.profile = {};
        state.profile.name = action.payload.name;
      })
      .addCase(updateAdminName.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { logout, clearError, setProfileName } = authSlice.actions;
export default authSlice.reducer;
