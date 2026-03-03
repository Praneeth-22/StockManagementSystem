import { configureStore } from '@reduxjs/toolkit';
import itemsReducer from './itemsSlice';
import ordersReducer from './OrdersSlice';

// 1. Function to load state from localStorage
const loadState = () => {
  try {
    const serializedState = localStorage.getItem('inventoryState');
    if (serializedState === null) {
      return undefined; // Let Redux initialize with default state
    }
    return JSON.parse(serializedState);
  } catch (err) {
    return undefined;
  }
};

// 2. Function to save state to localStorage
const saveState = (state) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem('inventoryState', serializedState);
  } catch (err) {
    console.error("Could not save state", err);
  }
};

// 3. Load the persisted state (if any)
const preloadedState = loadState();

export const store = configureStore({
  reducer: {
    inventory: itemsReducer,
    orders: ordersReducer,
  },
  preloadedState, // Initialize store with saved data
});

// 4. Subscribe to store updates
store.subscribe(() => {
  // Save specifically the 'inventory' slice whenever it changes
  saveState({
    inventory: store.getState().inventory
  });
});