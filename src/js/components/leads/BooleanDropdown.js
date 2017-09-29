import React from 'react';
import PropTypes from 'prop-types';

const BooleanDropdown = ({ title, name, onChange, id }) => {
  return (
    <div className="sidebar-item">
      <label>{title}</label>
      <select data-id={id} onChange={onChange} name={name}>
        <option value="">None</option>
        <option value="true">True</option>
        <option value="false">False</option>
      </select>
    </div>
  );
};

BooleanDropdown.propTypes = {
  title: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  id: PropTypes.func.isRequired,
};

export default BooleanDropdown;