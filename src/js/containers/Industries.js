import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import Banner from '../components/home/Banner';
import AvailableReports from '../components/industries/AvailableReports';
import FeaturedCompanies from '../components/industries/FeaturedCompanies';
import { getIndustriesById } from '../actions/industries';
import BUTTON_TYPE from '../constants/buttonType';
import { FEATURED_COMPANIES } from '../constants/staticText';
import { goToForm } from '../actions/tellus';

class Industries extends Component {
  constructor(props) {
    super(props);

    const { id } = this.props;
    this.props.getIndustriesByIdDispatcher(id);
  }

  componentWillReceiveProps(nextProps) {
    const { id } = nextProps;
    if (this.props.id !== nextProps.id) {
      this.props.getIndustriesByIdDispatcher(id);
    }
  }

  render() {
    const { industryInfo, goToFormDispatcher } = this.props;

    return (
      <div className="industries">
        <Banner
          banner={industryInfo.banner}
          header={industryInfo.name}
          type={BUTTON_TYPE.goToForm}
          url={industryInfo.pdfUrl}
          onClick={goToFormDispatcher}
          name={`Download ${industryInfo.name} Excerpt`}
        />
        <AvailableReports />
        <FeaturedCompanies
          header={FEATURED_COMPANIES.header}
          featuredCompanies={industryInfo.featuredCompanies}
        />
      </div>
    );
  }
}

Industries.propTypes = {
  industryInfo: PropTypes.shape().isRequired,
  getIndustriesByIdDispatcher: PropTypes.func.isRequired,
  goToFormDispatcher: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired,
};

function mapStateToProps(state) {
  return {
    industryInfo: state.industries.industryInfo,
  };
}

export default connect(mapStateToProps, {
  getIndustriesByIdDispatcher: getIndustriesById,
  goToFormDispatcher: goToForm,
})(Industries);
