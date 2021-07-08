import { createSlice } from '@reduxjs/toolkit';

export const selectedGraph = createSlice({
  name: 'selectedGraph',
  initialState: 1,
  reducers: {
    setSelectedGraph: (state, action) => (state = action.payload),
  },
});
