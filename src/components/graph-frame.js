import React, { useEffect } from 'react';
import styles from '../../styles/GraphFrame.module.css';

const GraphFrame = (props) => {
  const { id, setSelectedGraph, selected, handleDelete } = props;

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

  return (
    <div className={styles.graphFrame} id={`frame-${id}`} onClick={handleClick}>
      <div className={styles.frameHeader}>
        <h2 className={styles.title}>Chart Title</h2>
        <button className={styles.deleteGraph} onClick={() => handleDelete({ id })}>
          X
        </button>
      </div>
      <div className={styles.wrapper}>{props.children}</div>
      <div className={styles.descriptionDiv}>
        <p className={styles.description}>
          Description: This is a graph using mock data. Upload your own and start playing around!
        </p>
      </div>
    </div>
  );
};

export default GraphFrame;
