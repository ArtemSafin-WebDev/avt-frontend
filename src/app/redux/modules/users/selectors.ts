import { IStore } from '../../IStore';
import { createSelector } from 'reselect';
import { IUserState } from './state';
import { IUser } from '../../../models/users';

// Base product state
function  getUserState(state: IStore): IUserState {
  return state.get('user');
}

// ******************** Individual selectors ***************************
const fetchAuthStatus = (state: IUserState): boolean => {
  return state.get('isAuthenticated');
};

const fetchUserData = (state: IUserState): IUser => {
  return state.get('userData');
};

const fetchToken = (state: IUserState): string => {
  return state.get('token');
};

const fetchMessage = (state: IUserState): string => {
  return state.get('message');
};

// *************************** PUBLIC API's ****************************
export const getAuthStatus = createSelector(getUserState, fetchAuthStatus);
export const getUserData = createSelector(getUserState, fetchUserData);
export const getMessage = createSelector(getUserState, fetchMessage);
export const getToken = createSelector(getUserState, fetchToken);
