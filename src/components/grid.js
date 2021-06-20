import React, { useEffect } from 'react';
import * as d3 from 'd3';

import { addGridToChart, createScalesAndFormats } from '../utility/svg';

const Grid = ({ id, data, config, x_scale }) => {
  const { xFormat, yFormat, dataPlots } = config;
  useEffect(() => {
    const { x, y } = createScalesAndFormats(config, data, true);

    addGridToChart(d3.select(`g#grid-${id}`), x.scale, y.scale, xFormat, data, dataPlots);

    return () => {
      d3.select(`g#grid-${id}`).selectAll('*').remove();
    };
  }, [data, dataPlots, xFormat, yFormat]);

  return (
    <>
      <g id={`grid-${id}`}></g>
    </>
  );
};

export default Grid;
