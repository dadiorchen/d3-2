import { combineReducers } from 'redux';

import { selectedGraph } from './selectedGraph-slice';
import { allGraphs } from './allGraphs-slice';
import { highestId } from './highestId-slice';
import { configs } from './configs-slice';

export const graphReducer = combineReducers({
  allGraphs: allGraphs.reducer,
  configs: configs.reducer,
  selectedGraph: selectedGraph.reducer,
  highestId: highestId.reducer,
});
