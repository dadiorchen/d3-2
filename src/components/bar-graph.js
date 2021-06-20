import React, { useEffect, useState } from 'react';
import * as d3 from 'd3';

import styles from '../../styles/SvgStyles.module.css';
import { createScale, createSvg, createRect, createToolTip } from '../utility/svg';
import { COLORS, scaleType, SVG } from '../utility/constants';

const BarGraph = ({
  parent,
  data,
  xScale,
  yScale,
  height = SVG.HEIGHT,
  width = SVG.WIDTH,
  barColor = COLORS.PRIMARY_BLUE,
  currentPointIndex,
  experiment,
}) => {
  let margin = {
    left: 150,
    right: 40,
    bottom: 0,
    top: 40,
  };

  useEffect(() => {
    data = data.sort((a, b) => {
      return parseInt(b.correlation) - parseInt(a.correlation);
    });

    const barSvg = createSvg(`.${parent}`, height, width);
    const yTransform = function () {
      let res = [];
      for (let val in data) {
        res.push(Math.round(height / data.length) * val);
      }
      return res;
    };

    let x = createScale(
      scaleType.LINEAR,
      d3.extent(data, (d) => +d[xScale]),
      [d3.min(data, (d) => +d[xScale]), 0.53 * width]
    );
    let xPercent = createScale(
      scaleType.LINEAR,
      [0, 100],
      [d3.min(data, (d) => +d[xScale]), 0.53 * width]
    );

    let y = createScale(
      scaleType.ORDINAL,
      data.map((d) => d[yScale]),
      yTransform()
    );

    let yAxis = d3.axisLeft(y).tickSize(0).tickPadding(60);
    const tooltip = createToolTip();

    barSvg
      .append('g')
      .attr('class', xScale === 'correlation' ? `${styles.yPlotHidden} y-axis` : styles.yAxis)
      .attr('transform', `translate(${margin.left + 90}, 10)`)
      .call(yAxis);

    let rectParent = barSvg.selectAll('rect').data(data).enter();

    xScale !== 'correlation' &&
      createRect(
        rectParent,
        20,
        0.6 * width,
        xScale === 'correlation' ? 0 : 200,
        (d) => y(d.name),
        10,
        10,
        '#d4dcf2'
      );

    // createRect(rectParent, 20, (d) => x(+d[xScale]), xScale === "correlation" ? 16 : 200, (d) => y(d.name) , 10, 10, barColor, (d) => d[xScale])
    createRect(
      rectParent,
      20,
      xScale === 'correlation' ? (d) => x(+d[xScale]) : (d) => xPercent(+d[xScale]),
      xScale === 'correlation' ? 16 : 200,
      (d) => y(d.name),
      10,
      10,
      barColor,
      xScale,
      (d) => d[xScale]
    )
      .on('mouseover', function (ev, d) {
        tooltip.transition().duration(200).style('opacity', 0.8);

        tooltip
          .html(
            `<b>${experiment}</b><br /><br /><b>${d.name}</b><br />${
              xScale == 'correlation' ? 'impact' : 'automation rate'
            }: ${+d[xScale]}%`
          )
          .style('left', `${ev.clientX + 20}px`)
          .style('top', `${ev.clientY + 20}px`)
          .attr('class', null)
          .attr('class', 'showTooltip');
      })
      .on('mouseout', function (d) {
        tooltip.transition().duration(400).style('opacity', '0');
        tooltip.transition().delay(400).duration(0);
      });

    return () => {
      barSvg.remove();
    };
  }, [currentPointIndex]);

  return <div className={`${parent} bar-graph`}></div>;
};

export default BarGraph;
