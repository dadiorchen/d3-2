import { createSlice } from '@reduxjs/toolkit';

export const highestId = createSlice({
  name: 'highestId',
  initialState: 1,
  reducers: {
    setHighestId: (state, action) => {
      if (action.payload > state) state = action.payload;
      return state;
    },
  },
});
