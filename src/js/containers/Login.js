import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import { Redirect } from 'react-router-dom';
import InputComponent from '../components/FormInput';
import { login } from '../actions/authentication';

class Login extends React.Component {
  constructor(props) {
    super(props);

    this.handleFormSubmit = this.handleFormSubmit.bind(this);
  }

  handleFormSubmit({ email, password }) {
    this.props.login({ email, password });
  }

  render() {
    const { handleSubmit, valid, isAuthenticated, errorMessage, location } = this.props;

    if (isAuthenticated) {
      return (
        <Redirect to={location.state.from || '/cms'} />
      );
    }

    return (
      <div className="login-container">
        <div className="container">
          <h2>Welcome back!</h2>
          <p>Login with your account below to get started</p>
          <div className="login-form">
            <form onSubmit={handleSubmit(this.handleFormSubmit)}>

              <Field
                id="email"
                name="email"
                type="email"
                placeholder="Email"
                component={InputComponent}
              />

              <Field
                id="pass"
                name="password"
                type="password"
                placeholder="Password"
                component={InputComponent}
              />

              <button type="submit" className="main-btn" disabled={!valid}>
                <span>login</span>
              </button>
            </form>
            {errorMessage && <p className="error">{errorMessage}</p>}
          </div>
        </div>
      </div>
    );
  }
}

Login.propTypes = {
  location: PropTypes.object.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  login: PropTypes.func.isRequired,
  errorMessage: PropTypes.string,
  valid: PropTypes.bool.isRequired,
  isAuthenticated: PropTypes.bool.isRequired,
};

Login.defaultProps = {
  errorMessage: '',
};

function validate(formProps) {
  const errors = {};

  if (!formProps.email) {
    errors.email = 'Field is empty';
  } else {
    errors.email = !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(formProps.email) ? 'Invalid email address' : undefined;
  }

  if (!formProps.password) {
    errors.password = 'Field is empty';
  } else {
    errors.password = formProps.password.length < 5 ? 'Password is too short' : undefined;
  }

  return errors;
}

const LoginForm = reduxForm({
  form: 'LoginForm',
  validate,
})(Login);

function mapStateToProps(state) {
  return {
    errorMessage: state.auth.error,
    isAuthenticated: state.auth.authed,
  };
}

export default connect(mapStateToProps, { login })(LoginForm);
