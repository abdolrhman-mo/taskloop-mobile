import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface StatusBarState {
  backgroundColor: string | null;
  style: 'light' | 'dark' | 'auto';
}

const initialState: StatusBarState = {
  backgroundColor: null, // null means use theme default
  style: 'auto', // 'auto' means use theme default
};

const statusBarSlice = createSlice({
  name: 'statusBar',
  initialState,
  reducers: {
    setStatusBarBackground: (state, action: PayloadAction<string | null>) => {
      state.backgroundColor = action.payload;
    },
    setStatusBarStyle: (state, action: PayloadAction<'light' | 'dark' | 'auto'>) => {
      state.style = action.payload;
    },
    resetStatusBar: (state) => {
      state.backgroundColor = null;
      state.style = 'auto';
    },
  },
});

export const { 
  setStatusBarBackground, 
  setStatusBarStyle, 
  resetStatusBar 
} = statusBarSlice.actions;

export default statusBarSlice.reducer; 