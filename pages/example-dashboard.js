import React, { useState, useEffect } from 'react';
import BarGraph from '../src/components/bar-graph';
import getModelData from './api/get/getModelData';
import * as d3 from 'd3';

import PointGraph from '../src/components/point-graph';
import { COLORS, DEFAULT_PROPERTIES } from '../src/utility/constants';
import { filterDataByHighestOverTime } from '../src/utility/svg';

const Dashboard = () => {
  const [barData, setBarData] = useState([]);
  const [currentPointIndex, setCurrentPointIndex] = useState(0);

  useEffect(() => {
    fetch('http://localhost:3000/api/get/getModelData')
      .then((res) => res.json())
      .then((data) => {
        const parseTime = d3.timeParse('%m/%d/%Y');
        data.forEach(function (d) {
          d.date = parseTime(d.date);
        });
        const highestDataOverTime = filterDataByHighestOverTime(data, 'automation_rate');

        const highestId = highestDataOverTime[highestDataOverTime.length - 1].id;
        setCurrentPointIndex(highestId);
        setBarData(data);
      });
    return () => {};
  }, []);

  return (
    <>
      {barData.length && (
        <div className="display-flex graph-container">
          <div className="point-graph">
            <PointGraph
              parent={'point-graph-svg'}
              data={barData}
              currentPointIndex={currentPointIndex}
              r={DEFAULT_PROPERTIES.CIRCLE_RADIUS}
              grid={true}
              margin={{
                top: 20,
                right: 20,
                bottom: 30,
                left: 40,
              }}
              setCurrentPointIndex={setCurrentPointIndex}
            />
          </div>
          <div className="model-summary-graphs">
            <div className="model-summary">
              <h3>Summary</h3>
              <hr />
              <h4>
                <b>{barData[currentPointIndex].name}</b> was run on{' '}
                <b>{barData[currentPointIndex].date.toDateString()}</b> reaching an automation rate
                of <b>{barData[currentPointIndex].automation_rate}%</b>
              </h4>
            </div>
            <div className="display-flex">
              <div className="bar-graph automation-rate">
                <div className="bar-with-label">
                  <h3 className="center-text">Task Name</h3>
                  <h3>Automation Rate (%)</h3>
                </div>

                {currentPointIndex >= 0 ? (
                  <>
                    <BarGraph
                      parent={'bar-graph-importance'}
                      data={barData.find((el) => el.id == currentPointIndex).tasks}
                      grid={false}
                      xScale={'importance'}
                      yScale={'name'}
                      height={500}
                      width={500}
                      currentPointIndex={currentPointIndex}
                      experiment={barData.find((el) => el.id == currentPointIndex).name}
                    />
                  </>
                ) : null}
              </div>
              <div className="bar-graph correlation">
                <h3> Impact (%)</h3>

                {currentPointIndex >= 0 ? (
                  <BarGraph
                    parent={'bar-graph-correlation'}
                    data={barData.find((el) => el.id == currentPointIndex).tasks}
                    grid={false}
                    xScale={'correlation'}
                    yScale={'name'}
                    height={500}
                    width={400}
                    barColor={COLORS.SMOOTH_PINK}
                    currentPointIndex={currentPointIndex}
                    experiment={barData.find((el) => el.id == currentPointIndex).name}
                  />
                ) : null}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Dashboard;
