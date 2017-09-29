import React from 'react';
import PropTypes from 'prop-types';

const FormInput = ({ id, input, label, type, checked, meta: { touched, error, warning } }) => {
  return (
    <div>
      <div className="input_holder">
        <input id={id} type={type} placeholder={label} {...input} />
        <label htmlFor={id}>{label}</label>
      </div>
      {touched && error && <span className="error error_msg">{error}</span>}
    </div>
  );
};

FormInput.propTypes = {
  id: PropTypes.string,
  input: PropTypes.object.isRequired,
  label: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  meta: PropTypes.object.isRequired,
  checked: PropTypes.bool,
};

FormInput.defaultProps = {
  checked: false,
};

export default FormInput;
