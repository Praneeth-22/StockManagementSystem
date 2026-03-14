import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api/axiosConfig';

/* ===============================
   1. FETCH ALL ORDERS
================================ */
export const fetchOrders = createAsyncThunk(
  'orders/fetchOrders',
  async () => {
    const response = await api.get('/orders');
    return response.data;
  }
);

/* ===============================
   2. CREATE NEW ORDER
================================ */
export const submitOrder = createAsyncThunk(
  'orders/submitOrder',
  async (orderData) => {
    const response = await api.post('/orders', orderData);
    return response.data;
  }
);

/* ===============================
   3. DELETE ORDER
================================ */
export const deleteOrder = createAsyncThunk(
  'orders/deleteOrder',
  async (orderId) => {
    await api.delete(`/orders/${orderId}`);
    return orderId;
  }
);

/* ===============================
   4. UPDATE ORDER
================================ */
export const updateOrder = createAsyncThunk(
  'orders/updateOrder',
  async ({ id, updatedOrder }) => {
    const response = await api.put(`/orders/${id}`, updatedOrder);
    return response.data;
  }
);

/* ===============================
   SLICE
================================ */
const ordersSlice = createSlice({
  name: 'orders',

  initialState: {
    history: [],
    status: 'idle', // idle | loading | succeeded | failed
    error: null
  },

  reducers: {},

  extraReducers: (builder) => {

    builder

      /* FETCH ORDERS */
      .addCase(fetchOrders.pending, (state) => {
        state.status = 'loading';
      })

      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.history = action.payload;
      })

      .addCase(fetchOrders.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })


      /* SUBMIT ORDER */
      .addCase(submitOrder.fulfilled, (state, action) => {
        state.history.unshift(action.payload);
      })


      /* DELETE ORDER */
      .addCase(deleteOrder.fulfilled, (state, action) => {
        state.history = state.history.filter(
          (order) => order.id !== action.payload
        );
      })


      /* UPDATE ORDER */
      .addCase(updateOrder.fulfilled, (state, action) => {
        const index = state.history.findIndex(
          (order) => order.id === action.payload.id
        );

        if (index !== -1) {
          state.history[index] = action.payload;
        }
      });

  },
});

export default ordersSlice.reducer;