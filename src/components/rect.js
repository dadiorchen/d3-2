import React, { useEffect } from 'react';
import * as d3 from 'd3';

import { renderRect } from '../utility/svg';

const Rect = ({ id, data, x, y, config, xVal, yVal }) => {
  useEffect(() => {
    renderRect(d3.select(`g#rect-${id}-${xVal}-${yVal}`), data, x, y, config, xVal, yVal);

    return () => {
      d3.select(`g#rect-${id}-${xVal}-${yVal}`).selectAll('*').remove();
    };
  }, [data, config, x, y]);

  return <g id={`rect-${id}-${xVal}-${yVal}`}></g>;
};

export default Rect;
