import { IStore } from '../../IStore';
import { createSelector } from 'reselect';
import { IPurchasingState } from './state';
import { IProduct } from '../../../models/purchasing/IProduct';

// Base product state
function getSearchState(state: IStore): IPurchasingState {
  return state.get('purchasing');
}

// ******************** Individual selectors ***************************
const fetchMessage = (state: IPurchasingState): string => {
  return state.get('message');
};

const fetchBasket = (state: IPurchasingState): IProduct[] => {
  return state.get('basket');
};

export const getMessage = createSelector(getSearchState, fetchMessage);
export const getBasket = createSelector(getSearchState, fetchBasket);
