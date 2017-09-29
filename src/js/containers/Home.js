import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ScrollableAnchor from 'react-scrollable-anchor';
import { getCompanyInfo } from '../actions/company';

import Banner from '../components/home/Banner';
import Description from '../components/home/Description';
import OurOfferings from '../components/home/OurOfferings';
import ReportPreview from '../components/home/ReportPreview';
import AboutMyCompany from '../components/AboutMyCompany';
import { HOME_BANNER } from '../constants/staticText';
import BUTTON_TYPE from '../constants/buttonType';

class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {};

    props.getCompanyInfo();
  }

  render() {
    const companyInfo = this.props.companyInfo;

    return (
      <div className="home">
        <Banner
          banner={companyInfo.banner}
          header={HOME_BANNER.header}
          text={companyInfo.info}
          type={BUTTON_TYPE.arrowBtn}
        />
        <Description
          text={companyInfo.introduction}
        />
        <ScrollableAnchor id={'ourOfferings'}>
          <OurOfferings industries={companyInfo.industries} />
        </ScrollableAnchor>
        <ReportPreview />
        <AboutMyCompany companyInfo={companyInfo} />
      </div>
    );
  }
}

Home.propTypes = {
  getCompanyInfo: PropTypes.func.isRequired,
  companyInfo: PropTypes.shape().isRequired,
};

function mapStateToProps(state) {
  return {
    companyInfo: state.companyInfo,
  };
}

export default connect(mapStateToProps, { getCompanyInfo })(Home);
