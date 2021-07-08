import { createSlice } from '@reduxjs/toolkit';

import { data } from '../../../../public/resource/static-data';

export const allGraphs = createSlice({
  name: 'allGraphs',
  initialState: {
    1: {
      id: 1,
      data: data,
    },
  },
  reducers: {
    setData: (state, action) => {
      const { id, flipTrueHits } = action.payload;
      let newData;

      if (action.payload.data && action.payload.data[0].PROBA) {
        newData = action.payload.data.sort((a, b) => b.PROBA - a.PROBA);
        if (flipTrueHits)
          newData.forEach((el) => {
            if (el.LABEL == 0) el.PROBA = 1 - el.PROBA;
            el.PROBA = el.PROBA;
          });
      }
      if (!newData) newData = data;
      return {
        ...state,
        [id]: {
          id,
          data: newData,
        },
      };
    },
  },
});
