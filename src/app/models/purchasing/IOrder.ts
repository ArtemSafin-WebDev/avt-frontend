import { IProduct } from './IProduct';
import { IUser } from '../users';

export interface IOrder {
  amount: string;
  cart: {
    items: IProduct[];
    passengers: IUser[];
  };
  created_date: Date;
  id: number;
  status?: string;
  user_id: number;
}
