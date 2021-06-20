import React from 'react';
import * as d3 from 'd3';
import { SVG, COLORS, LINE_STROKE_WIDTH, DEFAULT_PROPERTIES } from './constants';

import Axis from '../components/axis';
import AxisLabel from '../components/axis-label';
import Rect from '../components/rect';
import Circle from '../components/circle';
import Grid from '../components/grid';
import Line from '../components/line';

export const createSvg = (selector, height = SVG.HEIGHT, width = SVG.WIDTH) => {
  return d3.select(selector).append('svg').attr('width', width).attr('height', height);
};

export const createScale = (scaleType, domain, range) => {
  switch (scaleType) {
    case 'linear':
      return d3.scaleLinear().domain(domain).range(range);

    case 'band':
      return d3.scaleBand().domain(domain).range(range);

    case 'time':
      return d3.scaleTime().domain(domain).range(range);

    case 'point':
      return d3.scalePoint().domain(domain).range(range);

    case 'ordinal':
      return d3.scaleOrdinal().domain(domain).range(range);
  }
};

export const createRect = (
  parent,
  height,
  width,
  x,
  y,
  rx,
  ry,
  fill,
  type,
  textValue = null,
  stroke
) => {
  let temp = width;
  let rect = parent
    .append('rect')
    .attr('height', height)
    .attr('width', width)
    .attr('x', x)
    .attr('y', y)
    .attr('rx', rx)
    .attr('ry', ry)
    .attr('fill', fill)
    .attr('stroke', stroke)
    .attr('stroke-width', '2px')
    .attr('class', `${type}-rect`);

  textValue &&
    parent
      .append('text')
      .attr('x', function (d, i) {
        return (
          x + 10 + parseInt(d3.select(Array.from(d3.selectAll(`.${type}-rect`))[i]).attr('width'))
        );
      })
      .attr('y', y)
      .attr('dy', '.35em')
      .attr('y', function () {
        return parseInt(d3.select(this).attr('y')) + 10;
      })
      .attr('font-weight', 400)
      .text(textValue);

  return rect;
};

export const createCircle = (parent, cx, cy, r, fill, emphasizedID, setSelectedPointID) => {
  return parent
    .append('circle')
    .attr('cx', cx)
    .attr('cy', cy)
    .attr('r', (d) => {
      if (d.id == emphasizedID) {
        setSelectedPointID(emphasizedID);
        return '12';
      } else {
        return r;
      }
    })
    .attr('fill', fill)
    .style('cursor', 'pointer');
};

