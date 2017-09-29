import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { NotificationManager } from 'react-notifications';
import { getCompanyInfo, editCompanyInfo } from '../actions/company';

class CompanyInfo extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.props.getCompanyInfo();
    this.state = {};

    this.onChange = this.onChange.bind(this);
    this.onFileChange = this.onFileChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const { companyInfo } = nextProps;
    const currentState = {
      name: companyInfo.name,
      info: companyInfo.info,
      introduction: companyInfo.introduction,
      url: companyInfo.url,
      logo: companyInfo.logo,
      image: companyInfo.image,
      logoFile: null,
      imageFile: null,
      nameError: '',
      infoError: '',
      urlError: '',
      introductionError: '',
    };

    this.currentState = currentState;
    this.setState(currentState);
  }

  onChange(e) {
    const value = e.target.value;
    const name = e.target.name;
    const changes = {};

    changes[name] = value;
    changes[`${name}Error`] = value ? '' : 'Field is empty';

    this.setState(changes);
  }

  onFileChange(e) {
    let FR;
    const [file] = e.target.files;
    const { name } = e.target;
    let changes = {};

    if (!file.size) {
      return;
    }

    if (file.type.indexOf('image') === -1) {
      return;
    }

    FR = new FileReader();
    FR.onload = () => {
      changes[name] = FR.result;
      changes[`${name}File`] = file;
      this.setState(changes);
    };

    FR.readAsDataURL(file);
  }

  handleSubmit() {
    const { name, info, introduction, url, logoFile, imageFile } = this.state;
    let sendFormData = new FormData();

    if (JSON.stringify(this.state) === JSON.stringify(this.currentState)){
      return NotificationManager.warning('Nothing to update');
    }

    sendFormData.append('name', name);
    sendFormData.append('info', info);
    sendFormData.append('introduction', introduction);
    sendFormData.append('url', url);

    if (logoFile) {
      sendFormData.append('logo', logoFile);
    }

    if (imageFile) {
      sendFormData.append('image', imageFile);
    }

    this.props.editCompanyInfo(sendFormData);
  }

  render() {
    const { state } = this;

    return (
      <div className="company-info admin-panel">
        <div className="container">
          <h2>My Company Info</h2>
          <div className="row">
            <div className="xs-6">
              <label htmlFor="name">Name:</label>
              <input
                onChange={this.onChange}
                type="text"
                id="name"
                name="name"
                value={state.name}
                placeholder="Name"
              />
              {state.nameError && <p className="error">{state.nameError}</p>}
            </div>

            <div className="xs-6">
              <label htmlFor="url">Url:</label>
              <input
                onChange={this.onChange}
                type="text"
                id="url"
                name="url"
                value={state.url}
                placeholder="Url"
              />
              {state.urlError && <p className="error">{state.urlError}</p>}
            </div>
          </div>

          <div className="row">
            <div className="xs-6">
              <label htmlFor="info">Info:</label>
              <textarea
                onChange={this.onChange}
                id="info"
                value={state.info}
                name="info"
              />

              {state.infoError && <p className="error">{state.infoError}</p>}
            </div>

            <div className="xs-6">
              <label htmlFor="introduction">Introduction Text:</label>
              <textarea
                onChange={this.onChange}
                id="introduction"
                value={state.introduction}
                name="introduction"
              />
              {state.introductionError && <p className="error">{state.introductionError}</p>}
            </div>
          </div>
          <div className="row">
            <div className="logo xs-6 upload-file">
              <label htmlFor="logo">Logo:</label>
              <div className="image-container">
                <img
                  id="logo"
                  src={state.logo || 'img/add_logo.png'}
                  alt="logo"
                />
              </div>

              <input
                onChange={this.onFileChange}
                type="file"
                accept=".png, .jpg"
                name="logo"
              />
            </div>

            <div className="image xs-6 upload-file">
              <label htmlFor="image">Image:</label>
              <div className="image-container">
                <img
                  id="image"
                  src={state.image || 'img/add_logo.png'}
                  alt="companyImage"
                />
              </div>

              <input
                onChange={this.onFileChange}
                type="file"
                accept=".png, .jpg"
                name="image"
              />
            </div>
          </div>

          <div className="btn_holder">
            <button
              className="main-btn"
              onClick={this.handleSubmit}
              disabled={!state.name || !state.url ||
              !state.info || !state.introduction ||
              !state.logo || !state.image}
            >
              <span>Save changes</span>
            </button>
          </div>
        </div>
      </div>
    );
  }
}

CompanyInfo.propTypes = {
  companyInfo: PropTypes.object.isRequired,
  getCompanyInfo: PropTypes.func.isRequired,
  editCompanyInfo: PropTypes.func.isRequired,
};

function mapStateToProps(state) {
  return {
    companyInfo: state.companyInfo,
  };
}

export default connect(mapStateToProps, { getCompanyInfo, editCompanyInfo })(CompanyInfo);
