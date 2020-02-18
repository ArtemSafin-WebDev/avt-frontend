import { IStore } from '../../IStore';
import { createSelector } from 'reselect';
import { ISearchState } from './state';
import {
  IMultiSelectItem,
  ISearchFilters,
  TicketChangesCriterion,
  TicketPriceSortingCriterion, TimeCriterion,
} from '../../../models/search/ISearchFilters';
import { IResults } from '../../../models/search/IResults';
import { IFlight, IFlightsInfo, ITicket } from '../../../models/search/ISearchEntryAvia';
import { IFlightTariff } from '../../../models/search/IFlightTariff';

// Base product state
function getSearchState(state: IStore): ISearchState {
  return state.get('search');
}

// ******************** Individual selectors ***************************
const fetchMessage = (state: ISearchState): string => {
  return state.get('message');
};

const fetchFilters = (state: ISearchState): ISearchFilters => {
  return state.get('filters');
};

const fetchResults = (state: ISearchState): IResults => {
  return state.get('results');
};

const fetchCurrentEntry = (state: ISearchState): IResults => {
  return state.get('selectedEntry');
};
const fetchTariffs = (state: ISearchState): IFlightTariff[] => {
  return state.get('tariffs');
};

const fetchCurrentEntryPrice = (state: ISearchState): IResults => {
  return state.get('selectedEntryPrice');
};

const isInTimeRange = (leg: IFlight, time: TimeCriterion): boolean => {
  if (leg && leg.flights_info) {
    const hour = Number.parseInt(leg.flights_info[0].departure_local_time.split(':')[0]);
    switch (time) {
      case TimeCriterion.ANY:
      default:
        return true;
      case TimeCriterion.NIGHT:
        return hour >= 0 && hour < 6;
      case TimeCriterion.MORNING:
        return hour >= 6 && hour < 12;
      case TimeCriterion.DAY:
        return hour >= 12 && hour < 18;
      case TimeCriterion.EVENING:
        return hour >= 18 && hour < 24;
    }
  }
  return false;
};

const fetchFilteredFlights = (results: IResults, filters: ISearchFilters): any => {
  let filtered = results.get('avia');
  const withoutChanges = filters.get('changes') === TicketChangesCriterion.WITHOUT_CHANGES;
  const timeChanged = filters.get('from_time') !== TimeCriterion.ANY
    || filters.get('to_time') !== TimeCriterion.ANY;

  if (withoutChanges || timeChanged) {
    filtered = filtered.filter((ticket: ITicket) => {
      let shouldDisplay = true;
      let stops = parseInt(ticket.firstDirection.stops, 10);
      if (ticket.secondDirection) {
        stops += Number(ticket.secondDirection.stops);
      }
      if (withoutChanges) { shouldDisplay = stops === 0; }
      if (timeChanged) {
        shouldDisplay = shouldDisplay && isInTimeRange(ticket.firstDirection, filters.get('from_time'));
        shouldDisplay = shouldDisplay && isInTimeRange(ticket.secondDirection, filters.get('to_time'));
      }
      return shouldDisplay;
    });
  }
  const airlines = filters.get('airlines')
    .filter((airline: IMultiSelectItem) => airline.selected)
    .map((airline: IMultiSelectItem) => airline.value).toJS();

  const airports = filters.get('airports')
    .filter((airline: IMultiSelectItem) => airline.selected)
    .map((airline: IMultiSelectItem) => airline.value).toJS();

  let minPrice = { id: -1, price: Infinity, index: -1 };
  let recommended = { id: -1, ratio: Infinity, index: -1 };
  let fastest = { id: -1, minutes: Infinity, index: -1 };
  if (airports.length > 0 && airlines.length > 0) {
    filtered = filtered.filter((ticket: ITicket, index: number) => {
      let res = true;
      let additionTime = 0;
      let additionStops = 0;
      ticket.firstDirection.flights_info.forEach((seg: IFlightsInfo) =>
        res = res && airlines.indexOf(seg.operating_airline_name) > -1
          && airports.indexOf(seg.arrival_airport) > -1 && airports.indexOf(seg.departure_airport) > -1);
      if (ticket.secondDirection) {
        ticket.secondDirection.flights_info.forEach((seg: IFlightsInfo) =>
          res = res && airlines.indexOf(seg.operating_airline_name) > -1
            && airports.indexOf(seg.arrival_airport) > -1 && airports.indexOf(seg.departure_airport) > -1);
        additionTime = ticket.secondDirection.duration_minutes;
        additionStops = Number(ticket.secondDirection.stops);
      }
      const minutesForPriceRatio = (ticket.firstDirection.duration_minutes + additionTime) * ticket.price;
      ticket.searchRating = minutesForPriceRatio / 100;
      ticket.searchRating *= 1 + ((Number(ticket.firstDirection.stops) + additionStops) / 10);
      if (ticket.firstDirection.baggage !== '0PC') {
        ticket.searchRating *= 0.75;
      }

      if (ticket.price < minPrice.price) { minPrice = { id: ticket.id, price: ticket.price, index}; }
      if (minutesForPriceRatio < recommended.ratio) {
        recommended = { id: ticket.id, ratio: minutesForPriceRatio, index };
      }
      if ((ticket.firstDirection.duration_minutes + additionTime) < fastest.minutes) {
        fastest = { id: ticket.id, minutes: (ticket.firstDirection.duration_minutes + additionTime), index };
      }
      ticket.label = '';
      return res;
    });
    addNewLabel(filtered, fastest.index, 'быстрый', 0.3);
    addNewLabel(filtered, minPrice.index, 'дешёвый', 0.1);
    addNewLabel(filtered, recommended.index, 'оптимальный', 0.2);
  } else {
    filtered = [];
  }
  if (filters.get('price') === TicketPriceSortingCriterion.DESC) {
    filtered = sortObj(filtered, 'price').reverse();
  } else if (filters.get('price') === TicketPriceSortingCriterion.RECOMMENDED) {
    filtered = sortObj(filtered, 'searchRating');
  } else {
    filtered = sortObj(filtered, 'price');
  }
  return filtered;
};

