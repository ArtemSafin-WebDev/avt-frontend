import { List, Map } from 'immutable';
import { SearchType } from '../../../models/search/SearchType';
import { IResults, ResultsRecord } from '../../../models/search/IResults';
import { ISearchPage, SearchPageRecord } from '../../../models/search/ISearchPage';
import { ISearchFilters, SearchFiltersRecord } from '../../../models/search/ISearchFilters';
import { IPrice, ISearchEntry } from '../../../models/search/ISearchEntryHotel';
import { IFlightTariff } from '../../../models/search/IFlightTariff';

export interface ISearchState extends Map<string, any> {
  avia: ISearchPage;
  train: ISearchPage;
  hotel: ISearchPage;

  responseId: any;
  hotelResponseId: string;

  currentType: SearchType;
  results: IResults;
  preloadedIds: List<any>;
  filters: ISearchFilters;
  selectedEntry: ISearchEntry;
  selectedEntryPrice: IPrice;
  tariffs: IFlightTariff[];
  shouldBeUpdated: boolean;
  pristine: boolean;
  loaded: boolean;
  partiallyLoaded: boolean;

  // Request data
  isFetching?: boolean;
  error?: boolean;
  message?: any;
}

export const SearchStateRecord = Map<string, any>({
  avia: SearchPageRecord,
  train: SearchPageRecord,
  hotel: SearchPageRecord,
  currentType: SearchType.Avia,
  results: ResultsRecord,
  filters: SearchFiltersRecord,
  selectedEntry: null,
  selectedEntryPrice: null,
  tariffs: [],
  shouldBeUpdated: false,
  pristine: true,
  loaded: false,
  partiallyLoaded: false,
  preloadedIds: List<any>([]),
  responseId: '',
  hotelResponseId: '',

  isFetching: false,
  error: false,
  message: {},
});
