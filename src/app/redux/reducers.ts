import { Reducer } from 'redux';
import { combineReducers } from 'redux-immutable';
import { userReducer } from './modules/users/reducers';
import { IStore } from './IStore';
import { Map } from 'immutable';
import { companyReducer } from './modules/companies/reducers';
import { reducer as notifications } from 'react-notification-system-redux';
import { LOCATION_CHANGE } from 'react-router-redux';
import { searchReducer } from './modules/search/reducers';
import { purchasingReducer } from './modules/purchasing/reducers';

const routerReducer = (state = initial, action) => {
  if (action.type === LOCATION_CHANGE) {
    return state.set('locationBeforeTransitions', action.payload);
  }

  return state;
};

const initial = Map({
  routing: routerReducer,
  user: userReducer,
  company: companyReducer,
  search: searchReducer,
  purchasing: purchasingReducer,
  notifications,
});

const rootReducer: Reducer<IStore> = combineReducers<IStore>({
  routing: routerReducer,
  user: userReducer,
  company: companyReducer,
  search: searchReducer,
  purchasing: purchasingReducer,
  notifications,
}, initial);

export default rootReducer;
