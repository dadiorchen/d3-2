import React, { useEffect, useState } from 'react';
import * as d3 from 'd3';
import { connect } from 'react-redux';

import styles from '../../styles/Legend.module.css';

import { fillLegendSvg } from '../utility/svg/legend';
import { getGraphConfig, getGraphData } from '../redux/getters/getters';

const Legend = ({ id, data, config }) => {
  const [svgs, setSvgs] = useState([]);

  useEffect(() => {
    if (config.dataPlots && config.dataPlots.length > 1) {
      let definingAxis;
      if (config.dataPlots[0].xVal == config.dataPlots[1].xVal) definingAxis = 'yVal';
      else if (config.dataPlots[0].yVal == config.dataPlots[1].yVal) definingAxis = 'xVal';
      else {
        setSvgs(
          <div className={styles.legendPieces}>
            <p style={{ textAlign: 'center' }}>One axis must be all the same parameter!</p>
          </div>
        );
        return;
      }
      setSvgs(
        config.dataPlots.map((el, i) => {
          return (
            <div
              className={styles.legendPieces}
              id={`legend-piece-${config.id}-${i}`}
              key={`leg-p-${config.id}-${i}`}
            >
              <svg
                className={`svg-legends`}
                width={20}
                height={20}
                id={`legend-svg-${config.id}-${i}`}
              ></svg>
              <p id={`legend-tag-${config.id}-${i}`}>
                {el[definingAxis] || `Choose your ${definingAxis}`}
              </p>
            </div>
          );
        })
      );
    }

    config.dataPlots.forEach((el, i) => {
      fillLegendSvg(config, el, i);
    });

    return () => {
      document
        .querySelectorAll(`#svg-legends`)
        .forEach((el) => d3.select(el).selectAll('*').remove());
    };
  }, [data, id, config, config.dataPlots]);

  return (
 
    <div
      className={config.dataPlots.length > 1 ? styles.legend : styles.hidden}
      id={`legend-${id}`}
    >
      {svgs}
    </div>
  );
};

const mapStateToProps = (state, { id }) => {
  console.log('state.graph', state.graph)
  return {
    config: getGraphConfig(state.graph, id),
    data: getGraphData(state.graph, id),
  };
};

export default connect(mapStateToProps)(Legend);