export const addGridToChart = (
  parent,
  x,
  y,
  type,
  data,
  dataPlots,
  height = SVG.HEIGHT,
  width = SVG.WIDTH,
  margin = SVG.MARGIN
) => {
  let xData;
  const { xVals } = organizeDataPlots(dataPlots);
  if (type === 'band') xData = findDomainAndFormat(type, data, xVals).domain;
  else if (x.ticks) {
    xData = x.ticks();
  } else xData = [];

  let yData = [];
  if (y.ticks) yData = y.ticks();

  return parent
    .append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`)
    .attr('stroke', 'currentColor')
    .attr('stroke-opacity', 0.1)
    .call((g) =>
      g
        .append('g')
        .selectAll('line')
        .data(xData)
        .join('line')
        .attr('x1', (d) => x(d) - margin.left)
        .attr('x2', (d) => x(d) - margin.left)
        .attr('y1', 0)
        .attr('y2', height + 10)
    )
    .call((g) =>
      g
        .append('g')
        .selectAll('line')
        .data(yData)
        .join('line')
        .attr('y1', (d) => y(d) - margin.top)
        .attr('y2', (d) => y(d) - margin.top)
        .attr('x1', -10)
        .attr('x2', width)
    );
};

export const createToolTip = () => {
  return d3
    .select('body')
    .append('div')
    .attr('class', 'hideTooltip')
    .style('position', 'absolute')
    .style('background-color', 'lightgray')
    .style('border', '2px solid gray')
    .style('position', 'absolute');
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

export const createLineDAttribute = (x, y, margin, xVal, yVal) => {
  return d3
    .line()
    .x((d) => x(new Date(d[xVal])))
    .y((d) => y(d[yVal] / 100) + 6)
    .curve(d3.curveStepAfter);
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
    .html(text)
    .attr('fill', (d) => console.log('inside legend!!', d));
};

export const tickDateFormatter = (data, key) => {
  const dateInputFormat = data[0][key];

  switch (true) {
    case /^[0-3]?[0-9]\/[0-3]?[0-9]\/(?:[0-9]{2})?[0-9]{2}$/.test(dateInputFormat):
      return d3.timeFormat('%b %d, %Y');

    case /^\d{4}$/.test(dateInputFormat):
      return d3.timeFormat('%Y');

    default:
      return d3.timeFormat('%b %Y');
  }
};

export const drawXAxis = (
  parent,
  x,
  formatter,
  config,
  margin = SVG.MARGIN,
  height = SVG.HEIGHT
) => {
  const xAxis = parent
    .call(d3.axisBottom(x).tickFormat(formatter))
    .attr('transform', `translate(0, ${height + margin.top + 10})`);

  const xAxisTicks = xAxis
    .selectAll('text')
    .style('text-anchor', 'end')
    .style('font-size', '1.5em')
    .style('fill', '#69a3b2');

  if (config.horizontal && config.type == 'bar') {
    xAxisTicks.attr('transform', 'translate(-15, 10)rotate(-90)').style('font-size', '2em');
  } else {
    xAxisTicks.attr('transform', 'translate(-5,10)rotate(-30)');
  }
};

export const drawYAxis = (parent, y, formatter, config, margin = SVG.MARGIN) => {
  parent
    .transition()
    .duration(750)
    .call(d3.axisLeft(y).tickFormat(formatter))
    .attr('transform', `translate(${margin.left - 10}, 0)`);
};

export const organizeDataPlots = (dataPlots) => {
  const xVals = dataPlots.map((el) => el.xVal);
  const yVals = dataPlots.map((el) => el.yVal);

  return {
    xVals,
    yVals,
  };
};

export const createScalesAndFormats = (config, data, ifAxisScale) => {
  const { dataPlots, xFormat, yFormat } = config;
  const { xVals, yVals } = organizeDataPlots(dataPlots);

  return {
    x: createScaleAndFormat(xFormat, data, xVals, true, ifAxisScale),
    y: createScaleAndFormat(yFormat, data, yVals, false, ifAxisScale),
  };
};

export const createScaleAndFormat = (type, data, keys, ifXAxis, ifAxisScale) => {
  const { MARGIN: margin, HEIGHT: height, WIDTH: width } = SVG;
  let range;

  if (ifXAxis) {
    range = [margin.left, width - margin.right];
  } else {
    if (type === 'linear' && !ifAxisScale) {
      range = [0, height];
    } else {
      range = [height + margin.top, margin.top];
    }
  }

  const { formatter, domain } = findDomainAndFormat(type, data, keys);

  if (type === 'percent') type = 'linear';
  const scale = createScale(type, domain, range);

  return { scale, formatter };
};

export const findDomainAndFormat = (type, data, keys) => {
  switch (type) {
    case 'time':
      return findTimeDomain(data, keys);

    case 'percent':
      return { domain: [0, 1], formatter: d3.format('.0%') };

    case 'linear':
      return { domain: findLinearDomainWithBuffer(data, keys) };

    case 'band':
      return {
        domain: data.reduce((acc, curr) => {
          keys.forEach((key) => acc.push(curr[key]));
          return acc;
        }, []),
      };

    case 'point':
      return {
        domain: data.reduce((acc, curr) => {
          keys.forEach((key) => acc.push(curr[key]));
          return acc;
        }, []),
      };

    default:
      return 'type not found';
  }
};

export const findTimeDomain = (data, keys) => {
  const dates = data.reduce((acc, curr) => {
    keys.forEach((key) => acc.push(new Date(curr[key])));
    return acc;
  }, []);

  const datesExtent = d3.extent(dates);
  datesExtent[0] = subtractDays(datesExtent[0], 1);
  datesExtent[1] = addDays(datesExtent[1], 1);

  return { domain: datesExtent, formatter: tickDateFormatter(data, keys[0]) };
};

export const findLinearDomainWithBuffer = (data, keys) => {
  const combinedData = data.reduce((acc, curr) => {
    keys.forEach((key) => acc.push(curr[key]));
    return acc;
  }, []);
  const extent = d3.extent(combinedData);
  extent[0] *= 0.9;
  extent[1] *= 1.1;
  return extent;
};

export const addAxisLabelToChart = (
  parent,
  text = 'some label',
  ifXAxis,
  height = SVG.HEIGHT,
  width = SVG.WIDTH,
  margin = SVG.MARGIN
) => {
  const label = parent
    .append('text')
    .attr('class', 'yLabel')
    .style('font-size', '1.2em')
    .text(text[0].toUpperCase() + text.slice(1));

  if (ifXAxis) {
    label
      .attr('x', width / 2)
      .attr('y', height + margin.top + margin.bottom - 10)
      .style('text-anchor', 'start');
  } else {
    label
      .attr('transform', 'rotate(-90)')
      .attr('y', margin.left > 100 ? margin.left - 100 + 20 : 20)
      .attr('x', -(height / 2 + margin.top))
      .style('text-anchor', 'middle');
  }
};

export const attachToolTip = (parent, tooltip, config) => {
  parent
    .on('mouseover', function (ev, d) {
      const text = `${d.automation_rate} & ${d.date}`;

      tooltip.transition().duration(200).style('opacity', 0.7);
      tooltip
        .html(text)
        .style('left', `${ev.clientX + 20}px`)
        .style('top', `${ev.clientY - 20}px`)
        .attr('class', null)
        .attr('class', 'showTooltip');
    })
    .on('mouseout', function (d) {
      tooltip.transition().duration(400).style('opacity', '0');
      tooltip.transition().delay(400).duration(0).style('left', '-50px').style('top', '-100px');
    });
};

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

export const renderAxisLabels = (id, config) => {
  return [
    <AxisLabel ifX={false} id={id} config={config} key={`${id}+${config.xLabel}-1`} />,
    <AxisLabel ifX={true} id={id} config={config} key={`${id}+${config.xLabel}-2`} />,
  ];
};

export const renderAxes = (x_scale, y_scale, id, data, config) => {
  return [
    <Axis key={`${id}-x`} scale={x_scale} id={`${id}-x`} ifX={true} data={data} config={config} />,
    <Axis key={`${id}-y`} scale={y_scale} id={`${id}-y`} ifX={false} data={data} config={config} />,
    ...renderAxisLabels(id, config),
  ];
};

export const renderGrid = (x_scale, id, data, config) => {
  return <Grid key={`grid-${id}`} x_scale={x_scale} id={id} data={data} config={config} />;
};

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

export const translateHorizontal = (type, id) => {
  d3.select(`#${type}Chart-${id}`).attr('transform', 'rotate(90)');
};

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
    case 'time': {
      // subtracted half a day to push rectangle to middle of tick
      return x_scale(new Date(d[xVal]) - 43200000);
    }

    case 'band':
      return x_scale(d[xVal]) + x_scale.bandwidth() * 0.1;

    default:
      return margin.left + i * ((width - margin.left - margin.right) / data.length);
  }
};

