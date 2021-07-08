import React from 'react';
import * as d3 from 'd3';
import { GRAPH_TYPE } from '../constants';
import { symbolParser } from './point';

export const addLegend = (svg, data, margin) => {
  const text = `<div className="point-legend-inside">
          <h5 className="point-legend-title">Legend</h5>
          <div className="point-legend-info">
          <svg className="point-legend-svg-line"></svg>
          <h6 className="point-legend-text">Maximum automation rate to date</h6>
          </div>
          <div className="point-legend-info">
          <svg className="point-legend-svg-dot"></svg>
          <h6 className="point-legend-text">Iteration result</h6>
          </div>
        </div>`;

  d3.select('.point-graph')
    .append('div')
    .datum(data)
    .attr('class', 'point-legend-inside')
    .html(text);
};

export const createLegendPieces = (parent, config, data, id) => {
  if (
    config.dataPlots.length < 2 ||
    (config.type != GRAPH_TYPE.POINT && config.type != GRAPH_TYPE.LINE)
  )
    return [];
  const pieces = [];

  let definingAxis = 'xVal';
  if (config.dataPlots[0].xVal == config.dataPlots[1].xVal) definingAxis = 'yVal';

  config.dataPlots.forEach((dataPlot, i) => {
    parent.append(createLegendPiece(dataPlot, i, config, definingAxis));
  });

  return pieces;
};

export const createLegendPiece = (dataPlot, i, config, definingAxis) => {
  const container = document.createElement('div');

  container.setAttribute('id', `legend-${config.id}-${i}`);
  container.append(createLegendSvg(config, dataPlot, i));
  fillLegendSvg(config, dataPlot, i);
  container.append(createLegendTag(config, dataPlot, i, definingAxis));

  return container;
};

export const createLegendSvg = (config, dataPlot, i) => {
  const svgContainer = document.createElement('div');
  svgContainer.setAttribute('width', '100px');
  svgContainer.setAttribute('height', '100px');
  const svg = document.createElement('svg');
  svg.setAttribute('id', `legend-svg-${config.id}-${i}`);
  svg.setAttribute('class', `svg-legends`);
  svg.setAttribute('viewBox', `0 0 ${20} ${20}`);
  svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
  svgContainer.append(svg);

  return svgContainer;
};

export const fillLegendSvg = (config, dataPlot, i) => {
  const parent = d3.select(`#legend-svg-${config.id}-${i}`);
  parent.selectAll('*').remove();

  if (config.type == 'line') {
    parent
      .append('path')
      .attr('d', 'M3,11 L13,11')
      .attr('stroke', dataPlot.color)
      .attr('stroke-width', 4)
      .attr('stroke-linejoin', 'round')
      .attr('stroke-linecap', 'round');
  } else if (dataPlot.shape == 'circle' && config.type == 'point') {
    parent.append('circle').attr('cx', 10).attr('cy', 10).attr('r', 4).attr('fill', dataPlot.color);
  } else {
    parent
      .append('path')
      .attr(
        'd',
        config.type == 'line'
          ? 'M0,0 L25,0'
          : d3.symbol().type(symbolParser(dataPlot.shape)).size(70)
      )
      .attr('transform', 'translate(10,10)')
      .attr('fill', dataPlot.color);
  }
};

export const drawLegendLine = (svg) => {
  svg
    .append('path')
    .attr('class', 'legendLine')
    .attr('fill', 'none')
    .attr('stroke', 'rgb(0, 127, 230)')
    .attr('stroke-width', 4)
    .attr('stroke-linejoin', 'round')
    .attr('stroke-linecap', 'round')
    .style('opacity', 0.8)
    .attr('d', 'M2,7 L25,7');
};

export const drawLegendDot = (svg, cx, cy, r, fill) => {
  svg.append('circle').attr('cx', cx).attr('cy', cy).attr('r', r).attr('fill', fill);
};
