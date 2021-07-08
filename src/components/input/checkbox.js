import React from 'react';

import styles from '../../../styles/Components.module.css';

const Checkbox = ({ labelText, checked, changeHandler }) => {
  return (
    <label>
      {labelText}
      <input type="checkbox" checked={checked} onChange={changeHandler}  className={styles.checkbox} />
    </label>
  );
};


export default Checkbox;
