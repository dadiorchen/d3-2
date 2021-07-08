import React from 'react';
import * as d3 from 'd3';
import { LINE_STROKE_WIDTH } from '../constants';

import { renderAxes, renderGrid } from './grid-axis';
import { findCircleX, findCircleY } from './point';

import Line from '../../components/line';

export const renderLineChart = (x_scale, y_scale, id, grid, data, config) => {
  const chart = [];

  chart.push(...renderAxes(x_scale, y_scale, id, data, config));

  if (grid) chart.push(renderGrid(x_scale, id, data, config));

  chart.push(
    config.dataPlots.map((dataPlot, i, arr) => {
      const ifOwnColor = arr.length != 1;

      return (
        <Line
          x={x_scale.scale}
          y={y_scale.scale}
          id={id}
          data={data}
          config={config}
          dataPlot={dataPlot}
          ifOwnColor={ifOwnColor}
          key={`${id}-${i}-line`}
        />
      );
    })
  );

  return chart;
};

export const renderLine = (parent, data, x, y, config, dataPlot, ifOwnColor) => {
  const { xVal, yVal, color } = dataPlot;
  const { xFormat, yFormat, colorScheme, curveType } = config;
  const fill = colorScheme == 'rainbow' ? 'blue' : colorScheme;

  const curve = d3
    .line()
    .x((d) => findCircleX(d, xVal, xFormat, x, data))
    .y((d) => findCircleY(d, yVal, yFormat, y))
    .curve(applyCurve(curveType));

  parent
    .append('path')
    .attr('fill', 'none')
    .attr('stroke', ifOwnColor ? color : fill)
    .attr('stroke-width', LINE_STROKE_WIDTH.FAT)
    .attr('d', curve(data));
};

export const createLineDAttribute = (x, y, margin, xVal, yVal) => {
  return d3
    .line()
    .x((d) => x(new Date(d[xVal])))
    .y((d) => y(d[yVal] / 100) + 6)
    .curve(d3.curveStepAfter);
};

const applyCurve = (curveStr) => {
  switch (curveStr) {
    case 'curve monotone x':
      return d3.curveMonotoneX;
    case 'curve monotone y':
      return d3.curveMonotoneY;
    case 'curve basis':
      return d3.curveBasis;
    case 'curve natural':
      return d3.curveNatural;
    case 'curve step':
      return d3.curveStep;
    default:
      return d3.curveLinear;
  }
};
