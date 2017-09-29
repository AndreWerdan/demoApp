import React, { Component } from 'react';
import PropTypes from 'prop-types';

const FeaturedCompanies = (props) => {
  const { header, featuredCompanies } = props;
  let images = (
    <span>Empty</span>
  );

  if (featuredCompanies.data.length) {
    images = featuredCompanies.data.map((item) => {
      return (
        <div className="image-container xs-3">
          <span className="company-name">{item.title}</span>
          <img className="featureCompaniesImg" src={item.url} alt={item.title} />
        </div>
      );
    });
  }
  return (
    <div className="featureCompany">
      <div className="container">
        <h2>
          { header }
        </h2>
        <div className="xs-8 xs-offset-2">
          <div className="row featureCompanyImgs">
            { images }
          </div>
        </div>
      </div>
    </div>
  );
};

FeaturedCompanies.propTypes = {
  header: PropTypes.string.isRequired,
  featuredCompanies: PropTypes.shape({
    data: PropTypes.arrayOf(PropTypes.shape({
      title: PropTypes.string,
      url: PropTypes.string,
    })),
    total: PropTypes.number,
  }),
};

FeaturedCompanies.defaultProps = {
  featuredCompanies: [],
};

export default FeaturedCompanies;
