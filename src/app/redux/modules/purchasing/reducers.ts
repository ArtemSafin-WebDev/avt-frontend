import { fromJS } from 'immutable';
import { IPurchasingState, PurchasingStateRecord } from './state';
import { IPurchasingAction } from '../../../models/purchasing/IPurchasingAction';
import { PurchasingActions } from './actions';
import { IProduct } from '../../../models/purchasing/IProduct';

export const initialState: IPurchasingState = PurchasingStateRecord as IPurchasingState;
export function purchasingReducer(state: IPurchasingState = initialState, action: IPurchasingAction): IPurchasingState {
  state = fromJS(state) as IPurchasingState;
  const payload = action.payload ? action.payload : null;
  let newBasket: IProduct[] = [];
  switch (action.type) {
    /**
     * Adds a new item to the cart of user
     */
    case PurchasingActions.INITIALIZE_BASKET:
      return state.set('basket', action.payload.products) as IPurchasingState;

    /**
     * Adds a new item to the cart of user
     */
    case PurchasingActions.ADD_TO_BASKET:
      newBasket = [...state.get('basket'), payload.product];
      localStorage.setItem('basket', JSON.stringify(newBasket));
      return state.set('basket', newBasket) as IPurchasingState;

    /**
     * Adds a new item to the cart of user
     */
    case PurchasingActions.REMOVE_FROM_BASKET:
      newBasket = state.get('basket').filter((product: IProduct) => product.id !== action.payload.id);
      localStorage.setItem('basket', JSON.stringify(newBasket));
      return state.set('basket', newBasket) as IPurchasingState;

    default:
      return state;
  }
}
