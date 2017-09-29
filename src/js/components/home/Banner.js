import React, { Component } from 'react';
import { goToAnchor } from 'react-scrollable-anchor';
import PropTypes from 'prop-types';

import Button from './Button';

const Banner = ({ banner, header, text, type, name, url, onClick }) => {
  const styles = {
    backgroundImage: `url(${banner})`,
  };

  return (
    <div className="banner" style={styles}>
      <div className="container">
        <h1>
          {header}
        </h1>
        <p>
          {text}
        </p>

        <Button
          type={type}
          name={name}
          url={url}
          className="icon-download download-btn main-btn"
          onClick={() => {
            onClick ? onClick({ download: true }) : goToAnchor('ourOfferings', true);
          }}
        />
      </div>
    </div>
  );
};

Banner.propTypes = {
  banner: PropTypes.string.isRequired,
  header: PropTypes.string.isRequired,
  text: PropTypes.string,
  type: PropTypes.string.isRequired,
  name: PropTypes.string,
  onClick: PropTypes.func,
};

Banner.defaultProps = {
  text: '',
  name: '',
};

export default Banner;
