import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import { parse } from 'query-string';
import { Redirect } from 'react-router-dom';
import InputComponent from '../components/FormInput';
import { sendForm, resetTellUsProps } from '../actions/tellus';

class TellUs extends Component {
  constructor(props) {
    super(props);

    this.handleSubmitForm = this.handleSubmitForm.bind(this);
  }

  componentDidMount() {
    this.props.resetTellUsPropsDispatcher({
      download: false,
      company: false,
      industry: false,
    });
  }

  handleSubmitForm(data) {
    window.open(this.props.pdfUrl);
    this.props.sendFormDispatcher({ ...data, industryId: this.props.industryId });
  }

  render() {
    const { location: { search }, type, valid, sendFormDispatcher, handleSubmit, tellus: { downFile }, industryId, name } = this.props;
    const { d: download, i: industry, c: company } = parse(search);
    let container = (<div className="container tellUsForm">
      <h2 className="form-header">Tell Us About Yourself</h2>
      <div className="xs-10 xs-offset-1 s-8 s-offset-2 form-container">
        <form
          onSubmit={handleSubmit((data) => {
            this.handleSubmitForm(data);
          })}
        >
          <div className="row">
            <div
              className="form-item xs-12 s-6"
            >
              <Field
                id="name"
                name="name"
                type="text"
                placeholder="Name"
                label="Name"
                component={InputComponent}
              />
            </div>
            <div
              className="form-item xs-12 s-6"
            >
              <Field
                id="email"
                name="email"
                type="email"
                placeholder="Email"
                label="Bussiness email"
                component={InputComponent}
              />
            </div>
          </div>
          <div className="row">
            <div
              className="form-item xs-12 s-6"
            >
              <Field
                id="company"
                name="companyName"
                type="text"
                placeholder="Company"
                label="Company"
                component={InputComponent}
              />
            </div>
            <div
              className="form-item xs-12 s-6"
            >
              <Field
                id="job"
                name="job"
                type="text"
                placeholder="Job title"
                label="Job title"
                component={InputComponent}
              />
            </div>
          </div>
          <div
            className="form-item checkbox-item"
          >
            <Field
              id="download"
              name="download"
              type="checkbox"
              label={`Download Excerpt Report (${name})`}
              checked={!!download}
              component={InputComponent}
            />
          </div>
          <div
            className="form-item checkbox-item"
          >
            <Field
              id="industry"
              name="industry"
              type="checkbox"
              label={`Tell me more about Industry Intelligence (${name})`}
              checked={!!industry}
              component={InputComponent}
            />
          </div>
          <div
            className="form-item checkbox-item"
          >
            <Field
              id="company_check"
              name="company"
              type="checkbox"
              label={`Tell me more about Company Intellignece (${name})`}
              checked={!!company}
              component={InputComponent}
            />
          </div>
          <div className="submit-item">
            <button className="main-btn" type="submit" disabled={!valid}>
              <span>Submit</span>
            </button>
          </div>
        </form>
      </div>
    </div>);

    if (downFile) {
      container = (
        <Redirect to={`/client/thankyou?industryId=${industryId}`} />
      );
    }

    return (
      <div>
        {container}
      </div>
    );
  }
}

TellUs.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  location: PropTypes.shape({}).isRequired,
  type: PropTypes.string,
  name: PropTypes.string,
  valid: PropTypes.bool.isRequired,
  sendFormDispatcher: PropTypes.func.isRequired,
  resetTellUsPropsDispatcher: PropTypes.func.isRequired,
  pdfUrl: PropTypes.string.isRequired,
  industryId: PropTypes.string.isRequired,
};

TellUs.defaultProps = {
  type: 'industries',
};

function validate(formProps) {
  const errors = {};

  if (!formProps.email) {
    errors.email = 'Field email is empty';
  } else {
    errors.email = !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(formProps.email) ? 'Invalid email address' : undefined;
  }

  if (!formProps.name) {
    errors.name = 'Field name is empty';
  }

  if (!formProps.companyName) {
    errors.companyName = 'Field company is empty';
  }

  if (!formProps.job) {
    errors.job = 'Field job is empty';
  }

  return errors;
}

const TellUsForm = reduxForm({
  form: 'LoginForm',
  validate,
})(TellUs);

export default connect(state => ({
  initialValues: state.tellus,
  tellus: state.tellus,
  pdfUrl: state.industries.industryInfo.pdfUrl,
  industryId: state.industries.industryInfo.id,
  name: state.industries.industryInfo.name,
}), {
  sendFormDispatcher: sendForm,
  resetTellUsPropsDispatcher: resetTellUsProps,
})(TellUsForm);
