import { Map } from 'immutable';
import { IDestination } from './IDestination';

export interface ISearchProperties extends Map<string, any> {
  // Дата отлета туда (дата заселения)
  departure_point: IDestination;
  departure_point_hints: IDestination[];

  // Дата отлета обратно (дата выселения)
  arrival_point: IDestination;
  arrival_point_hints: IDestination[];

  departure_date: Date;
  arrival_date: Date;
}

export const SearchPropertiesRecord = Map<string, any>({
  departure_point: null,
  arrival_point: null,
  departure_point_hints: [],
  arrival_point_hints: [],
  departure_date: null,
  arrival_date: null,
});
