import { createAction } from '@reduxjs/toolkit';

import {
  SET_GRID,
  SET_X_LABEL,
  UNSET_GRID,
  SET_Y_LABEL,
  SET_GRAPH_TYPE,
  SET_COLOR_SCHEME,
  SET_SPECIFIC_COLOR,
  SET_Y_PARAMETER_VALUE,
  SET_Y_FORMAT,
  SET_X_PARAMETER_VALUE,
  SET_X_FORMAT,
  SET_CURVE_TYPE,
  SET_HORIZONTAL,
  UNSET_HORIZONTAL,
  SET_BACKFILL,
  UNSET_BACKFILL,
  SET_DATA,
  ADD_GRAPH,
  SET_HIGHEST_ID,
  SET_SELECTED_GRAPH,
  ADD_DATA_PLOT,
  SET_POINT_SHAPE,
} from '../types';

export const setGrid = createAction(SET_GRID);
export const unsetGrid = createAction(UNSET_GRID);

export const setColorScheme = createAction(SET_COLOR_SCHEME);
export const setSpecificColor = createAction(SET_SPECIFIC_COLOR);

export const setXLabel = createAction(SET_X_LABEL);

export const setYLabel = createAction(SET_Y_LABEL);
export const setGraphType = createAction(SET_GRAPH_TYPE);

export const setYVal = createAction(SET_Y_PARAMETER_VALUE);
export const setYFormat = createAction(SET_Y_FORMAT);

export const setXVal = createAction(SET_X_PARAMETER_VALUE);
export const setXFormat = createAction(SET_X_FORMAT);

export const setHighestId = createAction(SET_HIGHEST_ID);

export const setCurveType = createAction(SET_CURVE_TYPE);

export const setHorizontal = createAction(SET_HORIZONTAL);
export const unsetHorizontal = createAction(UNSET_HORIZONTAL);

export const setBackfill = createAction(SET_BACKFILL);
export const unsetBackfill = createAction(UNSET_BACKFILL);

export const setData = createAction(SET_DATA);

export const addGraph = createAction(ADD_GRAPH);

export const addDataPlot = createAction(ADD_DATA_PLOT);
export const setPointShape = createAction(SET_POINT_SHAPE);

export const setSelectedGraph = createAction(SET_SELECTED_GRAPH);
