import React from 'react';
import { connect } from 'react-redux';

import styles from '../styles/Home.module.css';
import Head from 'next/head';

import { getCurrentConfig, getAllIdAndType } from '../src/redux/getters/getters';
import Toolbar from '../src/components/toolbar';
import GraphFrame from '../src/components/graph-frame';
import BarChart from '../src/components/bar-chart';
import PointChart from '../src/components/point-chart';
import LineChart from '../src/components/line-chart';
import { setSelectedGraph, deleteGraph } from '../src/redux/actions/actions';

import PieChart from '../src/components/pie-chart';

const Playground = (props) => {
  const { allIdAndType, setSelectedGraph, deleteGraph } = props;

  const createGraph = (type, id) => {
    switch (type) {
      case 'bar': {
        return <BarChart key={id} id={id} />;
      }
      case 'line': {
        return <LineChart key={id} id={id} />;
      }

      case 'point': {
        return <PointChart key={id} id={id} />;
      }

      case 'pie': {
        return <PieChart key={id} id={id} />;
      }

      default: {
        return <BarChart key={id} id={id} />;
      }
    }
  };

  const renderGraphs = (allIdAndType) => {
    return allIdAndType.map((el, i, arr) => {
      let selected = false;
      if (i == arr.length - 1) selected = true;
      return (
        <GraphFrame
          key={`frame-${el.id}`}
          id={el.id}
          type={el.type}
          setSelectedGraph={setSelectedGraph}
          handleDelete={deleteGraph}
          selected={selected}
        >
          {createGraph(el.type, el.id)}
        </GraphFrame>
      );
    });
  };

  return (
    <>
      <div className="playground-container">
        <Head>
          <script src="https://html2canvas.hertzen.com/dist/html2canvas.js"></script>

          <script
            dangerouslySetInnerHTML={{
              __html: `function generatePNGAndDownload(container, beforeHook, afterHook){
                beforeHook && beforeHook();
                html2canvas(container)
                .then(function(canvas){
                  var dataURL = canvas.toDataURL();
                  const div = document.createElement("div");
                  document.body.appendChild(div);
                  div.innerHTML = '<a id="a1" href="' + dataURL + '" download="chart.png" style="display:none" >download</a>';
                  document.getElementById("a1").click();
                  afterHook && afterHook();
                  document.body.removeChild(div);
                });
              }
                      `,
            }}
          ></script>
        </Head>
        <Toolbar />
        <div className="graph-playground">{renderGraphs(allIdAndType)}</div>
      </div>
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    config: getCurrentConfig(state.graph),
    allIdAndType: getAllIdAndType(state.graph),
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setSelectedGraph: (id) => dispatch(setSelectedGraph(id)),
    deleteGraph: (id) => dispatch(deleteGraph(id)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Playground);
