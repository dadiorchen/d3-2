import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  1: {
    id: 1,
    type: 'bar',
    grid: false,
    showAxes: true,
    xFormat: 'time',
    yFormat: 'percent',
    colorScheme: 'blue',
    curveType: 'curve linear',
    horizontal: false,
    backfill: false,
    padAngle: 0,
    ifDonut: false,
    dataPlots: [
      {
        xVal: 'date',
        yVal: 'automation_rate',
        shape: 'circle',
        color: 'blue',
      },
    ],
    inZoom: false,
    threshold: false,
    xVal: 'date',
    yVal: 'automation_rate',
  },
};

const commonReducerHandler = (state, action, property) => {
  const { id } = action.payload;
  state[id][property] = action.payload[property];
  return state;
};

const plotPointcommonReducerHandler = (state, action, property) => {
  const { id, dataPlotID } = action.payload;
  state[id].dataPlots[dataPlotID][property] = action.payload[property];
  return state;
};

export const configs = createSlice({
  name: 'configs',
  initialState,
  reducers: {
    setGraphType: (state, action) => {
      const { id, type } = action.payload;
      if (type == 'bar') {
        state[id].xFormat = 'band';
        state[id].yFormat = 'linear';
      }
      state[id].type = type;
      return state;
    },
    setGrid: (state, action) => commonReducerHandler(state, action, 'grid'),
    setColorScheme: (state, action) => commonReducerHandler(state, action, 'colorScheme'),
    setSpecificColor: (state, action) => plotPointcommonReducerHandler(state, action, 'color'),
    setXParameter: (state, action) => plotPointcommonReducerHandler(state, action, 'xVal'),
    setYParameter: (state, action) => plotPointcommonReducerHandler(state, action, 'yVal'),
    setPointShape: (state, action) => plotPointcommonReducerHandler(state, action, 'shape'),
    setXFormat: (state, action) => commonReducerHandler(state, action, 'xFormat'),
    setYFormat: (state, action) => commonReducerHandler(state, action, 'yFormat'),
    setCurveType: (state, action) => commonReducerHandler(state, action, 'curveType'),
    setHorizontal: (state, action) => commonReducerHandler(state, action, 'horizontal'),
    setBackfill: (state, action) => commonReducerHandler(state, action, 'backfill'),
    addGraph: (state, action) => {
      const { id } = action.payload;
      return {
        ...state,
        [id]: {
          ...initialState[1],
          id: id,
          dataPlots: [
            {
              xVal: 'date',
              yVal: 'automation_rate',
              shape: 'circle',
              color: 'blue',
            },
          ],
        },
      };
    },
    deleteGraph: (state, action) => {
      const { id } = action.payload;
      delete state[id];
      return state;
    },
    addDataPlot: (state, action) => {
      const { id } = action.payload;
      state[id].dataPlots.push({
        xVal: '',
        yVal: '',
        shape: 'circle',
        color: 'blue',
      });
      return state;
    },
    removeDataPlot: (state, action) => {
      const { id } = action.payload;
      return  {...state[id], dataPlots: state[id].dataPlots.slice(0,-1)}
    },
    setThreshold: (state, action) => commonReducerHandler(state, action, 'threshold'),
    setIfDonut: (state, action) => commonReducerHandler(state, action, 'ifDonut'),
    setPadAngle: (state, action) => commonReducerHandler(state, action, 'padAngle'),
    setInZoom: (state, action) => commonReducerHandler(state, action, 'inZoom'),
  },
});
