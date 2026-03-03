import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api/axiosConfig';

//1. Add async thunk for fetching items from the backend
export const fetchItems = createAsyncThunk('inventory/fetchItems', async () => {
  const response = await api.get('/items');
  return response.data; // This is the list of items from MongoDB
});

//2. Add async thunk for adding a new item to the backend
export const addItem = createAsyncThunk('inventory/addItem', async (newItem) => {
  const response = await api.post('/items', newItem);
  return response.data; // This is the saved item from MongoDB (with the new _id)
});
const itemsSlice = createSlice({
  name: 'inventory',
  initialState: {
    items: [],
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null
  },
  reducers: {
    // Standard reducers (synchronous) go here if needed
  },
  extraReducers: (builder) => {
    builder
      // Handle Fetching
      .addCase(fetchItems.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchItems.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload; // Replace Redux state with real Database data
      })
      .addCase(fetchItems.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      // Handle Adding
      .addCase(addItem.fulfilled, (state, action) => {
        state.items.push(action.payload); // Add the new DB item to our list
      });
  },
});

export default itemsSlice.reducer;