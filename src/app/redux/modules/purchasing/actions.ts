/**
 * Classification of purchasing actions
 * Payload: information to proceed when action (event) triggered
 * Type: Class of action
 */
import { IProduct } from '../../../models/purchasing/IProduct';
import { IPurchasingAction } from '../../../models/purchasing/IPurchasingAction';
import { IOrder } from '../../../models/purchasing/IOrder';

export class PurchasingActions {

  public static INITIALIZE_BASKET: string = 'search/INITIALIZE_BASKET';
  public static ADD_TO_BASKET: string = 'search/ADD_TO_BASKET';
  public static REMOVE_FROM_BASKET: string = 'search/REMOVE_FROM_BASKET';

  public static CREATE_ORDER_REQUEST: string = 'search/CREATE_ORDER_REQUEST';
  public static CREATE_ORDER_SUCCESS: string = 'search/CREATE_ORDER_SUCCESS';
  public static CREATE_ORDER_FAILURE: string = 'search/CREATE_ORDER_FAILURE';

  public static GET_ORDERS_REQUEST: string = 'search/GET_ORDERS_REQUEST';
  public static GET_ORDERS_SUCCESS: string = 'search/GET_ORDERS_SUCCESS';
  public static GET_ORDERS_FAILURE: string = 'search/GET_ORDERS_FAILURE';

  public static initBasket(products: IProduct[]): IPurchasingAction {
    return {
      type: PurchasingActions.INITIALIZE_BASKET,
      payload: {
        products,
      },
    };
  }

  public static addToBasket(product: IProduct): IPurchasingAction {
    return {
      type: PurchasingActions.ADD_TO_BASKET,
      payload: {
        product,
      },
    };
  }

  public static removeFromBasket(id: number): IPurchasingAction {
    return {
      type: PurchasingActions.REMOVE_FROM_BASKET,
      payload: {
        id,
      },
    };
  }

  public static createOrderRequest(products: IProduct[]): IPurchasingAction {
    return {
      type: PurchasingActions.CREATE_ORDER_REQUEST,
      payload: {
        products,
      },
    };
  }
  public static createOrderSuccess(): IPurchasingAction {
    return {
      type: PurchasingActions.CREATE_ORDER_SUCCESS,
    };
  }
  public static createOrderFailure(message: any): IPurchasingAction {
    return {
      type: PurchasingActions.CREATE_ORDER_FAILURE,
      payload: {
        message,
      },
    };
  }

  public static getOrderRequest(): IPurchasingAction {
    return {
      type: PurchasingActions.GET_ORDERS_REQUEST,
    };
  }
  public static getOrderSuccess(orders: IOrder[]): IPurchasingAction {
    return {
      type: PurchasingActions.GET_ORDERS_SUCCESS,
      payload: {
        orders,
      },
    };
  }
  public static getOrderFailure(message: any): IPurchasingAction {
    return {
      type: PurchasingActions.GET_ORDERS_FAILURE,
      payload: {
        message,
      },
    };
  }
}
