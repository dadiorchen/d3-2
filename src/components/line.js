import React, { useEffect } from 'react';
import * as d3 from 'd3';

import { renderLine } from '../utility/svg';

const Line = ({ id, data, x, y, config, dataPlot, ifOwnColor }) => {
  useEffect(() => {
    renderLine(d3.select(`g#line-${id}`), data, x, y, config, dataPlot, ifOwnColor);

    return () => {
      d3.select(`g#line-${id}`).selectAll('*').remove();
    };
  }, [data, config, x, y]);

  return <g id={`line-${id}`}></g>;
};

export default Line;
