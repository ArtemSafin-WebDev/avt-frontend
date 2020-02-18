import { IDestination } from './IDestination';
import { SearchType } from './SearchType';
import { ISearchPage } from './ISearchPage';
import { IPrice, ISearchEntry } from './ISearchEntryHotel';
import { IFlightTariff } from './IFlightTariff';

export interface ISearchAction {
  type: string;
  payload?: {
    partialQuery?: string; // Used in auto-complete input
    targetInput?: string;  // Input name to be autocompleted
    type?: SearchType;
    date?: Date;

    searchParams?: ISearchPage;
    searchResults?: ISearchEntry[];
    responseId?: any;
    hotelResponseId?: any;
    entryIds?: any[];
    hotelId?: string;
    price?: IPrice;
    offset?: number

    destinations?: IDestination[];
    destination?: IDestination;
    departureCode?: string;
    arrivalCode?: string;

    tariff?: IFlightTariff;
    tariffs?: IFlightTariff[];

    property?: string;
    value?: any;
    ticket?: any;

    firstPatrtial?: boolean;

    message?: any;
  };
}
