import React, { Component } from 'react';
import { connect } from 'react-redux';
import Pagination from 'react-js-pagination';
import PropTypes from 'prop-types';
import { find } from 'lodash';

import INPUT_TYPE from '../constants/inputType';
import BUTTON_TYPE from '../constants/buttonType';
import { getIndustriesById, saveIndustry, saveFeaturedCompanies, deleteFeaturedCompany } from '../actions/industries';
import FileUploader from '../components/industryEdit/FileUploader';
import Button from '../components/home/Button';

class IndustryEdit extends Component {
  constructor(props) {
    const { id } = props;
    super(props);

    this.state = { title: '', imagePreviewUrl: '', featuredCompanies: {total: '', data: []}, previousTitle: '', error: '' };
    this.onSave = this.onSave.bind(this);
    this.onEdit = this.onEdit.bind(this);
    this.onDelete = this.onDelete.bind(this);

    props.getIndustriesById(id);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.id !== this.props.id) {
      this.props.getIndustriesById(nextProps.id);
    }
  }

  onSave(e) {
    const fileValue = this.fileValue.getValueFile();
    const imageValue = this.imageValue.getValueImage();
    const fileFeaturedCompany = this.fileFeaturedCompany.getFeaturedCompany();
    const { id } = this.props;
    let sendFormData = new FormData();
    const sendObject = {};
    let present;

    if (!imageValue && !fileValue) {
      if (!fileFeaturedCompany.title) {
        return this.setState({
          error: 'Please enter title',
        });
      }

      if (!fileFeaturedCompany.imagePreviewUrl) {
        return this.setState({
          error: 'Please upload image',
        });
      }

      sendObject.id = id;
      sendObject.title = fileFeaturedCompany.title;
      sendObject.previousTitle = this.state.previousTitle;

      present = find(this.state.featuredCompanies.data, (item) => {
        return item.title === this.state.previousTitle;
      });

      if (fileFeaturedCompany.file && !present) {
        sendFormData.append('url', fileFeaturedCompany.file);
        delete sendObject.title;
      }

      if (fileFeaturedCompany.file && present) {
        sendFormData.append('url', fileFeaturedCompany.file);
      }

      sendFormData.append('title', fileFeaturedCompany.title);

      sendObject.sendFormData = sendFormData;

      this.setState({
        imagePreviewUrl: '',
        title: '',
      });

      return this.props.saveFeaturedCompanies(sendObject);
    }

    if (imageValue) {
      sendFormData.append('banner', imageValue);
    }

    if (fileValue) {
      sendFormData.append('pdfUrl', fileValue);
    }

    this.props.saveIndustry(id, sendFormData);
  }

  onEdit(e) {
    e.preventDefault();

    const imagePreviewUrl = e.target.attributes.src.value;
    const title = e.target.attributes.name.value;

    this.setState({
      featuredCompanies: this.props.industryInfo.featuredCompanies,
      previousTitle: title,
      imagePreviewUrl,
      title,
    });
  }

  onDelete(e) {
    e.preventDefault();

    const companyName = e.target.attributes['data-name'].value;
    const { id } = this.props;

    this.props.deleteFeaturedCompany(id, companyName);
  }

  render() {
    const industryInfo = this.props.industryInfo;
    const { name, banner, pdfUrl, featuredCompanies: { data, total }, id } = industryInfo;
    const { title, imagePreviewUrl, error } = this.state;
    let $imagePreview;

    if (data.length) {
      $imagePreview = data.map((item) => {
        return (
          <div className="upload-file xs-6 feature-company">
            <span className="companyName like-label">{item.title}</span>
            <div className="image-container" src={item.url} name={item.title} onClick={e => this.onEdit(e)}>
              <img src={item.url} name={item.title} alt="NOIMAGE" />
            </div>
            <Button
              type={BUTTON_TYPE.delete}
              name="Delete"
              onClick={e => this.onDelete(e)}
              companyName={item.title}
            />
          </div>
        );
      });
    }

    return (
      <div className="industryEdit admin-panel">
        <div className="container">
          <h2>{`${name} information`}</h2>
          <div className="row">
            <div className="xs-6 upload-file">
              <FileUploader
                type={INPUT_TYPE.fileImage}
                label="Upload banner"
                id="banner"
                banner={banner}
                ref={(input) => (this.imageValue = input)}
              />
            </div>
            <div className="xs-6 upload-file">
              <FileUploader
                type={INPUT_TYPE.filePdf}
                label="Upload file pdf"
                id="pdf"
                url={pdfUrl}
                ref={(input) => (this.fileValue = input)}
              />
            </div>
          </div>

          <Button
            type={BUTTON_TYPE.save}
            name="Save"
            onClick={this.onSave}
          />

          <h2>Features companies images</h2>
          <div className="row">
            <div className="xs-6">
              <FileUploader
                type={INPUT_TYPE.fileFeaturedCompanies}
                label="Upload featured companies"
                id="featuredCompanies"
                ref={(input) => (this.fileFeaturedCompany = input)}
                title={title}
                imagePreviewUrl={imagePreviewUrl}
                error={error}
              />

              <Button
                type={BUTTON_TYPE.save}
                name="Save featured company"
                onClick={this.onSave}
              />
            </div>
            <div className="xs-6">
              <div className="row">
                { $imagePreview }
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

IndustryEdit.propTypes = {
  deleteFeaturedCompany: PropTypes.func.isRequired,
  saveFeaturedCompanies: PropTypes.func.isRequired,
  getIndustriesById: PropTypes.func.isRequired,
  saveIndustry: PropTypes.func.isRequired,
  industryInfo: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    banner: PropTypes.string,
    url: PropTypes.string,
    featuredCompanies: PropTypes.shape({
      data: PropTypes.arrayOf(PropTypes.shape({
        title: PropTypes.string,
        url: PropTypes.string,
      })),
      total: PropTypes.number,
    }),
  }).isRequired,
  id: PropTypes.string.isRequired,
};

IndustryEdit.defaultProps = {
  featuredCompanies: [],
};

function mapStateToProps(state) {
  return {
    industryInfo: state.industries.industryInfo,
  };
}

export default connect(mapStateToProps, { getIndustriesById, saveIndustry, saveFeaturedCompanies, deleteFeaturedCompany })(IndustryEdit);
