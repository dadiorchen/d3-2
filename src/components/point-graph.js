import React, { useEffect, useState } from 'react';
import * as d3 from 'd3';
import {
  createCircle,
  createScale,
  createSvg,
  createToolTip,
  filterDataByLowestOverTime,
  drawLegendLine,
  addLegend,
} from '../utility/svg';
import { filterDataByHighestOverTime, addDays, drawLegendDot } from '../utility/svg';

import Toggle from './toggle';

const PointChart = ({ parent, data, r, grid, margin, currentPointIndex, setCurrentPointIndex }) => {
  const [toggle, setToggle] = useState(true);
  const [svg, setSvg] = useState(null);
  const [selectedPointID, setSelectedPointID] = useState(null);
  const chartWidth = 600;
  const chartHeight = 500;
  const newMargin = {
    left: 120,
    right: 40,
    top: 40,
    bottom: 80,
  };

  useEffect(() => {
    const dates = data.map((experiment) => experiment.date);
    const datesExtent = d3.extent(dates);
    datesExtent[1] = addDays(datesExtent[1], 1);
    const colorScale = d3
      .scaleSequential(d3.interpolateRainbow)
      .domain(d3.extent(data.map((d) => d.automation_rate)));
    const pointSvg = createSvg(`.${parent}`);
    setSvg(pointSvg);
    const x_scale = createScale('time', datesExtent, [10, chartWidth]);

    pointSvg
      .append('g')
      .attr('id', 'xAxis')
      .call(d3.axisBottom(x_scale).tickFormat(d3.timeFormat('%b %d, %Y')))
      .attr('transform', `translate(${margin.left + 75}, ${chartHeight})`)
      .selectAll('text')
      .attr('transform', 'translate(-5,10)rotate(-30)')
      .style('text-anchor', 'end')
      .style('font-size', '1.5em')
      .style('fill', '#69a3b2');

    const formatPercent = d3.format('.0%');
    const y_scale = createScale('linear', [0, 1], [chartHeight - margin.top, 0]);

    pointSvg
      .append('g')
      .attr('id', 'yAxis')
      .call(d3.axisLeft(y_scale).tickFormat(formatPercent))
      .attr('transform', `translate(${margin.left + 75}, ${margin.top})`);

    if (grid) addOldGridToChart(pointSvg, chartHeight, chartWidth, margin, x_scale, y_scale);

    const highestDataOverTime = filterDataByHighestOverTime(data, 'automation_rate', true);
    drawOldStepLine(
      pointSvg,
      highestDataOverTime,
      margin,
      x_scale,
      y_scale,
      'date',
      'automation_rate'
    );

    const div = createToolTip();

    let parentCircle = pointSvg.selectAll('circle').data(data).enter();

    createCircle(
      parentCircle,
      function (d) {
        return x_scale(new Date(d.date)) + margin.left + 75;
      },
      function (d) {
        return y_scale(d.automation_rate / 100) + margin.top;
      },
      r,
      function (d) {
        return colorScale(d.automation_rate);
      },
      currentPointIndex,
      setSelectedPointID
    )
      .on('click', function (ev, d) {
        let selectedCircle = d3.select(this);
        setSelectedPointID(d.id);
        Array.from(d3.selectAll('circle')).forEach((circle) => d3.select(circle).attr('r', '7'));
        selectedCircle.attr('r', '12');
        setCurrentPointIndex(+ev.target.id);
      })
      .on('mouseover', function (ev, d) {
        div.transition().duration(200).style('opacity', 0.8);
        div
          .html(
            `<b>${d.name}</b> <br>
        Automation Rate: ${d.automation_rate}% <br>
        Error Rate: ${d.error_rate}%`
          )
          .style('left', `${ev.clientX + 20}px`)
          .style('top', `${ev.clientY - 20}px`)
          .attr('class', null)
          .attr('class', 'showTooltip');
      })
      .on('mouseout', function (d) {
        div.transition().duration(400).style('opacity', '0');
        div.transition().delay(400).duration(0).style('left', '-50px').style('top', '-100px');
      })
      .attr('id', function (d) {
        return d.id;
      });

    addAxisLabelToChart(pointSvg, chartWidth, chartHeight, margin, 'Automation Rate', false);

    drawLegendLine(d3.select('.point-legend-svg-line'));
    drawLegendDot(d3.select('.point-legend-svg-dot'), 15, 7, 6, 'black');

    return () => {
      pointSvg.selectAll('*').remove();
      pointSvg.remove();
      div.remove();
    };
  }, [data]);

  useEffect(() => {
    const dates = data.map((experiment) => experiment.date);
    const datesExtent = d3.extent(dates);
    datesExtent[1] = addDays(datesExtent[1], 1);
    const xScale = createScale('time', datesExtent, [10, chartWidth]);
    const yScale = createScale('linear', [0, 1], [chartHeight - margin.top, 0]);
    const yLabel = d3.select('.yLabel');
    const colorScale = d3
      .scaleSequential(d3.interpolateRainbow)
      .domain(d3.extent(data.map((d) => d.automation_rate)));
    const stepLine = d3.select('.stepLine');
    const legend = d3.select('.point-legend-inside');
    const stepLineLegend = d3.select('#step-line-legend');

    if (!toggle) {
      // yLabel.text(text[0].toUpperCase() + text.slice(1))
      yLabel.text('Error Rate');
      stepLine
        .attr('stroke', 'rgb(0, 127, 230, 0)')
        .datum(filterDataByLowestOverTime(data, 'error_rate', true))
        .transition()
        .duration(1000)
        .attr('d', createOldLineDAttribute(xScale, yScale, margin, 'date', 'error_rate'));

      stepLine.transition().delay(1200).duration(200).attr('stroke', 'rgb(0, 127, 230, 1)');

      legend.transition().duration(600).style('top', '250px');

      stepLineLegend.text('Minimum error rate to date');

      svg
        .selectAll('circle')
        .transition()
        .duration(1000)
        .on('start', function () {
          d3.select(this).attr('fill', 'black').attr('r', 5);
        })
        // .delay(function(d, i) {
        //     return i / data.length * 500;  // Dynamic delay (i.e. each item delays a little longer)
        // })
        .attr('cy', function (d) {
          return yScale(d.error_rate / 100) + margin.top;
        })
        .on('end', function () {
          d3.select(this)
            .transition()
            .duration(200)
            .attr('fill', function (d) {
              return colorScale(d.automation_rate);
            })
            .attr('r', (d) => (d.id == selectedPointID ? '12' : r));
        });
    } else if (svg) {
      yLabel.text('Automation Rate');
      // stepLine.transition().duration(1000).style("opacity", 1);
      stepLine
        .attr('stroke', 'rgb(0, 127, 230, 0)')
        .datum(filterDataByHighestOverTime(data, 'automation_rate', true))
        .transition()
        .duration(1000)
        .attr('d', createOldLineDAttribute(xScale, yScale, margin, 'date', 'automation_rate'));

      stepLine.transition().delay(1200).duration(200).attr('stroke', 'rgb(0, 127, 230, 1)');

      legend.transition().duration(600).style('top', '605px');

      stepLineLegend.text('Maximum automation rate to date');

      svg
        .selectAll('circle')
        .transition()
        .duration(1000)
        .on('start', function () {
          d3.select(this).attr('fill', 'black').attr('r', 5);
        })
        // .delay(function(d, i) {
        //     return i / data.length * 500;  // Dynamic delay (i.e. each item delays a little longer)
        // })
        .attr('cy', function (d) {
          return yScale(d.automation_rate / 100) + margin.top;
        })
        .on('end', function () {
          d3.select(this)
            .transition()
            .duration(200)
            .attr('fill', function (d) {
              return colorScale(d.automation_rate);
            })
            .attr('r', (d) => (d.id == selectedPointID ? '12' : r));
        });
    }
  }, [toggle]);

  return (
    <>
      <div className="pointGraphHeader">
        <div className="point-title-toggle">
          <h3>Improvement over Time</h3>
          <Toggle
            handleToggle={setToggle}
            toggleState={toggle}
            defaultLabel={'Automation'}
            onLabel={'Error'}
          />
        </div>
        <div className="point-legend-inside">
          <h5 className="point-legend-title">Legend</h5>
          <div className="point-legend-info">
            <svg className="point-legend-svg-line"></svg>
            <h6 className="point-legend-text" id="step-line-legend">
              Maximum automation rate to date
            </h6>
          </div>
          <div className="point-legend-info">
            <svg className="point-legend-svg-dot"></svg>
            <h6 className="point-legend-text">Iteration result</h6>
          </div>
        </div>
      </div>
      <div className={parent}></div>
    </>
  );
};

