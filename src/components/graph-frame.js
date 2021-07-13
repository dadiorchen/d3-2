import React, { useEffect } from 'react';
import styles from '../../styles/GraphFrame.module.css';
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import { GRAPH_TYPE } from '../utility/constants';
import { getCurrentFileName} from '../../src/redux/getters/getters';
import { connect } from 'react-redux';

import Legend from './legend';

const GraphFrame = (props) => {
  console.log("graph frame props:", props);
  const { id, setSelectedGraph, selected, handleDelete, fileName, type } = props;

  useEffect(() => {
    if (selected) {
      handleClick();
    }
  }, [selected]);

  const handleClick = () => {
    document.querySelector(`.${styles.highlight}`)?.classList.remove(styles.highlight);
    document.querySelector(`#frame-${id}`).classList.add(styles.highlight);
    setSelectedGraph(id);
  };

  const handleDownload = (data) => {
    const {id} = data;
    generatePNGAndDownload(
      document.getElementById(`frame-${id}`),
      () => {
        document.getElementById(`frame-${id}`).style.border = "5px solid white";
        Array.from(document.getElementsByClassName("GraphFrame_deleteGraph__3ldRg")).forEach(e => e.style.display = "none");
        document.getElementById(`${type}Chart-${id}`).setAttribute("height", "395px");
        document.getElementById(`${type}Chart-${id}`).setAttribute("width", "393px");

      },
      () => {
        document.getElementById(`frame-${id}`).style.border = ''
        Array.from(document.getElementsByClassName("GraphFrame_deleteGraph__3ldRg")).forEach(e => e.style.display = "");
        document.getElementById(`${type}Chart-${id}`).removeAttribute("height");
        document.getElementById(`${type}Chart-${id}`).removeAttribute("width");
        confirmAlert({
          title: "Chart Downloaded!",
          buttons: [
            {
              label: "OK",
            }
          ]
        });
      }
    )
  }
  //console.log('!!!!', props.fileName);
  return (
    <div className={styles.graphFrame} id={`frame-${id}`} onClick={handleClick}>
      <div className={styles.frameHeader}>
        <Legend id={id} />
        <h2 className={styles.title}>{fileName || 'Chart Title'}</h2>
        <button title='download' className={styles.deleteGraph} onClick={() => handleDownload({ id })}>
        ↓
        </button>
        <button className={styles.deleteGraph} onClick={(e) => {e.stopPropagation();handleDelete({ id })}}>
          X
        </button>
      </div>
      <div className={styles.wrapper}>{props.children}</div>
      <div className={styles.descriptionDiv}>
        <p className={styles.description} id={`narrative-${id}`}>
          Description: This is a graph using mock data. Upload your own and start playing around!
        </p>
      </div>
    </div>
  );
};

const mapStateToProps = (state, ownProps) => {
  console.log("ownProps:", ownProps);
  return {
    fileName: getCurrentFileName(state.graph, ownProps.id)
  };
};
export default connect(mapStateToProps)(GraphFrame)
//export default GraphFrame;
