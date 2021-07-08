import React from 'react';

import styles from '../../../styles/Components.module.css';

const FileUpload = React.forwardRef(({ labelText, changeHandler }, ref) => {
  return (
    <div className={styles.upload}>
      <button className={styles.uploadBtn}>
        <div className={styles.uploadText}>Upload File</div>
      </button>
      <input
        className={styles.input}
        ref={ref}
        type="file"
        accept=".csv,application/json"
        onChange={changeHandler}
      />
    </div>
  );
});

export default FileUpload;
