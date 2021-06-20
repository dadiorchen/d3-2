import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';

import { getGraphConfig, getGraphData } from '../redux/reducer/graph-reducer';

import { createScalesAndFormats, renderBarChart } from '../utility/svg';
import { SVG } from '../utility/constants';

const BarChart = ({ id, config, data }) => {
  const { xFormat, yFormat, dataPlots, grid, horizontal, backfill } = config;
  const { HEIGHT: height, WIDTH: width, MARGIN: margin } = SVG;
  const [x_scale, setXScale] = useState(null);
  const [y_scale, setYScale] = useState(null);

  useEffect(() => {
    const { x, y } = createScalesAndFormats(config, data, false);

    setXScale(x);
    setYScale(y);
  }, [data, xFormat, yFormat, dataPlots, id, horizontal, backfill]);

  return (
    <div className="bar-chart-container svg-container">
      <svg
        className="bar-chart-svg svg-content"
        id={`barChart-${id}`}
        viewBox={`0 0 ${width} ${height + margin.top * 2 + margin.bottom}`}
        preserveAspectRatio="none"
        transform={horizontal ? `rotate(-90)` : `rotate(0)`}
      >
        {x_scale && y_scale ? renderBarChart(x_scale, y_scale, id, grid, data, config) : null}
      </svg>
    </div>
  );
};

const mapStateToProps = (state, { id }) => {
  return {
    config: getGraphConfig(state.graph, id),
    data: getGraphData(state.graph, id),
  };
};

export default connect(mapStateToProps)(BarChart);