function addOldGridToChart(parent, height, width, margin, x, y) {
  return parent
    .append('g')
    .attr('transform', `translate(${margin.left + 75}, ${margin.top})`)
    .attr('stroke', 'currentColor')
    .attr('stroke-opacity', 0.1)
    .call((g) =>
      g
        .append('g')
        .selectAll('line')
        .data(x.ticks())
        .join('line')
        .attr('x1', (d) => x(d))
        .attr('x2', (d) => x(d))
        .attr('y1', 0)
        .attr('y2', height - margin.top)
    )
    .call((g) =>
      g
        .append('g')
        .selectAll('line')
        .data(y.ticks())
        .join('line')
        .attr('y1', (d) => y(d))
        .attr('y2', (d) => y(d))
        .attr('x1', 0)
        .attr('x2', width)
    );
}

function drawOldStepLine(parent, data, margin, x, y, xAttr, yAttr) {
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
    .attr('d', createOldLineDAttribute(x, y, margin, xAttr, yAttr));
}

function createOldLineDAttribute(x, y, margin, xAttr, yAttr) {
  return d3
    .line()
    .x((d) => x(new Date(d[xAttr])) + margin.left + 75)
    .y((d) => y(d[yAttr] / 100) + margin.top)
    .curve(d3.curveStepAfter);
}

function addAxisLabelToChart(svg, chartWidth, chartHeight, margin, text, ifXAxis) {
  const label = svg
    .append('text')
    .attr('class', 'yLabel')
    .style('font-size', '1.2em')
    .text(text[0].toUpperCase() + text.slice(1));

  if (ifXAxis) {
    label
      .attr('x', chartWidth / 2 + margin.left)
      .attr('y', chartHeight + margin.top + margin.bottom + 25)
      .style('text-anchor', 'start');
  } else {
    label
      .attr('transform', 'rotate(-90)')
      .attr('y', margin.left + (margin.left > 10 ? 10 : 20))
      .attr('x', -(chartHeight / 2 + margin.top))
      .style('text-anchor', 'middle');
  }
}

export default PointChart;
