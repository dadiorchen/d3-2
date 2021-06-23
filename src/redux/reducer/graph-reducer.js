import { combineReducers } from 'redux';
import { createReducer } from '@reduxjs/toolkit';

import {
  SET_COLOR_SCHEME,
  SET_GRID,
  UNSET_GRID,
  SET_GRAPH_TYPE,
  SET_X_LABEL,
  SET_Y_LABEL,
  SET_Y_PARAMETER_VALUE,
  SET_X_PARAMETER_VALUE,
  SET_Y_FORMAT,
  SET_X_FORMAT,
  SET_CURVE_TYPE,
  SET_HORIZONTAL,
  UNSET_HORIZONTAL,
  SET_BACKFILL,
  UNSET_BACKFILL,
  ADD_GRAPH,
  SET_SELECTED_GRAPH,
  SET_HIGHEST_ID,
  SET_DATA,
  SET_SPECIFIC_COLOR,
  ADD_DATA_PLOT,
  SET_POINT_SHAPE,
  DELETE_GRAPH,
} from '../types';

import { data } from '../../../public/resource/static-data';

const initialState = {
  allGraphs: {
    1: {
      id: 1,
      data: data,
    },
  },
  configs: {
    1: {
      id: 1,
      type: 'bar',
      grid: false,
      showAxes: true,
      xLabel: {
        display: false,
        value: '',
      },
      yLabel: {
        display: false,
        value: '',
      },
      xFormat: 'time',
      yFormat: 'percent',
      colorScheme: 'blue',
      curveType: 'curve linear',
      horizontal: false,
      backfill: false,
      legend: true, // {}?
      dataPlots: [
        {
          xVal: 'date',
          yVal: 'automation_rate',
          shape: 'circle',
          color: 'blue',
        },
      ],
      xVal: 'date',
      yVal: 'automation_rate',
    },
  },
  selectedGraph: 1,
  highestId: 1,
};

export const getAllIdAndType = (state) =>
  Object.values(state.configs).map((el) => {
    return { type: el.type, id: el.id };
  });

export const getGridEnabled = (state) => state.configs[state.selectedGraph].grid;

export const getCurrentConfig = (state) => state.configs[state.selectedGraph];

export const getGraphConfig = (state, id) => state.configs[id];

export const getGraphData = (state, id) => state.allGraphs[id].data;

export const getHighestId = (state) => state.highestId;

export const getCurrentGraphType = (state) => state.configs[state.selectedGraph].type;

export const getCurrentGraphId = (state) => state.selectedGraph;

export const getCurrentData = (state) => state.allGraphs[state.selectedGraph].data;

export const configsReducer = createReducer(initialState.configs, (builder) => {
  builder
    .addCase(SET_GRAPH_TYPE, (state, action) => {
      const { id, type } = action.payload;
      if (type == 'bar') {
        state[id].xFormat = 'band';
        state[id].yFormat = 'linear';
      }
      state[id].type = type;
      return state;
    })
    .addCase(SET_GRID, (state, action) => {
      const { id } = action.payload;
      state[id].grid = true;
      return state;
    })
    .addCase(UNSET_GRID, (state, action) => {
      const { id } = action.payload;
      state[id].grid = false;
      return state;
    })
    .addCase(SET_COLOR_SCHEME, (state, action) => {
      const { id } = action.payload;
      state[id].colorScheme = action.payload.colorScheme;
      return state;
    })
    .addCase(SET_SPECIFIC_COLOR, (state, action) => {
      const { id, dataPlotID, color } = action.payload;
      state[id].dataPlots[dataPlotID].color = color;
      return state;
    })
    .addCase(SET_X_PARAMETER_VALUE, (state, action) => {
      const { id, dataPlotID, xVal } = action.payload;
      state[id].xVal = action.payload.xVal;
      state[id].dataPlots[dataPlotID].xVal = xVal;
      return state;
    })
    .addCase(SET_POINT_SHAPE, (state, action) => {
      const { id, dataPlotID, shape } = action.payload;
      state[id].dataPlots[dataPlotID].shape = shape;
      return state;
    })
    .addCase(SET_X_FORMAT, (state, action) => {
      const { id } = action.payload;
      state[id].xFormat = action.payload.xFormat;
      return state;
    })
    .addCase(SET_Y_PARAMETER_VALUE, (state, action) => {
      const { id, dataPlotID, yVal } = action.payload;
      state[id].yVal = action.payload.yVal;
      state[id].dataPlots[dataPlotID].yVal = yVal;
      return state;
    })
    .addCase(SET_Y_FORMAT, (state, action) => {
      const { id } = action.payload;
      state[id].yFormat = action.payload.yFormat;
      return state;
    })
    .addCase(SET_CURVE_TYPE, (state, action) => {
      const { id } = action.payload;
      state[id].curveType = action.payload.curveType;
      return state;
    })
    .addCase(SET_HORIZONTAL, (state, action) => {
      const { id } = action.payload;
      state[id].horizontal = true;
      return state;
    })
    .addCase(UNSET_HORIZONTAL, (state, action) => {
      const { id } = action.payload;
      state[id].horizontal = false;
      state[id].backfill = false;
      return state;
    })
    .addCase(SET_BACKFILL, (state, action) => {
      const { id } = action.payload;
      state[id].backfill = true;
      return state;
    })
    .addCase(UNSET_BACKFILL, (state, action) => {
      const { id } = action.payload;
      state[id].backfill = false;
      return state;
    })
    .addCase(ADD_GRAPH, (state, action) => {
      const { id } = action.payload;
      return {
        ...state,
        [id]: {
          id: id,
          type: 'bar',
          grid: false,
          showAxes: true,
          xLabel: {
            display: false,
            value: '',
          },
          yLabel: {
            display: false,
            value: '',
          },
          xFormat: 'time',
          yFormat: 'percent',
          colorScheme: 'blue',
          curveType: 'curve linear',
          horizontal: false,
          backfill: false,
          legend: true,
          dataPlots: [
            {
              xVal: 'date',
              yVal: 'automation_rate',
              shape: 'circle',
              color: 'blue',
            },
          ],
          xVal: 'date',
          yVal: 'automation_rate',
        },
      };
    })
    .addCase(DELETE_GRAPH, (state, action) => {
      const { id } = action.payload;
      delete state[id];
      return state;
    })
    .addCase(ADD_DATA_PLOT, (state, action) => {
      const { id } = action.payload;
      state[id].dataPlots.push({
        xVal: '',
        yVal: '',
        shape: 'circle',
        color: 'blue',
      });
      return state;
    })
    .addDefaultCase((state) => state);
});

export const selectedGraphReducer = createReducer(initialState.selectedGraph, (builder) => {
  builder
    .addCase(SET_SELECTED_GRAPH, (state, action) => (state = action.payload))
    .addDefaultCase((state) => state);
});

export const highestIdReducer = createReducer(initialState.highestId, (builder) => {
  builder
    .addCase(SET_HIGHEST_ID, (state, action) => {
      if (action.payload > state) state = action.payload;
      return state;
    })
    .addDefaultCase((state) => state);
});

export const allGraphsReducer = createReducer(initialState.allGraphs, (builder) => {
  builder.addCase(SET_DATA, (state, action) => {
    const { id } = action.payload;
    const newData = action.payload.data || data;
    return {
      ...state,
      [id]: {
        id,
        data: newData,
      },
    };
  });
});

export const graphReducer = combineReducers({
  allGraphs: allGraphsReducer,
  configs: configsReducer,
  selectedGraph: selectedGraphReducer,
  highestId: highestIdReducer,
});
