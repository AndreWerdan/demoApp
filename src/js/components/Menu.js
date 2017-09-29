import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { NavLink, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

const Menu = (props) => {
  const { menu: { industries, url, logo } } = props;
  const onClickBurger = (e) => {
    if (e.target.attributes.class.value !== 'burger') {
      e.target.setAttribute('class', 'burger');
    } else {
      e.target.setAttribute('class', 'burger burger-open');
    }
  };
  const industriesNavLink = industries.map(ind => (
    <li>
      <NavLink
        activeClassName="active"
        to={`/client/industries/${ind.id}`}
      >
        {ind.name}
      </NavLink>
    </li>),
  );

  return (
    <header className="inner-resize">
      <div className="container">
        <div className="row middle-xs">
          <div className="logo xs-6 xs-offset-1 m-2 l-3 l-offset-0">
            <a href={url}>
              <img
                title="There will be some image"
                alt="MicroSite Logo"
                src={logo}
                width="40px"
                height="40px"
              />
            </a>
          </div>
          <nav className="header-menu xs-5 m-6 m-offset-1 l-4 l-offset-5">
            <a href="javascript:;" className="burger" onClick={onClickBurger}>☰</a>
            <ul className="topUl">
              <li>
                <NavLink
                  activeClassName="active"
                  to="/client"
                >
                  Home
                </NavLink>
              </li>
              <li>
                <span>Industries</span>
                <ul>
                  {industriesNavLink}
                </ul>
              </li>
              <li>
                <NavLink
                  activeClassName="active"
                  to="/cms"
                >
                  Cms
                </NavLink>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
};

Menu.propTypes = {
  menu: PropTypes.shape({
    industries: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string,
      name: PropTypes.string,
    })),
  }).isRequired,
  logo: PropTypes.string.isRequired,
};

function mapStateToProps(state) {
  return {
    menu: state.menu,
  };
}

export default connect(mapStateToProps)(withRouter(Menu));
