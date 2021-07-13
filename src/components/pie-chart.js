import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import * as d3 from 'd3';

import { SVG } from '../utility/constants';
import { renderPieChart } from '../utility/svg/pie';
import { getGraphConfig, getGraphData } from '../redux/getters/getters';

const PieChart = ({ id, config, data, padAngle = 0, ifDonut = false, otherID }) => {
  const { HEIGHT: height, WIDTH: width, MARGIN: margin } = SVG;
  const { xVal } = config.dataPlots[0];

  useEffect(() => {
    renderPieChart(otherID, data, config, xVal);

    return () => {
      d3.select(`#pieChart-${otherID}`).selectAll('*').remove();
    };
  }, [data, id, config]);

  return (
    <div className="pie-chart-container svg-container">
      <svg
        className="pie-chart-svg svg-content"
        id={`pieChart-${otherID}`}
        viewBox={`0 0 ${width} ${height + margin.top + margin.bottom}`}
        preserveAspectRatio="xMidYMid meet"
      ></svg>
    </div>
  );
};

const mapStateToProps = (state, { id }) => ({
  config: getGraphConfig(state.graph, id),
  data: getGraphData(state.graph, id),
});

export default connect(mapStateToProps)(PieChart);
