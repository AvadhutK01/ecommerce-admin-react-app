import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as orderService from './orderService';
import * as productService from '../products/productService';

export const fetchOrders = createAsyncThunk(
  'orders/fetchOrders',
  async ({ pageSize = 5, pageToken = '' } = {}, { rejectWithValue }) => {
    try {
      return await orderService.getOrders(pageSize, pageToken);
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch orders');
    }
  }
);

export const fetchCustomerOrders = createAsyncThunk(
  'orders/fetchCustomerOrders',
  async (customerId, { rejectWithValue }) => {
    try {
      const orders = await orderService.getOrdersByCustomer(customerId);
      return orders;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch customer orders');
    }
  }
);

export const fetchOrderById = createAsyncThunk(
  'orders/fetchOrderById',
  async (id, { rejectWithValue }) => {
    try {
      return await orderService.getOrderById(id);
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch order details');
    }
  }
);

export const updateStatus = createAsyncThunk(
  'orders/updateStatus',
  async ({ id, status, items = [] }, { rejectWithValue }) => {
    try {
      const result = await orderService.updateOrderStatus(id, status);
      if (status === 'rejected' && items.length > 0) {
        for (const item of items) {
          if (item.productId) {
            await productService.updateProductStock(item.productId, item.quantity);
          }
        }
      }
      return result;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to update order status');
    }
  }
);

export const updatePaymentStatus = createAsyncThunk(
  'orders/updatePaymentStatus',
  async ({ id, paymentStatus }, { rejectWithValue }) => {
    try {
      return await orderService.updatePaymentStatus(id, paymentStatus);
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to update payment status');
    }
  }
);

const orderSlice = createSlice({
  name: 'orders',
  initialState: {
    items: [],
    selectedOrder: null,
    isLoading: false,
    isUpdatingPayment: false,
    error: null,
    nextPageToken: null,
    tokenHistory: [null],
    currentPage: 1,
    pageSize: 5,
  },
  reducers: {
    clearOrderError: (state) => {
      state.error = null;
    },
    setOrderPage: (state, action) => {
      state.currentPage = action.payload;
    },
    pushOrderToken: (state, action) => {
      if (action.payload && !state.tokenHistory.includes(action.payload)) {
        state.tokenHistory.push(action.payload);
      }
    },
    resetOrderPagination: (state) => {
      state.currentPage = 1;
      state.tokenHistory = [null];
      state.nextPageToken = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload.documents;
        state.nextPageToken = action.payload.nextPageToken;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchCustomerOrders.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchCustomerOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload;
      })
      .addCase(fetchCustomerOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchOrderById.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchOrderById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedOrder = action.payload;
      })
      .addCase(fetchOrderById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(updateStatus.fulfilled, (state, action) => {
        const index = state.items.findIndex(o => o.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
        if (state.selectedOrder?.id === action.payload.id) {
          state.selectedOrder = action.payload;
        }
      })
      .addCase(updatePaymentStatus.pending, (state) => {
        state.isUpdatingPayment = true;
      })
      .addCase(updatePaymentStatus.fulfilled, (state, action) => {
        state.isUpdatingPayment = false;
        if (state.selectedOrder?.id === action.payload.id) {
          state.selectedOrder = action.payload;
        }
      })
      .addCase(updatePaymentStatus.rejected, (state, action) => {
        state.isUpdatingPayment = false;
        state.error = action.payload;
      });
  },
});

export const { clearOrderError, setOrderPage, pushOrderToken, resetOrderPagination } = orderSlice.actions;
export default orderSlice.reducer;
