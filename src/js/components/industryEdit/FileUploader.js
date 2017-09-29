import React, { Component } from 'react';
import PropTypes from 'prop-types';

import INPUT_TYPE from '../../constants/inputType';
import icon from '../../../images/pdf.png';

class FileUploader extends Component {
  constructor(props) {
    super(props);

    this.state = { file: '', imagePreviewUrl: '', pdfFile: '', title: '', };
  }

  componentWillMount() {
    this.getValueImage = () => (!this.state.error ? this.state.file : null);
    this.getValueFile = () => (!this.state.error ? this.state.pdfFile : null);
    this.getFeaturedCompany = () => (!this.state.error ? { file: this.state.file, title: this.state.title, imagePreviewUrl: this.state.imagePreviewUrl } : null);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      imagePreviewUrl: nextProps.imagePreviewUrl,
      title: nextProps.title,
    });
  }

  handleTextChange(e) {
    e.preventDefault();

    const title = e.target.value;

    this.setState({
      title,
    });
  }

  handleImageChange(e) {
    e.preventDefault();

    const reader = new FileReader();
    const file = e.target.files[0];
    const idElement = e.target.id;

    reader.onloadend = () => {
      this.setState({
        file,
        imagePreviewUrl: reader.result,
        idElement,
      });
    };

    reader.readAsDataURL(file);
  }

  handleFileChange(e) {
    e.preventDefault();

    const reader = new FileReader();
    const pdfFile = e.target.files[0];

    reader.onloadend = () => {
      this.setState({
        imagePreviewUrl: icon,
        pdfFile,
      });
    };

    reader.readAsDataURL(pdfFile);
  }

  render() {
    let inputContainer;
    let $imagePreview = null;
    const { imagePreviewUrl, title, } = this.state;
    const { type, id, label, banner, error} = this.props;

    if (banner) {
      $imagePreview = (<div><img src={banner} alt="NOIMAGE" /></div>);
    }

    if (imagePreviewUrl) {
      $imagePreview = (
        <div className="image-container">
          <img src={imagePreviewUrl} alt="" />
          {title && <span className="companyName">{title}</span>}
        </div>
      );
    }

    switch (type) {
      case INPUT_TYPE.fileImage: {
        inputContainer = (
          <div className="upload-file">
            <label htmlFor={id}>{label}</label>
            <div className="image-container">
              {$imagePreview}
            </div>
            <input
              className="fileInput"
              onChange={e => this.handleImageChange(e)}
              type="file"
              id={id}
            />
          </div>
        );
        break;
      }

      case INPUT_TYPE.filePdf: {
        inputContainer = (
          <div className="upload-file">
            <label htmlFor={id}>{label}</label>

            <div className="image-container">
              {$imagePreview}
            </div>

            <input
              className="fileInput"
              onChange={e => this.handleFileChange(e)}
              type="file"
              id={id}
            />
          </div>
        );
        break;
      }

      case INPUT_TYPE.fileFeaturedCompanies: {
        inputContainer = (
          <div className="upload-file feature-images">
            <label htmlFor={id}>{label}</label>
            <input
              className="fileInput"
              onChange={e => this.handleImageChange(e)}
              type="file"
              id={id}
            />
            {error && <span>{error}</span>}

            <label htmlFor="companyName">Company Name</label>
            <input
              className="title"
              id="companyName"
              type="text"
              onChange={e => this.handleTextChange(e)}
              value={title}
            />
            {error && <span>{error}</span>}

            <div className="image-container">
              <img src={imagePreviewUrl} alt="Image" />
            </div>

          </div>
        );
        break;
      }

      default: {
        inputContainer = (
          <div className="upload-file">
            <label htmlFor={id}>{label}</label>
            <div className="image-container">
              {$imagePreview}
            </div>
            <input
              className="fileInput"
              id={id}
              onChange={e => this.handleTextChange(e)}
            />
          </div>
        );
      }
    }

    return (
      <div>
        {inputContainer}
      </div>
    );
  }
}

FileUploader.propTypes = {
  type: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  banner: PropTypes.string.isRequired,
  featuredCompaniesPreview: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string,
      url: PropTypes.string,
    }),
  ),
  url: PropTypes.string.isRequired,
  match: PropTypes.shape({}).isRequired,
  imagePreviewUrl: PropTypes.string,
  title: PropTypes.string,
};

FileUploader.defaultProps = {
  featuredCompaniesPreview: [],
  imagePreviewUrl: '',
  title: '',
};

export default FileUploader;

