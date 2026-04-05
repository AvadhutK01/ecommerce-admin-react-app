import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as dashboardService from './dashboardService';

export const fetchDashboardData = createAsyncThunk(
  'dashboard/fetchData',
  async (_, { rejectWithValue }) => {
    try {
      return await dashboardService.getDashboardData();
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch dashboard data');
    }
  }
);

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState: {
    stats: {
      totalRevenue: 0,
      totalOrders: 0,
      totalCustomers: 0,
      totalProducts: 0
    },
    salesData: [],
    recentOrders: [],
    recentCustomers: [],
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardData.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchDashboardData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.stats = action.payload.stats;
        state.salesData = action.payload.salesData;
        state.recentOrders = action.payload.recentOrders;
        state.recentCustomers = action.payload.recentCustomers;
      })
      .addCase(fetchDashboardData.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export default dashboardSlice.reducer;
