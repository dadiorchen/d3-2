import { selectedGraph } from '../reducers/graph-reducer/selectedGraph-slice';
import { allGraphs } from '../reducers/graph-reducer/allGraphs-slice';
import { highestId } from '../reducers/graph-reducer/highestId-slice';
import { configs } from '../reducers/graph-reducer/configs-slice';

export const { setSelectedGraph } = selectedGraph.actions;
export const { setHighestId } = highestId.actions;
export const { setData } = allGraphs.actions;
export const {
  setGraphType,
  setGrid,
  setColorScheme,
  setSpecificColor,
  setXParameter,
  setXFormat,
  setYParameter,
  setYFormat,
  setCurveType,
  setXLabel,
  setYLabel,
  addGraph,
  setHorizontal,
  setBackfill,
  addDataPlot,
  setPointShape,
  setThreshold,
  setPadAngle,
  setIfDonut,
  deleteGraph,
} = configs.actions;
