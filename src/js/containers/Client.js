import React, { Component } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import { NotificationContainer } from 'react-notifications';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import Menu from '../components/Menu';
import Login from './Login';
import Industries from './Industries';
import Home from './Home';
import TellUsForm from './TellUsForm';
import ThankYou from './ThankYou';

class Client extends Component {
  render() {
    return (
      <div>
        <Menu />
        <section className="pages-container main-section">
          <Switch>
            <Route exact path="/client" component={Home} />
            <Route path="/client/industries/:id" render={(props) => {
              const { match: { params: { id } } } = props;
              return (<Industries id={id} />);
            }} />
            <Route path="/client/tellus" component={TellUsForm} />
            <Route path="/client/thankyou" component={ThankYou} />
            <Route path="/client/login" component={Login} />
            <Redirect to="/client" />
          </Switch>
        </section>
      </div>
    );
  }
}

export default Client;
