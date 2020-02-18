import { IProduct, ProductType } from './IProduct';

export interface IPurchasingAction {
  type: string;
  payload?: {
    id?: number;
    type?: ProductType;
    product?: IProduct;
    products?: IProduct[];
    orders?: any[];

    message?: any;
  };
}
