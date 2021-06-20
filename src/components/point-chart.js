import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';

import { SVG } from '../utility/constants';
import { renderPointChart, createScalesAndFormats } from '../utility/svg';
import { getGraphConfig, getGraphData } from '../redux/reducer/graph-reducer';

const PointChart = ({ id, config, data }) => {
  const { HEIGHT: height, WIDTH: width, MARGIN: margin } = SVG;
  const { xFormat, yFormat, dataPlots, grid } = config;

  const [x_scale, setXScale] = useState(null);
  const [y_scale, setYScale] = useState(null);

  useEffect(() => {
    const { x, y } = createScalesAndFormats(config, data, false);

    setXScale(x);
    setYScale(y);
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
