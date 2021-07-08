import React from 'react';
import * as d3 from 'd3';
import { SVG, COLORS, DEFAULT_PROPERTIES } from '../constants';

import { createLineDAttribute } from './line';
import { renderAxes, renderGrid } from './grid-axis';
import { findDomainAndFormat } from './scales';
import { createColorSchemeFill, filterDataByHighestOverTime } from './helpers';
import { createToolTip, attachToolTip } from './tooltip';
import { renderThreshold } from './threshold';

import Circle from '../../components/circle';

export const renderPointChart = (x_scale, y_scale, id, grid, data, config) => {
  const chart = [];

  chart.push(...renderAxes(x_scale, y_scale, id, data, config));

  if (grid) chart.push(renderGrid(x_scale, id, data, config));

  if (config.threshold) {
    if (data[0].PROBA) {
      [...data].sort((a, b) => a.PROBA - b.PROBA);
    }
    chart.push(renderThreshold(x_scale, y_scale, id, data));
  } else {
    document.querySelector(`#narrative-${id}`).innerHTML = '';
  }

  chart.push(
    config.dataPlots.map((dataPlot, i, arr) => {
      const ifOwnColor = arr.length != 1;

      return (
        <Circle
          id={id}
          dataPlotID={i}
          data={data}
          x={x_scale.scale}
          y={y_scale.scale}
          config={config}
          dataPlot={dataPlot}
          ifOwnColor={ifOwnColor}
          key={`${id}-${i}-circle`}
        />
      );
    })
  );

  if (!d3.select(`#zoom-dir-${id}`).size())
    d3.select(`#pointChart-${id}`)
      .append('g')
      .attr('id', `zoom-dir-${id}`)
      .attr(
        'transform',
        `translate(${SVG.WIDTH - SVG.MARGIN.left - 50}, ${
          SVG.HEIGHT + SVG.MARGIN.top + SVG.MARGIN.bottom - 5
        })`
      )
      .append('text')
      .text('Brush to Zoom In');

  return chart;
};

export const renderCircle = (
  parent,
  data,
  x_scale,
  y_scale,
  config,
  dataPlot,
  ifOwnColor,
  stepLine = false,
  r = DEFAULT_PROPERTIES.CIRCLE_RADIUS
) => {
  const { xVal, yVal, color, shape } = dataPlot;
  const { xFormat, yFormat, colorScheme } = config;
  const colorSchemeFill = createColorSchemeFill(colorScheme, data, config);

  /* Beginnings of the stepLine if we still want it, but only works for highestOverTime right now... */
  if (stepLine) {
    const highestDataOverTime = filterDataByHighestOverTime(data, yVal, true);
    drawStepLine(parent, highestDataOverTime, SVG.MARGIN, x_scale, y_scale, xVal, yVal);
  }

  const bound = parent.selectAll(shape).data(data).enter();

  let point;

  const cx = (d) => {
    const cx = findCircleX(d, xVal, xFormat, x_scale, data);
    if (isNaN(cx)) return -10;
    return cx;
  };
  const cy = (d) => {
    const cy = findCircleY(d, yVal, yFormat, y_scale);
    if (isNaN(cy)) return -10;
    return cy;
  };

  if (shape == 'circle') {
    point = bound.append(shape).attr('cx', cx).attr('cy', cy).attr('r', r);
  } else {
    point = bound
      .append('path')
      .attr('d', d3.symbol().type(symbolParser(shape)).size(100))
      .attr('transform', function (d) {
        return 'translate(' + cx(d) + ',' + cy(d) + ')';
      });
  }

  if (data[0].PROBA) point.attr('fill', (d) => (d.LABEL == 0 ? '#6d9ac3' : '#accc7b'));
  else {
    point
      .attr('fill', (d) => (ifOwnColor ? color : colorSchemeFill(d[yVal])))
      .style('cursor', 'pointer')
      .attr('stroke', COLORS.GREY)
      .attr('stroke-width', '1px');
  }

  const tooltip = createToolTip(config.id);
  attachToolTip(point, tooltip, xVal, yVal);
};

// POSSIBLY can use findRectX... right now it's identical... (EXCEPT rect should not use percent or linear)
export const findCircleX = (
  d,
  xVal,
  xFormat,
  x_scale,
  data,
  margin = SVG.MARGIN,
  width = SVG.WIDTH
) => {
  switch (xFormat) {
    case 'time':
      return x_scale(new Date(d[xVal]));

    case 'band': {
      const { domain } = findDomainAndFormat('band', data, [xVal]);
      return -10 + x_scale(d[xVal]) + width / (domain.length * 2);
    }

    case 'percent':
      if (isNaN(x_scale(d[xVal]))) return -10;
      return x_scale(d[xVal]);

    case 'linear':
      if (isNaN(x_scale(d[xVal]))) return -10;
      return x_scale(d[xVal]);

    default:
      return margin.left * ((width - margin.left - margin.right) / data.length);
  }
};

export const findCircleY = (
  d,
  yVal,
  yFormat,
  y_scale,
  margin = SVG.MARGIN,
  height = SVG.HEIGHT
) => {
  switch (yFormat) {
    case 'percent':
      return y_scale(d[yVal]);

    case 'linear':
      return height + margin.top - y_scale(d[yVal]);

    case 'time':
      return y_scale(new Date(d[yVal]));

    case 'band':
      return margin.top + 10 + y_scale(d[yVal]); // grid doesn't work with this one scale right now...

    default:
      throw new Error('Incorrect format for x-axis');
  }
};

export const symbolParser = (shape) => {
  switch (shape) {
    case 'triangle':
      return d3.symbolTriangle;

    case 'square':
      return d3.symbolSquare;

    case 'diamond':
      return d3.symbolDiamond;

    case 'cross':
      return d3.symbolCross;

    default:
      return d3.symbolTriangle;
  }
};

export const drawStepLine = (parent, data, margin, x, y, xAttr, yAttr) => {
  parent
    .append('path')
    .datum(data)
    .attr('class', 'stepLine')
    .attr('fill', 'none')
    .attr('stroke', 'rgb(0, 127, 230)')
    .attr('stroke-width', 3)
    .attr('stroke-linejoin', 'round')
    .attr('stroke-linecap', 'round')
    .style('opacity', 0.8)
    .attr('d', createLineDAttribute(x, y, margin, xAttr, yAttr));
};

/* Unused... but possibly useful */
export const attachClickEventToPoints = (
  points,
  config,
  eventFunction,
  inputPropertyOnEventTarget
) => {
  points.attr('cursor', 'pointer').on('click', function (ev) {
    const input = ev.target[inputPropertyOnEventTarget];
    const selectedCircle = d3.select(this);
    Array.from(points).forEach((circle) => d3.select(circle).attr('r', config.points.radius));
    selectedCircle.attr('r', '12');
    eventFunction(+input);
  });
};
