import React from 'react';

import styles from '../../../styles/Components.module.css';

const Checkbox = ({ labelText, checked, changeHandler }) => {
  return (
    <label className={styles.checkbox}>
      <input type="checkbox" checked={checked} onChange={changeHandler} />
      {labelText}
    </label>
  );
};

export default Checkbox;