let currentLabel = '';
function addNewLabel(tickets: ITicket[], index: number, label: string,
                     correctionRatio = 0.9, firstPrefix = 'Самый ') {
  if (index > -1 && tickets[index]) {
    currentLabel = tickets[index].label;
    if (!currentLabel) {
      currentLabel = firstPrefix;
    } else {
      currentLabel = currentLabel.replace(' и ', ', ') + ' и ';
    }
    tickets[index].label = currentLabel + label;
    tickets[index].searchRating *= correctionRatio;
  }
}

export const sortObj = (list, key) => {
  function compare(a, b) {
    a = a[key];
    b = b[key];
    const type = (typeof(a) === 'string' || typeof(b) === 'string') ? 'string' : 'number';
    return (type === 'string') ? a.localeCompare(b) : a - b;
  }
  return list.sort(compare);
};

const fetchFilteredHotels = (results: IResults, _filters: ISearchFilters): any => {
  return results.get('hotel');
};

// *************************** PUBLIC API's ****************************
export const getFilteredFlights = createSelector(
  [ fetchResults, fetchFilters ],
  fetchFilteredFlights,
);
export const getFilteredHotels = createSelector(
  [ fetchResults, fetchFilters ],
  fetchFilteredHotels,
);

/*export const getFilteredFlights = (filters: ISearchFilters) => {
  return createSelector(
    getSearchState,
    fetchResults,
    fetchFilters,
    (state) => {
      return state.get(type).get('properties');
    },
  );
};*/

export const getMessage = createSelector(getSearchState, fetchMessage);
export const getFilters = createSelector(getSearchState, fetchFilters);
export const getCurrentEntry = createSelector(getSearchState, fetchCurrentEntry);
export const getTariffs = createSelector(getSearchState, fetchTariffs);
export const getCurrentEntryPrice = createSelector(getSearchState, fetchCurrentEntryPrice);
export const getPropertiesOfType = (type: string) => {
  return createSelector(
    getSearchState,
    (state) => {
      return state.get(type).get('properties');
    },
  );
};
export const getPassengersOfType = (type: string) => {
  return createSelector(
    getSearchState,
    (state) => {
      return state.get(type).get('passengers');
    },
  );
};
