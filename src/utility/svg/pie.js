import * as d3 from 'd3';
import { SVG } from '../constants';

import { createColorSchemeFill } from './helpers';
import { createToolTip, attachToolTip } from './tooltip';

export const renderPieChart = (id, data, config, dataProp) => {
  const g = d3
    .select(`#pieChart-${id}`)
    .append('g')
    .attr('transform', `translate(${SVG.WIDTH / 2},${SVG.MARGIN.top + SVG.HEIGHT / 2})`);

  const pie = d3
    .pie()
    .padAngle(config.padAngle ? 0.05 : 0)
    .value(function (d) {
      return d[dataProp];
    });
  const data_ready = pie(data);

  const colorScale = d3
    .scaleSequential()
    .domain(d3.extent(data.map((el) => +el[dataProp])))
    .interpolator(createColorSchemeFill(config.colorScheme, data, config));

  const pieChart = g
    .selectAll('path')
    .data(data_ready)
    .enter()
    .append('path')
    .attr(
      'd',
      d3
        .arc()
        .innerRadius(config.ifDonut ? 100 : 0)
        .outerRadius((SVG.HEIGHT * 0.8) / 2)
    )
    .attr('fill', function (d) {
      return colorScale(+d.data[dataProp]);
    })
    .attr('stroke', 'black')
    .style('stroke-width', '2px')
    .style('opacity', 0.7);

  const tooltip = createToolTip(id);
  attachToolTip(pieChart, tooltip, dataProp, undefined, true);
};
