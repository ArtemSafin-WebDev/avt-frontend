import { fromJS, Iterable } from 'immutable';
import { ISearchState, SearchStateRecord } from './state';
import { ISearchAction } from '../../../models/search/ISearchAction';
import { SearchActions } from './actions';
import { ISearchPage } from '../../../models/search/ISearchPage';
import { SearchType } from '../../../models/search/SearchType';
import { IPassengersInfo } from '../../../models/search/IPassengersInfo';

export const initialState: ISearchState = SearchStateRecord as ISearchState;

export function searchReducer(state: ISearchState = initialState, action: ISearchAction): ISearchState {
  state = fromJS(state) as ISearchState;
  let updatedPage: ISearchPage;
  let param;
  let currentType: SearchType = state.get('currentType');
  if (action.payload && action.payload.targetInput) {
    if (action.payload.targetInput === 'hotelsNear') {
      currentType = SearchType.Hotel;
      param = 'departure_';
    } else  {
      if (action.payload.targetInput.startsWith('from')) {
        param = 'departure_';
      } else {
        param = 'arrival_';
      }
    }
  }
  switch (action.type) {
    /**
     * Select new tab of search box
     */
    case SearchActions.SELECT_NEW_TYPE:
      return state.merge({
        shouldBeUpdated: false,
        currentType: action.payload.type,
      }) as ISearchState;

    /**
     * User have selected a destination
     */
    case SearchActions.SELECT_DESTINATION:
      updatedPage = getProperties(state, currentType).set(param + 'point', action.payload.destination);
      return state.merge({
        shouldBeUpdated: false,
        pristine: !getProperties(state, currentType).get(param + 'point'),
        [currentType]: state.get(currentType).set('properties', updatedPage),
      }) as ISearchState;

    /**
     * User have selected a date of departure/arrival
     */
    case SearchActions.SELECT_DATE:
      const props = getProperties(state, currentType).set(param + 'date', action.payload.date);
      return state.merge({
        shouldBeUpdated: true,
        pristine: !props.get('arrival_date') && !props.get('departure_date'),
        [currentType]: state.get(currentType).set('properties', props),
      }) as ISearchState;

    /**
     * User have redirected to search page with some response id
     */
    case SearchActions.SELECT_RESPONSE_ID:
      return state.merge({
        shouldBeUpdated: false,
        responseId: action.payload.responseId,
      }) as ISearchState;

    /**
     * Optimization that allows not to filter on every select on a filter box
     */
    case SearchActions.SELECT_FILTER:
      return state.merge({
        shouldBeUpdated: true,
        pristine: true,
        filters: state.get('filters').update((filters) => filters.merge({
          pristine: false,
          [action.payload.property]: action.payload.value,
        })),
      }) as ISearchState;

    /**
     * Optimization that allows not to filter on every select on a filter box
     */
    case SearchActions.SELECT_CURRENT_SEARCH_ENTRY:
      return state.merge({
        shouldBeUpdated: false,
      }).set('selectedEntry', action.payload.ticket) as ISearchState;

    /**
     * Select new tab of search box
     */
    case SearchActions.RUN_FILTER:
      return state.merge({
        shouldBeUpdated: true,
        filters: state.get('filters').set('pristine', true),
      }) as ISearchState;

    /**
     * User have selected a date of departure/arrival
     */
    case SearchActions.SELECT_PASSENGER_PROPERTY:
      return state.merge({
        shouldBeUpdated: true,
        pristine: false,
        [currentType]: state.get(currentType)
          .update('passengers',
            (passengers: IPassengersInfo) => passengers.set(
              action.payload.property,
              action.payload.value,
            )),
      }) as ISearchState;

    /**
     * Request actions
     */
    case SearchActions.SEARCH_RESPONSE_REQUEST:
      return state.merge({
        shouldBeUpdated: true,
        loaded: false,
        partiallyLoaded: false,
        isFetching: true,
        pristine: true,
        error: false,
        results: state.get('results').set(currentType, []),
        message: '',
        filters: state.get('filters').set('pristine', true),
      }) as ISearchState;

    case SearchActions.SEARCH_RESULTS_REQUEST:
      return state.merge({
        shouldBeUpdated: false,
        loaded: false,
        isFetching: true,
      }) as ISearchState;

    /**
     * Search authentication actions
     */
    case SearchActions.SEARCH_DESTINATION_HINTS_SUCCESS:
      updatedPage = (action.payload.targetInput.startsWith('from'))
        ? getProperties(state, currentType).set('departure_point_hints', action.payload.destinations)
        : getProperties(state, currentType).set('arrival_point_hints', action.payload.destinations);
      return state.merge({
        shouldBeUpdated: false,
        [currentType]: state.get(currentType).set('properties', updatedPage),
      }) as ISearchState;

    /**
     * Add ids of page entries to be loaded next
     */
    case SearchActions.SEARCH_PAGE_LOAD_REQUEST:
      return state.merge({
        preloadedIds: action.payload.entryIds,
        isFetching: true,
      }) as ISearchState;

    case SearchActions.SEARCH_RESPONSE_SUCCESS:
      return state.set('responseId', action.payload.responseId) as ISearchState;

    case SearchActions.ACTUALIZE_RATES_SUCCESS:
      return state.set('selectedEntryPrice', action.payload.price) as ISearchState;

    case SearchActions.GET_FLIGHT_TARIFFS_SUCCESS:
      return state.set('tariffs', action.payload.tariffs) as ISearchState;

    case SearchActions.SELECT_CURRENT_FLIGHT_TARIFF:
      return state.merge({
        selectedEntry: {...state.get('selectedEntry')},
      }).update('selectedEntry', (entry) => {
        entry = entry.toJS();
        entry.tariff = action.payload.tariff;
        return entry;
      }) as ISearchState;

    case SearchActions.SEARCH_PAGE_LOAD_PARTIAL_SUCCESS:
      return state.merge({
        isFetching: true,
        loaded: false,
        partiallyLoaded: true,
        shouldBeUpdated: true,
        hotelResponseId: action.payload.hotelResponseId || state.get('hotelResponseId'),
        results: state.get('results').set(currentType, action.payload.searchResults),
        filters: state.get('filters').set('pristine', true),
      }) as ISearchState;

    case SearchActions.SEARCH_PAGE_LOAD_SUCCESS:
      currentType = action.payload.type;
      let prevResults = state.getIn(['results', currentType]);
      if (Iterable.isIterable(prevResults)) {
        prevResults = prevResults.toJS();
      }
      return state.merge({
        isFetching: false,
        pristine: true,
        loaded: true,
        shouldBeUpdated: true,
        hotelResponseId: action.payload.hotelResponseId || state.get('hotelResponseId'),
        results: (action.payload.offset > 0)
                  ? state.get('results').set(currentType, [...prevResults, ...action.payload.searchResults])
                  : state.get('results').set(currentType, action.payload.searchResults),
        filters: state.get('filters').set('pristine', true),
      }) as ISearchState;

    /**
     * Search request failure
     */
    case SearchActions.SEARCH_PAGE_LOAD_FAILURE:
    case SearchActions.SEARCH_CHECK_FAILURE:
    case SearchActions.SEARCH_DESTINATION_HINTS_FAILURE:
    case SearchActions.SEARCH_RESPONSE_FAILURE:
    case SearchActions.SEARCH_RESULTS_FAILURE:
      return state.merge({
        isFetching: false,
        message: action.payload.message,
        error: true,
      }) as ISearchState;

    default:
      return state;
  }
}

function getProperties(state: ISearchState, type: SearchType) {
  return state.get(type).get('properties');
}
