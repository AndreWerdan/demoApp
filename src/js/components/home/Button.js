import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';

import BUTTON_TYPE from '../../constants/buttonType';

class Button extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }
  render() {
    let button;
    const { onClick, name, url, type, className, companyName } = this.props;

    switch (type) {
      case BUTTON_TYPE.arrowBtn: {
        button = (
          <button className="arrowBtn" onClick={onClick}>Our offerings</button>
        );
        break;
      }

      case BUTTON_TYPE.getReportsBtn: {
        button = (
          <button className="getReports main-btn" onClick={onClick}>
            <span>{name}</span>
          </button>
        );
        break;
      }

      case BUTTON_TYPE.goToForm: {
        button = (
          <button className={`goToForm ${className}`} onClick={onClick}>
            <span>{name}</span>
          </button>
        );
        break;
      }

      case BUTTON_TYPE.learnMoreBtn: {
        button = (
          <a className="learnMoreBtn main-btn" href={url} target="_blank" rel="noopener noreferrer">
            <span>Learn more</span>
          </a>
        );
        break;
      }

      case BUTTON_TYPE.link: {
        button = (<NavLink to={url} className="main-btn"><span>{name}</span></NavLink>);
        break;
      }

      case BUTTON_TYPE.download: {
        button = (
          <a href={url} download className="icon-download download-btn main-btn">
            <span>{name}</span>
          </a>
        );
        break;
      }

      case BUTTON_TYPE.save: {
        button = (
          <button className="saveBtn main-btn feature-btn" onClick={onClick}>
            <span>{name}</span>
          </button>
        );
        break;
      }

      case BUTTON_TYPE.edit: {
        button = (
          <button className="editBtn" onClick={onClick}>{name}</button>
        );
        break;
      }

      case BUTTON_TYPE.delete: {
        button = (
          <button className="deleteBtn" data-name={companyName} onClick={onClick}>{name}</button>
        );
        break;
      }

      default: {
        button = (
          <button className="learnMoreBtn">Learn more</button>
        );
      }
    }
    return (
      <div>
        { button }
      </div>
    );
  }
}

Button.propTypes = {
  type: PropTypes.string,
  name: PropTypes.string,
  onClick: PropTypes.func,
  url: PropTypes.string.isRequired,
  className: PropTypes.string,
  companyName: PropTypes.string,
};

Button.defaultProps = {
  type: BUTTON_TYPE.learnMoreBtn,
  name: '',
  onClick: () => {},
  className: '',
  companyName: '',
};

export default Button;
