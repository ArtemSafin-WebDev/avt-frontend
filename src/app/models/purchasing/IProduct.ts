import { IPassengersInfo } from '../search/IPassengersInfo';

export interface IProduct {
  id?: number;
  type: ProductType;
  value: IProductValue;
  note?: string;
}

export enum ProductType {
  TICKET_AVIA = 'ticket_avia',
  TICKET_RAILWAY = 'ticket_railway',
  HOTEL_RESERVATION = 'hotel_reservation',
  EXTRA_ITEM = 'extra_item',
}

export interface IProductValue {
  id?: any;
  book_hash?: string;
  hotel_id?: string;
  room_name?: string;
  name?: string;
  departure_date?: Date;
  arrival_date?: Date;
  price: number;
  directions?: IDirection[];
  passengers?: IPassengersInfo;
  expiration?: Date;
  link?: string;
  tariff?: string;
  responseId?: string;
}

export interface IDirection {
  id: any;
  title: string;
  titleExtended: string;
  dates: string;
}
