import React, { useEffect } from 'react';
import styles from '../../styles/GraphFrame.module.css';

const GraphFrame = (props) => {
  const { id, setSelectedGraph, selected, handleDelete, title, type } = props;

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
        Array.from(document.getElementsByClassName("GraphFrame_deleteGraph__3ldRg")).forEach(e => e.style.display = "none");
        document.getElementById(`${type}Chart-${id}`).setAttribute("height", "395px");
        document.getElementById(`${type}Chart-${id}`).setAttribute("width", "393px");

      },
      () => {
        Array.from(document.getElementsByClassName("GraphFrame_deleteGraph__3ldRg")).forEach(e => e.style.display = "");
        document.getElementById(`${type}Chart-${id}`).removeAttribute("height");
        document.getElementById(`${type}Chart-${id}`).removeAttribute("width");
        setTimeout(() => alert("Downloading the file..."),0);
      }
    )
  }
  return (
    <div className={styles.graphFrame} id={`frame-${id}`} onClick={handleClick}>
      <div className={styles.frameHeader}>
        <h2 className={styles.title}>{title || 'Chart Title'}</h2>
        <button title='download' className={styles.deleteGraph} onClick={() => handleDownload({ id })}>
          ↓
        </button>
        <button className={styles.deleteGraph} onClick={() => handleDelete({ id })}>
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

export default GraphFrame;
