import React from 'react';

const Toggle = ({ handleToggle, toggleState, defaultLabel, onLabel }) => {
  return (
    <div className="toggleContainer">
      <label>{defaultLabel}</label>
      <label className="pointGraphToggle">
        <input type="checkbox" onClick={() => handleToggle(!toggleState)} />
        <span className="slider round"></span>
      </label>
      <label>{onLabel}</label>
    </div>
  );
};

export default Toggle;
