import { IProduct, IProductValue, ProductType } from '../../../models/purchasing/IProduct';
import { PurchasingActions } from './actions';
import { sendNotification } from '../../../helpers/Notifications';
import { getHeaders, handleErrors } from '../../../helpers/HttpHelpers';
import { IUser, IUserBase } from '../../../models/users';
import { ILegalEntity } from '../../../models/legalEntities';
import { IOrder } from '../../../models/purchasing/IOrder';
import { Iterable } from 'immutable';
const config = require('../../../../../config/main');

export const addProduct = (basket: IProduct[], type: ProductType, value: IProductValue, note?: string) => {
  return (dispatch) => {
    const product: IProduct = {
      id: new Date().getTime(),
      type,
      value,
      note,
    };
    let found = false;
    basket.forEach((product) => {
      if (product.type === type) {
        if (value.id === product.value.id) {
          found = true;
        }
      }
    });
    if (!found) {
      dispatch(PurchasingActions.addToBasket(product));
      dispatch(sendNotification('Корзина обновлена', 'Товар успешно добавлен', 'success'));
    } else {
      dispatch(sendNotification('Невозможное действие', 'Выбраный вами товар уже есть в корзине!'));
    }
  };
};

export const immutableToJS = (obj: any) => {
  if (obj instanceof Array) {
    return obj.map((el) => (Iterable.isIterable(el)) ? el.toJS() : el);
  }
  return (Iterable.isIterable(obj)) ? obj.toJS() : obj;
};

export const createOrder = (
  basket: IProduct[],
  passengers: IUser[],
  legalEntities: ILegalEntity[],
  token: string,
  contactInfo?: IUserBase,
) => {
  return (dispatch) => {
    dispatch(PurchasingActions.createOrderRequest(basket));
    return fetch(
      `${config.apiEndpoint}/payment/order/`, {
        method: 'POST',
        headers: getHeaders(token),
        body: JSON.stringify({
          items: basket,
          passengers: immutableToJS(passengers),
          legal_entities: immutableToJS(legalEntities),
          contact_info: immutableToJS(contactInfo),
        }),
      }).then((res) => {
      if (res.ok) {
        return res.json()
          .then((res) => {
            if (res && res.success) {
              dispatch(PurchasingActions.initBasket([]));
              dispatch(PurchasingActions.createOrderSuccess());
              if (res.url) {
                let host = `${location.protocol}//${window.location.hostname}`;
                if (window.location.port) {
                  host += `:${window.location.port}`;
                }
                res.url += `&URL_RETURN_OK=${host}/payment/success`;
                res.url += `&URL_RETURN_NO=${host}/payment/failed`;
                return res.url;
              }
              return res.order_id;

            }
          }).catch((e) => console.warn(e));
      } else {
        return res.json().then((res) => {
          dispatch(PurchasingActions.createOrderFailure(res));
          handleErrors(res, dispatch);
          return res;
        }).catch((e) => console.warn(e));
      }
    }).catch((e) => console.warn(e));
  };
};

export const getOrders = (token: string) => {
  return (dispatch) => {
    dispatch(PurchasingActions.getOrderRequest());
    return fetch(
      `${config.apiEndpoint}/payment/orders/`, {
        method: 'get',
        headers: getHeaders(token),
      }).then((res) => {
      if (res.ok) {
        return res.json()
          .then((res: IOrder[]) => {
            dispatch(PurchasingActions.getOrderSuccess(res));
            return res;
          });
      }
    }).catch((e) => {
      dispatch(PurchasingActions.getOrderFailure('Could not get orders'));
      console.warn(e);
    });
  };
};
