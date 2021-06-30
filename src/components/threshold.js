import React, { useEffect } from 'react';
import * as d3 from 'd3';
import { drawThresholdLine } from '../utility/svg';

const Threshold = ({ data, x, y, graphID, id }) => {
  useEffect(() => {
    drawThresholdLine(d3.select(`#threshold-${id}`), data, x.scale, y.scale, graphID);
  }, []);

  return (
    <>
      <g id={`threshold-${id}`}></g>
    </>
  );
};

export default Threshold;
