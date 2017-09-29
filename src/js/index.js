import React from 'react';
import ReactDOM from 'react-dom';
import { Route, Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { initialize, set, pageview } from 'react-ga';

import { GA_TRACKING_ID } from './constants/ga';

import Store from './store';
import App from './containers/App';

const { store, history } = Store();

require('../scss/main.scss');

initialize(GA_TRACKING_ID);

function logPageView(location) {
  set({ page: location.pathname });
  pageview(location.pathname);
}

history.listen((location, action) => logPageView(location));

ReactDOM.render(
  <Provider store={store}>
    <Router history={history}>
      <Route path="/" component={App} />
    </Router>
  </Provider>
  , document.querySelector('.wrapper'));
