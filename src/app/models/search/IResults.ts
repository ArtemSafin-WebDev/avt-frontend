import { Map } from 'immutable';
import { ISearchEntry } from './ISearchEntryHotel';

export interface IResults extends Map<string, any>  {
  avia: ISearchEntry[];
  train: ISearchEntry[];
  hotel: ISearchEntry[];
}

export const ResultsRecord = Map<string, any>({
  avia: [],
  train: [],
  hotel: [],
});
