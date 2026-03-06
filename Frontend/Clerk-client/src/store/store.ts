import { configureStore } from '@reduxjs/toolkit';
import clerkReducer from './slices/clerkSlice';

const store = configureStore({
  reducer: {
    clerk: clerkReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
