import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { parse } from 'query-string';
import { compact } from 'lodash';

import { resetTellUsProps } from '../actions/tellus';
import AboutMyCompany from '../components/AboutMyCompany';
import Button from '../components/home/Button';

class ThankYou extends Component {

  componentDidMount() {
    this.props.resetTellUsPropsDispatcher({
      downFile: false,
    });
  }

  render() {
    const { location: { search }, industries, companyInfo, currentIndustryName } = this.props;
    const { industryId } = parse(search);
    const otherIndustries = industries.map((item) => {
      if (item.id !== industryId) {
        return (
          <Button url={`/client/industries/${item.id}`} type="LINK_BTN" name={item.name} />
        );
      }
    });
    return (
      <div>
        <div className="thankYouPageBanner">
          <div className="container">
            <h1>Thank You</h1>
            <span>We`ll be in touch soon about your interest in our {currentIndustryName} reports</span>
          </div>
        </div>
        <div className="reportPreview">
          <div className="container">
            <h2>Learn About Our Other Industries</h2>
            {otherIndustries}
          </div>
        </div>
        <div>
          <AboutMyCompany companyInfo={companyInfo} />
        </div>
      </div>
    );
  }
}
ThankYou.propTypes = {
  location: PropTypes.shape().isRequired,
  industries: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
  })).isRequired,
  companyInfo: PropTypes.shape({}).isRequired,
  currentIndustryName: PropTypes.string.isRequired,
  resetTellUsPropsDispatcher: PropTypes.func.isRequired,
};

function mapStateToProps(state) {
  return {
    industries: state.companyInfo.industries,
    companyInfo: state.companyInfo,
    currentIndustryName: state.industries.industryInfo.name,
  };
}

export default connect(mapStateToProps, {
  resetTellUsPropsDispatcher: resetTellUsProps,
})(ThankYou);
