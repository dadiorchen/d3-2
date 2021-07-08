import * as d3 from 'd3';

export const createToolTip = (id) => {
  return d3
    .select('body')
    .append('div')
    .attr('class', 'hideTooltip')
    .attr('id', `tooltip-${id}`)
    .style('position', 'absolute')
    .style('background-color', 'lightgray')
    .style('border', '2px solid gray')
    .style('position', 'absolute');
};

export const attachToolTip = (parent, tooltip, xVal, yVal, ifPie) => {
  parent
    .on('mouseover', function (ev, d) {
      let text = `${xVal}: ${d[xVal]} ${yVal ? `& ${yVal}: ${d[yVal]}` : null}`;
      if (ifPie) text = `${xVal}: ${d.data[xVal]}`;

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