export const findRectY = (d, yVal, yFormat, y_scale, margin = SVG.MARGIN, height = SVG.HEIGHT) => {
  switch (yFormat) {
    case 'percent':
      return height + margin.top + y_scale(d[yVal]) / 100;

    case 'linear':
      return height + margin.top - y_scale(d[yVal]);

    default:
      throw new Error('Incorrect format for x-axis');
  }
};

export const findRectHeight = (d, yVal, yFormat, y_scale) => {
  switch (yFormat) {
    case 'percent':
      return y_scale(d[yVal]) / -100;

    case 'linear':
      return y_scale(d[yVal]);

    default:
      throw new Error('Incorrect format for x axis');
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

  const tooltip = createToolTip(d3.select('body'));
  attachToolTip(rect, tooltip);
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

export const createColorSchemeFill = (color, data, config) => {
  let colorFunc;
  if (color == 'rainbow') {
    colorFunc = d3.interpolateRainbow;
  } else if (color == 'green') {
    colorFunc = d3.interpolateGreens;
  } else if (color == 'blue') {
    colorFunc = d3.interpolateBlues;
  } else throw new Error('invalid color scheme');

  const { yVals } = organizeDataPlots(config.dataPlots);
  const { domain } = findDomainAndFormat('linear', data, yVals);

  return d3.scaleSequential().domain(domain).interpolator(colorFunc);
};

/* Point Chart helpers */

export const renderPointChart = (x_scale, y_scale, id, grid, data, config) => {
  const chart = [];

  chart.push(...renderAxes(x_scale, y_scale, id, data, config));

  if (grid) chart.push(renderGrid(x_scale, id, data, config));

  chart.push(
    config.dataPlots.map((dataPlot, i, arr) => {
      const ifOwnColor = arr.length != 1;

      return (
        <Circle
          id={id}
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

  return chart;
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
      return x_scale(d[xVal]) - 10 + width / (domain.length * 2);
    }

    case 'percent':
      return margin.left + x_scale(d[xVal]) / 100;

    case 'linear':
      return x_scale(d[xVal]);

    default:
      return margin.left + i * ((width - margin.left - margin.right) / data.length);
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
      return height + margin.top + y_scale(d[yVal]) / 100;

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

  if (shape == 'circle') {
    point = bound
      .append(shape)
      .attr('cx', (d) => findCircleX(d, xVal, xFormat, x_scale, data))
      .attr('cy', (d) => findCircleY(d, yVal, yFormat, y_scale))
      .attr('r', r);
  } else {
    point = bound
      .append('path')
      .attr('d', d3.symbol().type(symbolParser(shape)).size(100))
      .attr('transform', function (d) {
        return (
          'translate(' +
          findCircleX(d, xVal, xFormat, x_scale, data) +
          ',' +
          findCircleY(d, yVal, yFormat, y_scale) +
          ')'
        );
      });
  }

  point
    .attr('fill', (d) => (ifOwnColor ? color : colorSchemeFill(d[yVal])))
    .style('cursor', 'pointer')
    .attr('stroke', COLORS.GREY)
    .attr('stroke-width', '1px');

  const tooltip = createToolTip(d3.select('body'));
  attachToolTip(point, tooltip);
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
