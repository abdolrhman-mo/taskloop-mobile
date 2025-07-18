import { configureStore } from '@reduxjs/toolkit';
import statusBarReducer from './features/statusBarSlice';
import studyRoomsReducer from './features/studyRoomsSlice';

export const store = configureStore({
  reducer: {
    statusBar: statusBarReducer,
    studyRooms: studyRoomsReducer,
    // ... other reducers
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 