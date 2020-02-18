/**
 * Classification of search actions
 * Payload: information to proceed when action (event) triggered
 * Type: Class of action
 */
import { ISearchAction } from '../../../models/search/ISearchAction';
import { IDestination } from '../../../models/search/IDestination';
import { SearchType } from '../../../models/search/SearchType';
import { ISearchPage } from '../../../models/search/ISearchPage';
import { IPrice, ISearchEntry } from '../../../models/search/ISearchEntryHotel';
import { IFlightTariff } from '../../../models/search/IFlightTariff';

export class SearchActions {
  public static SELECT_NEW_TYPE: string = 'search/SELECT_NEW_TYPE';
  public static SELECT_DESTINATION: string = 'search/SELECT_DESTINATION';
  public static SELECT_DATE: string = 'search/SELECT_DATE';
  public static SELECT_FILTER: string = 'search/SELECT_FILTER';
  public static RUN_FILTER: string = 'search/RUN_FILTER';
  public static SELECT_RESPONSE_ID: string = 'search/SELECT_REQUEST_ID';
  public static SELECT_CURRENT_SEARCH_ENTRY: string = 'search/SELECT_CURRENT_SEARCH_ENTRY';
  public static SELECT_PASSENGER_PROPERTY: string = 'search/SELECT_PASSENGER_PROPERTY';

  public static SEARCH_DESTINATION_HINTS_REQUEST: string = 'search/SEARCH_DESTINATION_HINTS_REQUEST';
  public static SEARCH_DESTINATION_HINTS_SUCCESS: string = 'search/SEARCH_DESTINATION_HINTS_SUCCESS';
  public static SEARCH_DESTINATION_HINTS_FAILURE: string = 'search/SEARCH_DESTINATION_HINTS_FAILURE';

  public static SEARCH_RESPONSE_REQUEST: string = 'search/SEARCH_RESPONSE_REQUEST';
  public static SEARCH_RESPONSE_SUCCESS: string = 'search/SEARCH_RESPONSE_SUCCESS';
  public static SEARCH_RESPONSE_FAILURE: string = 'search/SEARCH_RESPONSE_FAILURE';

  public static SEARCH_RESULTS_REQUEST: string = 'search/SEARCH_RESULTS_REQUEST';
  public static SEARCH_RESULTS_SUCCESS: string = 'search/SEARCH_RESULTS_SUCCESS';
  public static SEARCH_RESULTS_FAILURE: string = 'search/SEARCH_RESULTS_FAILURE';

  public static SEARCH_PAGE_LOAD_REQUEST: string = 'search/SEARCH_PAGE_LOAD_REQUEST';
  public static SEARCH_PAGE_LOAD_PARTIAL_SUCCESS: string = 'search/SEARCH_PAGE_LOAD_PARTIAL_SUCCESS';
  public static SEARCH_PAGE_LOAD_SUCCESS: string = 'search/SEARCH_PAGE_LOAD_SUCCESS';
  public static SEARCH_PAGE_LOAD_FAILURE: string = 'search/SEARCH_PAGE_LOAD_FAILURE';

  public static ACTUALIZE_RATES_REQUEST: string = 'search/ACTUALIZE_RATES_REQUEST';
  public static ACTUALIZE_RATES_SUCCESS: string = 'search/ACTUALIZE_RATES_SUCCESS';
  public static ACTUALIZE_RATES_FAILURE: string = 'search/ACTUALIZE_RATES_FAILURE';

  public static GET_FLIGHT_TARIFFS_REQUEST: string = 'search/GET_FLIGHT_TARIFFS_REQUEST';
  public static GET_FLIGHT_TARIFFS_SUCCESS: string = 'search/GET_FLIGHT_TARIFFS_SUCCESS';
  public static GET_FLIGHT_TARIFFS_FAILURE: string = 'search/GET_FLIGHT_TARIFFS_FAILURE';

  public static SELECT_CURRENT_FLIGHT_TARIFF: string = 'search/SELECT_CURRENT_FLIGHT_TARIFF';

  public static SEARCH_CHECK_FAILURE: string = 'search/SEARCH_CHECK_FAILURE';

  public static changeCurrentType(newType: SearchType): ISearchAction {
    return {
      type: SearchActions.SELECT_NEW_TYPE,
      payload: {
        type: newType,
      },
    };
  }

  public static selectFilter(property: string, value: any): ISearchAction {
    return {
      type: SearchActions.SELECT_FILTER,
      payload: {
        property,
        value,
      },
    };
  }

  public static runFiltration(): ISearchAction {
    return {
      type: SearchActions.RUN_FILTER,
      payload: {},
    };
  }

  public static selectDestination(targetInput: string, destination: IDestination): ISearchAction {
    return {
      type: SearchActions.SELECT_DESTINATION,
      payload: {
        targetInput,
        destination,
      },
    };
  }

  public static selectDate(targetInput: string, date: Date): ISearchAction {
    console.log(targetInput, date && date.toString());
    return {
      type: SearchActions.SELECT_DATE,
      payload: {
        targetInput,
        date,
      },
    };
  }

  public static selectResponseId(responseId: any): ISearchAction {
    return {
      type: SearchActions.SELECT_RESPONSE_ID,
      payload: {
        responseId,
      },
    };
  }

