import React, { Component } from 'react';
import PropTypes from 'prop-types';

const Image = (props) => {
  const className = 'image-container';
  const image = (
    <div>
      <div className={className}>
        <img src={props.image} alt="reports" />
      </div>
      {props.text &&
      <span>{props.text}</span>
      }
    </div>
  );
  console.log(props.text + props.image);
  return (
    <div className={props.className}>
      { image }
    </div>
  );
};

Image.propTypes = {
  text: PropTypes.string,
  image: PropTypes.string.isRequired,
  className: PropTypes.string,
};

Image.defaultProps = {
  text: '',
  className: 'xs-3',
};

export default Image;
