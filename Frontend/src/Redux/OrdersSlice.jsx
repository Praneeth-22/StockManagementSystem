import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api/axiosConfig';

// 1. FETCH ALL ORDERS
export const fetchOrders = createAsyncThunk('orders/fetchOrders', async () => {
  const response = await api.get('/orders');
  return response.data;
});

// 2. CREATE NEW ORDER
export const submitOrder = createAsyncThunk('orders/submitOrder', async (orderData) => {
  const response = await api.post('/orders', orderData);
  return response.data;
});

// 3. DELETE ORDER
export const deleteOrder = createAsyncThunk('orders/deleteOrder', async (orderId) => {
  await api.delete(`/orders/${orderId}`);
  return orderId;
});

// 4. UPDATE ORDER (This was missing!)
export const updateOrder = createAsyncThunk('orders/updateOrder', async ({ id, updatedOrder }) => {
  // We send a PUT request to update the specific order ID
  const response = await api.put(`/orders/${id}`, updatedOrder);
  return response.data;
});

const ordersSlice = createSlice({
  name: 'orders',
  initialState: {
    history: [],
    loading: false,
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.history = action.payload;
      })
      // Submit
      .addCase(submitOrder.fulfilled, (state, action) => {
        state.history.unshift(action.payload);
      })
      // Delete
      .addCase(deleteOrder.fulfilled, (state, action) => {
        state.history = state.history.filter(order => order.id !== action.payload);
      })
      // Update (Now this will work because updateOrder is defined above!)
      .addCase(updateOrder.fulfilled, (state, action) => {
        const index = state.history.findIndex(order => order.id === action.payload.id);
        if (index !== -1) {
          state.history[index] = action.payload;
        }
      });
  },
});

export default ordersSlice.reducer;