import React, { useEffect } from 'react';
import * as d3 from 'd3';
import { drawXAxis, drawYAxis, createScalesAndFormats, redrawYAxis } from '../utility/svg';

const Axis = ({ scale: { scale, formatter }, ifX, id, data, config }) => {
  const { xFormat, yFormat, dataPlots, horizontal, type } = config;

  useEffect(() => {
    if (scale) {
      if (ifX) {
        drawXAxis(d3.select(`g#axis-${id}`), scale, formatter, config);
        return () => {
          d3.select(`g#axis-${id}-${ifX}`).selectAll('*').remove();
        };
      } else {
        if (horizontal && type == 'bar') {
          d3.select(`#axis-${id}`).selectAll('*').remove();
        } else {
          const { y } = createScalesAndFormats(config, data, true);
          drawYAxis(d3.select(`g#axis-${id}`), y.scale, formatter, config);
        }
      }
    }
  }, [scale, dataPlots, xFormat, yFormat, horizontal, type]);

  return (
    <>
      <g id={`axis-${id}`}></g>
    </>
  );
};

export default Axis;
