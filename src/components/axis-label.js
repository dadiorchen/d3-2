import React, { useEffect } from 'react';
import * as d3 from 'd3';

import { addAxisLabelToChart } from '../utility/svg';

const AxisLabel = ({ id, config: { dataPlots, horizontal, type }, ifX }) => {
  useEffect(() => {
    const labelText = ifX ? dataPlots[0].xVal : dataPlots[0].yVal;
    if (horizontal && type == 'bar') d3.select(`g#axis-label-${id}-${ifX}`).selectAll('*').remove();
    else addAxisLabelToChart(d3.select(`g#axis-label-${id}-${ifX}`), labelText, ifX);
    return () => {
      d3.select(`g#axis-label-${id}-${ifX}`).selectAll('*').remove();
    };
  }, [dataPlots, horizontal, type]);

  return (
    <>
      <g id={`axis-label-${id}-${ifX}`}></g>
    </>
  );
};

export default AxisLabel;
