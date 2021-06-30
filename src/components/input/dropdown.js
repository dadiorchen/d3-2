import React, { useEffect } from 'react';
import { connect } from 'react-redux';

import styles from '../../../styles/Components.module.css';
import { getCurrentConfig } from '../../redux/reducer/graph-reducer';

const Dropdown = ({
  options,
  labelText,
  changeHandler,
  defaultValue,
  config,
  specialObject = false,
}) => {
  const [select, setSelect] = React.useState(null);

  useEffect(() => {
    const refreshedSelect = (
      <select
        onChange={(ev) => changeHandler(ev.target.value)}
        value={defaultValue}
        className={styles.dropdownSelect}
      >
        {options.length && specialObject
          ? buildDropdown(options)
          : options.map((option, i) => (
              <option key={option} value={option}>
                {buildOptionString(option)}
              </option>
            ))}
      </select>
    );

    setSelect(refreshedSelect);
  }, [defaultValue, options, config]);

  const buildDropdown = (options) => {
    let opts = [];
    for (const key in options[0]) {
      if (!key.length) continue;
      opts.push(
        <option key={key} value={key}>
          {key
            .split(' ')
            .reduce((acc, val, i) => {
              return (acc += val[0].toUpperCase() + val.slice(1));
            }, '')[0]
            .toUpperCase() + key.slice(1)}
        </option>
      );
    }
    return opts;
  };

  const buildOptionString = (optionKey) => {
    return optionKey.split(' ').reduce((acc, val) => {
      return (acc += val[0].toUpperCase() + val.slice(1) + ' ');
    }, '');
  };

  return (
    <div>
      <label>
        {labelText}
        {select}
      </label>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    config: getCurrentConfig(state.graph),
  };
};

export default connect(mapStateToProps)(Dropdown);
