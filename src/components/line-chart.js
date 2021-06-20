import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';

import { createScalesAndFormats, renderLineChart } from '../utility/svg';
import { SVG } from '../utility/constants';
import { getGraphConfig, getGraphData } from '../redux/reducer/graph-reducer';

const LineChart = ({ id, config, data }) => {
  const { xFormat, yFormat, grid, dataPlots } = config;
  const { HEIGHT: height, WIDTH: width, MARGIN: margin } = SVG;
  const [x_scale, setXScale] = useState(null);
  const [y_scale, setYScale] = useState(null);

  useEffect(() => {
    const { x, y } = createScalesAndFormats(config, data, false);

    setXScale(x);
    setYScale(y);
  }, [data, xFormat, yFormat, dataPlots, id]);

  return (
    <div className="line-chart-container svg-container">
      <svg
        className="line-chart-svg svg-content"
        id={`lineChart-${id}`}
        viewBox={`0 0 ${width} ${height + margin.top + margin.bottom}`}
        preserveAspectRatio="xMidYMid meet"
      >
        {x_scale && y_scale ? renderLineChart(x_scale, y_scale, id, grid, data, config) : null}
      </svg>
    </div>
  );
};

const mapStateToProps = (state, { id }) => ({
  config: getGraphConfig(state.graph, id),
  data: getGraphData(state.graph, id),
});

export default connect(mapStateToProps)(LineChart);
