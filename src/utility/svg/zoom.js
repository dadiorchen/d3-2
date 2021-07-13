import * as d3 from 'd3';
import { SVG } from '../constants';

import { createScalesAndFormats, tickDateFormatter } from './scales';
import { findCircleX, findCircleY } from './point';
import { addGridToChart } from './grid-axis';

export const createZoomFunctionality = (x_scale, y_scale, config, data) => {
  const currentScales = createScalesAndFormats(config, data, false);

  const axisScales = createScalesAndFormats(config, data, true);
  const pointScales = createScalesAndFormats(config, data, false);

  const zoomChart = (e, id, config, brush) => {
    let { x, y } = currentScales;
    if (config.yFormat === 'linear') {
      y.scale.range([SVG.HEIGHT + SVG.MARGIN.top, SVG.MARGIN.top]);
    }
    if (!e.selection) return;

    const xExtent = [e.selection[0][0], e.selection[1][0]];

    if (config.xFormat == 'band') {
      const eachBand = x.scale.step();
      const index1 = Math.floor((xExtent[0] - SVG.MARGIN.left) / eachBand);
      const index2 = Math.floor((xExtent[1] - SVG.MARGIN.left) / eachBand);
      x.scale.domain(x.scale.domain().slice(index1, index2 + 1));
    } else {
      x.scale.domain([x.scale.invert(xExtent[0]), x.scale.invert(xExtent[1])]);
    }

    const yExtent = [e.selection[0][1], e.selection[1][1]];
    y.scale.domain([y.scale.invert(yExtent[1]), y.scale.invert(yExtent[0])]);

    d3.selectAll('.brush').call(brush.clear, null);

    const xAxis = d3.select(`#axis-${id}-x`);
    if (config.xFormat == 'band') {
      xAxis
        .transition()
        .duration(1000)
        .call(
          d3.axisBottom(x.scale).tickValues(
            x.scale
              .domain()
              .filter(function (_, i) {
                if (x.scale.domain().length > 20) {
                  return !(i % Math.floor(x.scale.domain().length / 20));
                } else return true;
              })
              .map((el) => {
                return el.length > 13 ? el.slice(0, 5) : el;
              })
          )
        );
    } else {
      xAxis.transition().duration(1000).call(d3.axisBottom(x.scale));
    }

    const xAxisTicks = xAxis
      .selectAll('text')
      .style('text-anchor', 'end')
      .style('font-size', '1.5em')
      .style('fill', '#69a3b2');

    if (xAxisTicks.size() > 19) xAxisTicks.remove();

    if (config.horizontal && config.type == 'bar') {
      xAxisTicks.attr('transform', 'translate(-15, 10)rotate(-90)').style('font-size', '2em');
    } else {
      xAxisTicks.attr('transform', 'translate(-5,10)rotate(-30)');
    }

    const yAxis = d3.select(`#axis-${id}-y`);
    yAxis.transition().duration(1000).call(d3.axisLeft(y.scale));

    d3.select(`#grid-${id}`).selectAll('*').remove();
    addGridToChart(
      d3.select(`#grid-${id}`),
      x.scale,
      y.scale,
      config.xFormat,
      data,
      config.dataPlots
    );

    if (config.yFormat === 'linear') {
      y.scale.range([0, SVG.HEIGHT]);
    }

    config.dataPlots.forEach((dataPlot, i, arr) => {
      const parent = d3.select(`#circle-${id}-${i}`);

      if (dataPlot.shape == 'circle') {
        parent
          .selectAll('circle')
          .transition()
          .duration(1000)
          .attr('cx', function (d) {
            const cx = findCircleX(d, dataPlot.xVal, config.xFormat, x.scale, data);
            if (cx < SVG.MARGIN.left || cx > SVG.WIDTH || isNaN(cx)) {
              d3.select(this).transition().delay(700).style('display', 'none');
              if (isNaN(cx)) return -10;
            }
            return cx;
          })
          .attr('cy', function (d) {
            const cy = findCircleY(d, dataPlot.yVal, config.yFormat, y.scale);
            if (cy < SVG.MARGIN.top || cy > SVG.HEIGHT + SVG.MARGIN.top || isNaN(cy)) {
              d3.select(this).transition().delay(700).style('display', 'none');
              if (isNaN(cy)) return -10;
            }
            return cy;
          });
      } else {
        parent
          .selectAll('path')
          .transition()
          .duration(1000)
          .attr('transform', function (d) {
            let cx = findCircleX(d, dataPlot.xVal, config.xFormat, x.scale, data);
            if (cx < SVG.MARGIN.left || cx > SVG.WIDTH || isNaN(cx)) {
              d3.select(this).transition().delay(700).style('display', 'none');
              if (isNaN(cx)) cx = -10;
            }
            let cy = findCircleY(d, dataPlot.yVal, config.yFormat, y.scale);
            if (cy < SVG.MARGIN.top || cy > SVG.HEIGHT + SVG.MARGIN.top || isNaN(cy)) {
              d3.select(this).transition().delay(700).style('display', 'none');
              if (isNaN(cy)) cy = -10;
            }
            return `translate(${cx},${cy})`;
          });
      }
    });

    if (d3.select(`#zoom-dir-${id}`)) {
      d3.select(`#zoom-dir-${id}`).remove();
      d3.select(`#pointChart-${id}`)
        .append('g')
        .attr('id', `zoom-dir-${id}`)
        .attr(
          'transform',
          `translate(${SVG.WIDTH - SVG.MARGIN.left - 100}, ${
            SVG.HEIGHT + SVG.MARGIN.top + SVG.MARGIN.bottom - 5
          })`
        )
        .append('text')
        .text('DoubleClick to Zoom Out');
    }
  };

  const unzoomChart = (id, data, config, brush) => {
    const { x, y } = createScalesAndFormats(config, data, false);
    currentScales.x = x;
    currentScales.y = y;

    const xAxis = d3.select(`#axis-${id}-x`);

    if (config.xFormat == 'band') {
      xAxis
        .transition()
        .duration(1000)
        .call(
          d3.axisBottom(x.scale).tickValues(
            x.scale
              .domain()
              .filter(function (_, i) {
                if (x.scale.domain().length > 20) {
                  return !(i % Math.floor(x.scale.domain().length / 20));
                } else return true;
              })
              .map((el) => {
                return el.length > 13 ? el.slice(0, 5) : el;
              })
          )
        );
    } else if (config.xFormat == 'time') {
      xAxis
        .transition()
        .duration(1000)
        .call(d3.axisBottom(x.scale).tickFormat(tickDateFormatter(data, config.dataPlots[0].xVal)));
    } else {
      xAxis.transition().duration(1000).call(d3.axisBottom(x.scale));
    }

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

    const yAxis = d3.select(`#axis-${id}-y`);
    yAxis.transition().duration(1000).call(d3.axisLeft(y.scale));

    config.dataPlots.forEach((dataPlot, i, arr) => {
      const parent = d3.select(`#circle-${id}-${i}`);

      if (dataPlot.shape == 'circle') {
        parent
          .selectAll('circle')
          .transition()
          .duration(1000)
          .attr('cx', function (d) {
            return findCircleX(d, dataPlot.xVal, config.xFormat, x.scale, data);
          })
          .attr('cy', function (d) {
            return findCircleY(d, dataPlot.yVal, config.yFormat, y.scale);
          })
          .style('display', '');
      } else {
        parent
          .selectAll('path')
          .transition()
          .duration(1000)
          .attr('transform', function (d) {
            return (
              'translate(' +
              findCircleX(d, dataPlot.xVal, config.xFormat, x.scale, data) +
              ',' +
              findCircleY(d, dataPlot.yVal, config.yFormat, y.scale) +
              ')'
            );
          })
          .style('display', '');
      }
    });

    d3.select(`#grid-${id}`).selectAll('*').remove();
    addGridToChart(
      d3.select(`#grid-${id}`),
      x.scale,
      y.scale,
      config.xFormat,
      data,
      config.dataPlots
    );

    if (d3.select(`#zoom-dir-${id}`)) {
      d3.select(`#zoom-dir-${id}`).remove();
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
    }
  };

  return {
    zoomChart,
    unzoomChart,
  };
};
