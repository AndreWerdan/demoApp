import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { NavLink, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import { logout } from '../actions/authentication';

const Menu = (props) => {
  const { menu: { industries, logo }, logout } = props;
  const industriesNavLink = industries.map(ind => (
    <li>
      <NavLink
        to={`/cms/industries/${ind.id}`}
      >
        {ind.name}
      </NavLink>
    </li>),
  );

  return (
    <header className="inner-resize">
      <div className="container">
        <div className="row middle-xs">
          <div className="logo m-3">
            <NavLink
              to="/client"
              activeClassName="active"
            >
              <img
                title="There will be some image"
                alt="MicroSite Logo"
                width="40px"
                src={logo}
              />
            </NavLink>
          </div>
          <nav className="header-menu-cms m-5 m-offset-4">
            <ul className="topUl">
              <li>
                <NavLink
                  to="/cms"
                  activeClassName="active"
                >
                  My company
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
                  to="/cms/leads/?p=1&c=25&f=%7B%7D&s=%7B%22createdAt%22%3A-1%7D"
                >
                  Leads
                </NavLink>
              </li>
              <li>
                <div onClick={logout}>Logout</div>
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

export default connect(mapStateToProps, { logout })(withRouter(Menu));
