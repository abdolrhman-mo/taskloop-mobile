import { configureStore } from '@reduxjs/toolkit';
import statusBarReducer from './features/statusBarSlice';

export const store = configureStore({
  reducer: {
    statusBar: statusBarReducer,
    // ... other reducers
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 