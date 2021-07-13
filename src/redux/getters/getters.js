export const getAllIdAndType = (state) =>
  Object.values(state.configs).map((el) => {
    return { type: el.type, id: el.id };
  });

export const getCurrentConfig = (state) => state.configs[state.selectedGraph];

export const getGraphConfig = (state, id) => state.configs[id];

export const getGraphData = (state, id) => state.allGraphs[id].data;

export const getHighestId = (state) => state.highestId;

export const getCurrentData = (state) => state.allGraphs[state.selectedGraph].data;

export const getCurrentFileName = (state, id) =>  state.allGraphs[id]?.fileName;
