import { NEW_CHART, DELETE_GRAPH } from '../types';
import { createAction } from '@reduxjs/toolkit';

export const generateNewGraph = createAction(NEW_CHART);
export const deleteGraph = createAction(DELETE_GRAPH);