  public static selectCurrentSearchEntry(ticket: any): ISearchAction {
    return {
      type: SearchActions.SELECT_CURRENT_SEARCH_ENTRY,
      payload: {
        ticket,
      },
    };
  }

  public static selectPassengerProperty(property: string, value: any): ISearchAction {
    return {
      type: SearchActions.SELECT_PASSENGER_PROPERTY,
      payload: {
        property,
        value,
      },
    };
  }

  public static destinationHintsRequest(targetInput: string, partialQuery: string): ISearchAction {
    return {
      type: SearchActions.SEARCH_DESTINATION_HINTS_REQUEST,
      payload: {
        targetInput,
        partialQuery,
      },
    };
  }

  public static destinationHintsSuccess(targetInput: string, destinations: IDestination[]): ISearchAction {
    return {
      type: SearchActions.SEARCH_DESTINATION_HINTS_SUCCESS,
      payload: {
        targetInput,
        destinations,
      },
    };
  }

  public static destinationHintsFailure(message: any): ISearchAction {
    return {
      type: SearchActions.SEARCH_DESTINATION_HINTS_FAILURE,
      payload: {
        message,
      },
    };
  }

  public static searchResponseRequest(searchParams: ISearchPage): ISearchAction {
    return {
      type: SearchActions.SEARCH_RESPONSE_REQUEST,
      payload: {
        searchParams,
      },
    };
  }

  public static searchResponseSuccess(responseId: any): ISearchAction {
    return {
      type: SearchActions.SEARCH_RESPONSE_SUCCESS,
      payload: {
        responseId,
      },
    };
  }

  public static searchResponseFailure(message: any): ISearchAction {
    return {
      type: SearchActions.SEARCH_RESPONSE_FAILURE,
      payload: {
        message,
      },
    };
  }

  public static searchResultsRequest(responseId: any): ISearchAction {
    return {
      type: SearchActions.SEARCH_RESULTS_REQUEST,
      payload: {
        responseId,
      },
    };
  }

  public static searchResultsSuccess(responseId: number): ISearchAction {
    return {
      type: SearchActions.SEARCH_RESULTS_SUCCESS,
      payload: {
        responseId,
      },
    };
  }

  public static searchResultsFailure(message: any): ISearchAction {
    return {
      type: SearchActions.SEARCH_RESULTS_FAILURE,
      payload: {
        message,
      },
    };
  }

  public static searchCheckFailure(message: any): ISearchAction {
    return {
      type: SearchActions.SEARCH_CHECK_FAILURE,
      payload: {
        message,
      },
    };
  }

  public static searchPageLoadRequest(entryIds: any[]): ISearchAction {
    return {
      type: SearchActions.SEARCH_PAGE_LOAD_REQUEST,
      payload: {
        entryIds,
      },
    };
  }

  public static searchPageLoadPartialSuccess(searchResults: ISearchEntry[],
                                             offset: number, type: SearchType,
                                             firstPatrtial: boolean): ISearchAction {
    return {
      type: SearchActions.SEARCH_PAGE_LOAD_PARTIAL_SUCCESS,
      payload: {
        searchResults,
        offset,
        type,
        firstPatrtial,
      },
    };
  }

  public static searchPageLoadSuccess(searchResults: ISearchEntry[],
                                      offset: number, type: SearchType,
                                      hotelResponseId?: string): ISearchAction {
    return {
      type: SearchActions.SEARCH_PAGE_LOAD_SUCCESS,
      payload: {
        searchResults,
        offset,
        type,
        hotelResponseId,
      },
    };
  }

  public static searchPageLoadFailure(message: any): ISearchAction {
    return {
      type: SearchActions.SEARCH_PAGE_LOAD_FAILURE,
      payload: {
        message,
      },
    };
  }

  public static actualizeRatesRequest(hotelId): ISearchAction {
    return {
      type: SearchActions.ACTUALIZE_RATES_REQUEST,
      payload: {
        hotelId,
      },
    };
  }

  public static actualizeRatesSuccess(price: IPrice): ISearchAction {
    return {
      type: SearchActions.ACTUALIZE_RATES_SUCCESS,
      payload: {
        price,
      },
    };
  }

  public static actualizeRatesFailure(message: any): ISearchAction {
    return {
      type: SearchActions.ACTUALIZE_RATES_FAILURE,
      payload: {
        message,
      },
    };
  }

  public static getFlightTariffsRequest(responseId): ISearchAction {
    return {
      type: SearchActions.GET_FLIGHT_TARIFFS_REQUEST,
      payload: {
        responseId,
      },
    };
  }

  public static getFlightTariffsSuccess(tariffs: IFlightTariff[]): ISearchAction {
    return {
      type: SearchActions.GET_FLIGHT_TARIFFS_SUCCESS,
      payload: {
        tariffs,
      },
    };
  }

  public static getFlightTariffsFailure(message: any): ISearchAction {
    return {
      type: SearchActions.GET_FLIGHT_TARIFFS_FAILURE,
      payload: {
        message,
      },
    };
  }

  public static selectCurrentTariff(tariff: IFlightTariff): ISearchAction {
    return {
      type: SearchActions.SELECT_CURRENT_FLIGHT_TARIFF,
      payload: {
        tariff,
      },
    };
  }
}
