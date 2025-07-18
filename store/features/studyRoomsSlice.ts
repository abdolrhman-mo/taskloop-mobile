import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Session } from '@/types/session';

interface StudyRoomsState {
  rooms: Session[];
  isLoading: boolean;
  error: string | null;
}

const initialState: StudyRoomsState = {
  rooms: [],
  isLoading: false,
  error: null,
};

const studyRoomsSlice = createSlice({
  name: 'studyRooms',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setStudyRooms: (state, action: PayloadAction<Session[]>) => {
      state.rooms = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    addStudyRoom: (state, action: PayloadAction<Session>) => {
      // Add to the beginning of the list (most recent first)
      state.rooms.unshift(action.payload);
      state.error = null;
    },
    updateStudyRoom: (state, action: PayloadAction<Session>) => {
      const index = state.rooms.findIndex(room => room.uuid === action.payload.uuid);
      if (index !== -1) {
        state.rooms[index] = action.payload;
      }
    },
    removeStudyRoom: (state, action: PayloadAction<string>) => {
      state.rooms = state.rooms.filter(room => room.uuid !== action.payload);
    },
    clearStudyRooms: (state) => {
      state.rooms = [];
      state.isLoading = false;
      state.error = null;
    },
  },
});

export const {
  setLoading,
  setError,
  setStudyRooms,
  addStudyRoom,
  updateStudyRoom,
  removeStudyRoom,
  clearStudyRooms,
} = studyRoomsSlice.actions;

export default studyRoomsSlice.reducer; 