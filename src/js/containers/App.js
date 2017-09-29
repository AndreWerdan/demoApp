import React, { Component } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import { NotificationContainer } from 'react-notifications';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import Client from '../containers/Client';
import Cms from '../containers/Cms';
import PrivateRoute from '../components/PrivateRoute';
import { getMenuInfo } from '../actions/menu';
import { checkAuth } from '../actions/authentication';

class App extends Component {

  componentWillMount() {
    const { getMenuInfoDispatcher } = this.props;

    this.props.checkAuth();
    getMenuInfoDispatcher();
  }

  render() {
    return (
      <div>
        <NotificationContainer />
        <Switch>
          <PrivateRoute path="/cms" component={Cms} />
          <Route path="/client" component={Client} />
          <Redirect to="/client" />
        </Switch>
      </div>
    );
  }
}

App.propTypes = {
  checkAuth: PropTypes.func.isRequired,
  getMenuInfoDispatcher: PropTypes.func.isRequired,
};

export default connect(null, {
  getMenuInfoDispatcher: getMenuInfo,
  checkAuth,
})(App);
