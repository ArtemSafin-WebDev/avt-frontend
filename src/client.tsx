import * as e6p from 'es6-promise';
(e6p as any).polyfill();
import 'isomorphic-fetch';
/*tslint:disable-next-line*/
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
const { Router, browserHistory } = require('react-router');
import { configureStore } from './app/redux/store';
import 'isomorphic-fetch';
import routes from './app/routes';
import { syncHistoryWithStore } from 'react-router-redux';
import { IStore } from './app/redux/IStore';
import { fromJS } from 'immutable';

const initialState = fromJS(window.__INITIAL_STATE__).set('notifications', []) as IStore;
// const initialState = window.__INITIAL_STATE__;
const store = configureStore(
  browserHistory,
  initialState,
);
declare var Raven: any;

if (process.env.NODE_ENV === 'production') {
  Raven.config('https://010023ea74eb43a496fee2fee800c4ac@sentry.uvee.ru/34').install();
}

const createSelectLocationState = () => {
  let prevRoutingState;
  let prevRoutingStateJS;
  return (state) => {
    const routingState = state.get('routing');
    if (typeof prevRoutingState === 'undefined' || !prevRoutingState.equals(routingState)) {
      if (routingState) {
        prevRoutingState = routingState;
        prevRoutingStateJS = routingState.toJS();
      }
    }
    return prevRoutingStateJS;
  };
};

export const history = syncHistoryWithStore(browserHistory, store, {
  selectLocationState: createSelectLocationState(),
});

let render = (routerKey = null) => {
  ReactDOM.hydrate(
    <Provider store={store} key="provider">
      <Router
        history={history}
        state={store.getState()}
        key={routerKey}
      >
        {routes}
      </Router>
    </Provider>,
    document.getElementById('app'),
  );
};
render(Math.random());

if ((module as any).hot) {
  console.log('HOT');
  const renderApp = render;
  render = () => {
    try {
      renderApp(Math.random());
    } catch (error) {
      console.error(error);
    }
  };
  (module as any).hot.accept(['./app/routes'], () => render());

}
