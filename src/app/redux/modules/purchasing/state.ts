import { Map } from 'immutable';
import { IProduct } from '../../../models/purchasing/IProduct';

export interface IPurchasingState extends Map<string, any> {
  basket: IProduct[];
  // Request data
  isFetching?: boolean;
  error?: boolean;
  message?: any;
}
export const PurchasingStateRecord = Map<string, any>({
  basket: [],
  isFetching: false,
  error: false,
  message: {},
});
