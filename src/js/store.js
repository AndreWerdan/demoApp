import { createBrowserHistory } from 'history';
import { routerReducer, routerMiddleware } from 'react-router-redux';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { createLogger } from 'redux-logger';
import { reducer as form } from 'redux-form';

import reducers from './reducers';

export default () => {
  const history = createBrowserHistory();
  const extendedReducers = Object.assign({}, reducers, {
    router: routerReducer,
    form,
  });
  const store = createStore(
    combineReducers(extendedReducers),
    applyMiddleware(
      thunkMiddleware.withExtraArgument(history),
      createLogger(),
      routerMiddleware(history),
    ),
  );

  return {
    history,
    store,
  };
};
