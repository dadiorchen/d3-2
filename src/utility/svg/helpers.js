import React from 'react';
import * as d3 from 'd3';
import { SVG } from '../constants';
import { findDomainAndFormat } from './scales';

export const createSvg = (selector, height = SVG.HEIGHT, width = SVG.WIDTH) => {
  return d3.select(selector).append('svg').attr('width', width).attr('height', height);
};

export const addDays = (date, days) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

export const subtractDays = (date, days) => {
  const result = new Date(date);
  result.setDate(result.getDate() - days);
  return result;
};

export const createColorSchemeFill = (color, data, config) => {
  let colorFunc;
  if (color == 'rainbow') {
    colorFunc = d3.interpolateRainbow;
  } else if (color == 'green') {
    colorFunc = d3.interpolateGreens;
  } else if (color == 'blue') {
    colorFunc = d3.interpolateBlues;
  } else throw new Error('invalid color scheme');

  if (config.type == 'pie') return colorFunc;

  const { yVals } = organizeDataPlots(config.dataPlots);
  const { domain } = findDomainAndFormat('linear', data, yVals);

  return d3.scaleSequential().domain(domain).interpolator(colorFunc);
};

export const organizeDataPlots = (dataPlots) => {
  const xVals = dataPlots.map((el) => el.xVal);
  const yVals = dataPlots.map((el) => el.yVal);

  return {
    xVals,
    yVals,
  };
};

export const filterDataByHighestOverTime = (data, metric, ifTailNeeded) => {
  const sortedByDate = [...data].sort((a, b) => new Date(a.date) - new Date(b.date));
  let maxSoFar = -Infinity;

  const filteredDataPoints = sortedByDate.filter((el, i) => {
    if (el[metric] > maxSoFar) {
      maxSoFar = el[metric];
      return true;
    } else if (i == 0 || i == sortedByDate.length - 1) {
    }
    return false;
  });

  if (ifTailNeeded) {
    const lastDatedEntry = sortedByDate[sortedByDate.length - 1];
    const lastEntry = filteredDataPoints[filteredDataPoints.length - 1];
    filteredDataPoints.push({
      date: addDays(lastDatedEntry.date, 1),
      [metric]: lastEntry[metric],
    });
  }
  return filteredDataPoints;
};

export const filterDataByLowestOverTime = (data, metric, ifTailNeeded) => {
  const sortedByDate = [...data].sort((a, b) => new Date(a.date) - new Date(b.date));
  let minSoFar = Infinity;
  const filteredDataPoints = sortedByDate.filter((el) => {
    if (el[metric] < minSoFar) {
      minSoFar = el[metric];
      return true;
    }
    return false;
  });

  if (ifTailNeeded) {
    const lastDatedEntry = sortedByDate[sortedByDate.length - 1];
    const lastEntry = filteredDataPoints[filteredDataPoints.length - 1];
    filteredDataPoints.push({
      date: addDays(lastDatedEntry.date, 1),
      [metric]: lastEntry[metric],
    });
  }
  return filteredDataPoints;
};
