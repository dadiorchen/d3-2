import React from 'react';

import styles from '../../../styles/Components.module.css';

const Dropdown = ({
  options,
  type,
  labelText,
  changeHandler,
  defaultValue: selectedValue,
  getAllKeys = true,
  specialObject = false,
}) => {
  const buildDropdown = (options) => {
    let opts = [];
    if (getAllKeys) {
      for (const key in options[0]) {
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
    } else {
      specialObject &&
        (() => {
          let opt = options[0];
          for (const key in options[0]) {
            if (typeof opt[key] == 'number') {
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
          }
        })();
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
        <select
          onChange={(ev) => changeHandler(ev.target.value)}
          value={type} 
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
      </label>
    </div>
  );
};

export default Dropdown;
