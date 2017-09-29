import React from 'react';
import PropTypes from 'prop-types';

const SimpleInput = ({ title, name, placeholder, onChange, value }) => {
  return (
    <div className="sidebar-item">
      <label htmlFor={`id_${name}`}>{title}</label>
      <input id={`id_${name}`} onChange={onChange} name={name} type="text" placeholder={placeholder} />
    </div>
  );
};

SimpleInput.propTypes = {
  title: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string,
};

SimpleInput.defaultProps = {
  value: '',
}

export default SimpleInput;
