import { configureStore } from '@reduxjs/toolkit';
import citizenReducer from './slices/citizenSlice';

const store = configureStore({
  reducer: {
    citizen: citizenReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
