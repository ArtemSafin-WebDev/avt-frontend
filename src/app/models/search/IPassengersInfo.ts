import { List, Map } from 'immutable';

export interface IPassengersInfo extends Map<string, any>  {
  adults: number;
  children: number;
  children_of_year?: number[];
  children_without_seats: number;
  businessClass: boolean;
}

export const PassengersInfoRecord = Map<string, any>({
  adults: 1,
  children: 0,
  children_of_year: List([]),
  children_without_seats: 0,
  businessClass: false,
});
