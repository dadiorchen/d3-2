import React, { useEffect, useState, useReducer } from 'react';
import { connect } from 'react-redux';
import * as d3 from 'd3';

import { SVG } from '../utility/constants';
import { renderPointChart } from '../utility/svg/point';
import { createScalesAndFormats } from '../utility/svg/scales';
import { createZoomFunctionality } from '../utility/svg/zoom';
import { getGraphConfig, getGraphData } from '../redux/getters/getters';

const PointChart = ({ id, config, data, setInZoom }) => {
  const { HEIGHT: height, WIDTH: width, MARGIN: margin } = SVG;
  const { xFormat, yFormat, dataPlots, grid } = config;

  const [x_scale, setXScale] = useState(null);
  const [y_scale, setYScale] = useState(null);

  useEffect(() => {
    const { x, y } = createScalesAndFormats(config, data, false);

    setXScale(x);
    setYScale(y);

    const brush = d3.brush().extent([
      [SVG.MARGIN.left, SVG.MARGIN.top - 10],
      [SVG.WIDTH, SVG.HEIGHT + SVG.MARGIN.top + 10],
    ]);

    const { zoomChart, unzoomChart } = createZoomFunctionality(x.scale, y.scale, config, data);

    d3.select(`#pointChart-${id}`)
      .append('g')
      .attr('class', 'brush')
      .call(brush.on('end', (e) => zoomChart(e, id, config, brush)))
      .on('dblclick', () => unzoomChart(id, data, config, brush));

    return () => {
      d3.select(`#pointChart-${id}`).selectAll('.movable').remove();
    };
  }, [data, xFormat, yFormat, dataPlots, id]);

  return (
    <div className="point-chart-container svg-container">
      <svg
        className="point-chart-svg svg-content"
        id={`pointChart-${id}`}
        viewBox={`0 0 ${width} ${height + margin.top + margin.bottom}`}
        preserveAspectRatio="xMidYMid meet"
      >
        {x_scale && y_scale ? renderPointChart(x_scale, y_scale, id, grid, data, config) : null}
      </svg>
    </div>
  );
};

const mapStateToProps = (state, { id }) => ({
  config: getGraphConfig(state.graph, id),
  data: getGraphData(state.graph, id),
});

export default connect(mapStateToProps)(PointChart);
