import React from 'react';
import * as d3 from 'd3';
import { SVG, COLORS } from '../constants';

import { createScalesAndFormats } from './scales';
import { createColorSchemeFill } from './helpers';
import { createToolTip, attachToolTip } from './tooltip';
import { renderAxes, renderGrid } from './grid-axis';

import Rect from '../../components/rect';

export const renderBarChart = (x_scale, y_scale, id, grid, data, config) => {
  const chart = [];
  chart.push(...renderAxes(x_scale, y_scale, id, data, config));

  if (grid) chart.push(renderGrid(x_scale, id, data, config));
  if (config.horizontal) translateHorizontal('bar', id);

  chart.push(
    config.dataPlots.map(({ xVal, yVal }, i, arr) => (
      <Rect
        x={x_scale.scale}
        y={y_scale.scale}
        id={id}
        data={data}
        config={config}
        xVal={xVal}
        yVal={yVal}
        key={`${id}-${i}-rect`}
      />
    ))
  );

  return chart;
};

export const renderRect = (parent, data, x_scale, y_scale, config, xVal, yVal) => {
  const { xFormat, yFormat, colorScheme } = config;
  const colorSchemeFill = createColorSchemeFill(colorScheme, data, config);

  const bound = parent.selectAll('rect').data(data).enter();

  const { x } = createScalesAndFormats(config, data, false);
  if (config.backfill) renderBackfill(parent, data, x, y_scale, xVal, xFormat);

  const rect = bound
    .append('rect')
    .attr('height', (d) => findRectHeight(d, yVal, yFormat, y_scale))
    .attr('width', (d) => findRectWidth(d, xVal, xFormat, x.scale, data))
    .attr('x', (d, i) => findRectX(d, i, xVal, xFormat, x.scale, data))
    .attr('y', (d) => findRectY(d, yVal, yFormat, y_scale))
    .attr('rx', 0)
    .attr('ry', 0)
    .attr('fill', (d) => colorSchemeFill(d[yVal]))
    .attr('stroke', COLORS.GREY)
    .attr('stroke-width', '2px');

  if (config.horizontal) {
    rect.attr('rx', 20).attr('ry', 20);
  }

  const tooltip = createToolTip(config.id);
  attachToolTip(rect, tooltip, xVal, yVal);
};

export const findRectX = (
  d,
  i,
  xVal,
  xFormat,
  x_scale,
  data,
  margin = SVG.MARGIN,
  width = SVG.WIDTH
) => {
  switch (xFormat) {
    case 'time':
      // subtracted half a day to push rectangle to middle of tick
      return x_scale(new Date(d[xVal]) - 43200000);

    case 'band':
      return x_scale(d[xVal]) + x_scale.bandwidth() * 0.1;

    default:
      return margin.left + i * ((width - margin.left - margin.right) / data.length);
  }
};

export const findRectY = (d, yVal, yFormat, y_scale, margin = SVG.MARGIN, height = SVG.HEIGHT) => {
  switch (yFormat) {
    case 'percent':
      return y_scale(d[yVal]);

    case 'linear':
      return height + margin.top - y_scale(d[yVal]);

    default:
      throw new Error('Incorrect format for x-axis');
  }
};

export const findRectWidth = (
  d,
  xVal,
  xFormat,
  x_scale,
  data,
  width = SVG.WIDTH,
  margin = SVG.MARGIN
) => {
  switch (xFormat) {
    case 'time':
      return x_scale(d3.timeDay.offset(new Date(d[xVal]))) - x_scale(new Date(d[xVal]));

    case 'band':
      return x_scale.bandwidth() * 0.8;

    default:
      return (width - margin.left - margin.right) / data.length;
  }
};

export const findRectHeight = (d, yVal, yFormat, y_scale) => {
  switch (yFormat) {
    case 'percent':
      return y_scale(1 - d[yVal]) - SVG.MARGIN.top;

    case 'linear':
      return y_scale(d[yVal]);

    default:
      throw new Error('Incorrect format for x axis');
  }
};

export const translateHorizontal = (type, id) => {
  d3.select(`#${type}Chart-${id}`).attr('transform', 'rotate(90)');
};

export const renderBackfill = (parent, data, x, y_scale, xVal, xFormat) => {
  return parent
    .selectAll('.shadow')
    .data(data)
    .enter()
    .append('rect')
    .attr('height', SVG.HEIGHT)
    .attr('width', (d) => findRectWidth(d, xVal, xFormat, x.scale, data))
    .attr('x', (d, i) => findRectX(d, i, xVal, xFormat, x.scale, data))
    .attr('y', SVG.MARGIN.top)
    .attr('rx', 20)
    .attr('ry', 20)
    .attr('opacity', '0.6')
    .attr('fill', 'lightgrey');
};
