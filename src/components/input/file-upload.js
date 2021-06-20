import React from 'react';

import styles from '../../../styles/Components.module.css';

const FileUpload = React.forwardRef(({ labelText, changeHandler }, ref) => {
  return (
    <div className={styles.upload}>
      <p className={styles.label}>{labelText}</p>
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
