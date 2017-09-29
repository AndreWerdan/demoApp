import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Image from './home/Image';
import Button from './home/Button';

const AboutMyCompany = (props) => {
  const companyInfo = props.companyInfo;

  return (
    <div className="aboutMyCompany">
      <div className="container">
        <div className="row">
          <div className="xs-10 xs-offset-1 s-6 s-offset-0">
            <h2>
              About My Company
            </h2>
            <p>{companyInfo.name}</p>
            <p>{companyInfo.info}</p>
            <Button
              url={companyInfo.url}
              type="LEARN_MORE_BTN"
            />
          </div>

          <Image
            className="xs-10 xs-offset-1 s-6 s-offset-0"
            image={companyInfo.image}
          />
        </div>
      </div>
    </div>
  );
};

AboutMyCompany.propTypes = {
  companyInfo: PropTypes.shape({
    name: PropTypes.string.isRequired,
    info: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
  }).isRequired,
};

export default AboutMyCompany;
