import { Store } from 'react-redux';
const appConfig = require('../../../config/main');
import { createStore, applyMiddleware, compose, Middleware } from 'redux';
import { routerMiddleware } from 'react-router-redux';
import thunk from 'redux-thunk';
import rootReducer from './reducers';
import { initialState as InitialStoreState, IStore } from './IStore';
import { createLogger } from 'redux-logger';

const state = new InitialStoreState() as IStore;
export function configureStore(history, initial = state): Store<IStore> {
  const middlewares: Middleware[] = [
    routerMiddleware(history),
    thunk,
  ];

  /** Add Only Dev. Middlewares */
  if (appConfig.env !== 'production' && process.env.BROWSER && typeof window !== 'undefined') {
    const logger = createLogger({
      collapsed: true,
    });
    middlewares.push(logger);
  }

  const composeEnhancers = (appConfig.env !== 'production' &&
    typeof window === 'object' &&
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose;

  const store: Store<IStore> = createStore<IStore>(rootReducer, initial, composeEnhancers(
    applyMiddleware(...middlewares),
  ));

  if (appConfig.env === 'development' && (module as any).hot) {
    (module as any).hot.accept('./reducers', () => {
      store.replaceReducer((require('./reducers')));
    });
  }

  return store;
}
