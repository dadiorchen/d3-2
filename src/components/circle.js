import React, { useEffect } from 'react';
import * as d3 from 'd3';

import { renderCircle } from '../utility/svg';

const Circle = ({ id, data, x, y, config, dataPlot, ifOwnColor }) => {
  const { xVal, yVal } = dataPlot;
  useEffect(() => {
    renderCircle(d3.select(`g#circle-${id}`), data, x, y, config, dataPlot, ifOwnColor);

    return () => {
      d3.select(`g#circle-${id}`).selectAll('*').remove();
    };
  }, [data, config, x, y]);

  return <g id={`circle-${id}`}></g>;
};

export default Circle;
