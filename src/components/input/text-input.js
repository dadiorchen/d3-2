import React from 'react';

const TextInput = ({ labelText, placeholder, value, changeHandler }) => {
  return (
    <label>
      {labelText}
      <input
        type="text"
        placeholder={(placeholder = 'start typing...')}
        value={value}
        onChange={changeHandler}
      />
    </label>
  );
};

export default TextInput;
