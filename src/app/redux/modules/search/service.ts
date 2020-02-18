import { getHeaders, handleErrors, queryParams } from '../../../helpers/HttpHelpers';
import { SearchActions } from './actions';
import { IDestination } from '../../../models/search/IDestination';
import { ISearchPage } from '../../../models/search/ISearchPage';
import { SearchType } from '../../../models/search/SearchType';
import { ISearchState } from './state';
import { ISearchProperties } from '../../../models/search/ISearchProperties';
import { IPassengersInfo } from '../../../models/search/IPassengersInfo';
import * as moment from 'moment';
import { fromJS, List } from 'immutable';
import { IHotel, IPrice } from '../../../models/search/ISearchEntryHotel';
import {
  IMultiSelectItem,
  ISearchFilters,
  SearchFiltersRecord,
} from '../../../models/search/ISearchFilters';
import { IFlight, IFlightsInfo, IOffer, ITicket, offerToTickets } from '../../../models/search/ISearchEntryAvia';
import { IFlightTariff, IFlightTariffMeta } from '../../../models/search/IFlightTariff';

const config = require('../../../../../config/main');

const convertDestination = (dest: any) => {
  dest.title = dest.name_ru ? dest.name_ru : dest.name;
  dest.country = dest.country_ru ? dest.country_ru : dest.country_code;
  return dest;
};

export const getDestinationHints = (
  targetInput: string,
  partialQuery: string,
  token,
  currentType: SearchType = SearchType.Avia,
  exclude = '') => {
  return (dispatch) => {
    dispatch(SearchActions.destinationHintsRequest(targetInput, partialQuery));
    return fetch(
      `${config.apiEndpoint}/search/${currentType}/search_hint/`
            + `?q=${partialQuery}${exclude ? `&exclude=${exclude}` : ''}`, {
        headers: getHeaders(token),
      }).then((res) => {
      if (res.ok) {
        return res.json()
          .then((res) => {
            switch (currentType) {
              case SearchType.Avia:
              default:
                return (res && res.data)
                  ? dispatch(SearchActions.destinationHintsSuccess(
                    targetInput,
                    (res.data.cities.length > 0) ? res.data.cities.splice(0, 5).map((dest) => {
                      dest = convertDestination(dest);
                      dest.children = dest.airports;
                      delete dest.airports;
                      if (dest.children.length === 1) {
                        dest.children = [];
                      } else {
                        dest.children = dest.children.map((d) => {
                          d = convertDestination(d);
                          return d;
                        });
                      }
                      return fromJS(dest) as IDestination;
                    }) : res.data.airports.splice(0, 8).map((dest) => {
                      return fromJS(convertDestination(dest)) as IDestination;
                    }),
                  ))
                  : dispatch(SearchActions.destinationHintsFailure(res));
              case SearchType.Hotel:
              case SearchType.Train:
                return (res && res.data)
                  ? dispatch(SearchActions.destinationHintsSuccess(
                    targetInput,
                    res.data.splice(0, 8).map((dest) => {
                      return fromJS(convertDestination(dest)) as IDestination;
                    }),
                  ))
                  : dispatch(SearchActions.destinationHintsFailure(res));
            }
          }).catch();
      } else {
        return res.json().then((res) => {
          dispatch(SearchActions.destinationHintsFailure(res));
          handleErrors(res);
          return res;
        }).catch();
      }
    }).catch();
  };
};

export const getHotelSearchResponse = (
  searchParams: ISearchPage,
  currentType: SearchType = SearchType.Avia) => {

  return (dispatch) => {
    dispatch(SearchActions.searchResponseRequest(searchParams));
    return fetch(
      `${config.apiEndpoint}/search/${currentType}/search/`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(
          formatHotelSearchRequest(
            searchParams.get('properties'),
            searchParams.get('passengers'),
          ),
        ),
      }).then((res) => {
      if (res.ok) {
        return res.json()
          .then((res) => (res && res.uid)
            ? dispatch(SearchActions.searchResponseSuccess(res.uid))
            : dispatch(SearchActions.searchResponseFailure(res))).catch();
      } else {
        return res.json().then((res) => {
          dispatch(SearchActions.searchResponseFailure(res));
          handleErrors(res);
          return res;
        }).catch();
      }
    }).catch();
  };
};

export const formatHotelSearchRequest = (properties: ISearchProperties, passengers: IPassengersInfo) => {
  // return {
  //   region_id: 2395,
  //   arrival_date: '2018-08-01',
  //   departure_date: '2018-08-07',
  //   adults: 1,
  //   children: 0,
  //   children_without_seats: 0,
  // };
  return {
    region_id: properties.get('departure_point').get('id'),
    checkin: moment(properties.get('departure_date')).format('YYYY-MM-DD'),
    checkout: properties.get('arrival_date')
                ? moment(properties.get('arrival_date')).format('YYYY-MM-DD')
                : moment(properties.get('departure_date')).add(1, 'days').format('YYYY-MM-DD'),
    adults: passengers.get('adults'),
    children: passengers.get('children_of_year'),
    // children_without_seats: passengers.get('children_of_year').count(),
  };
};

export const getAviaSearchResponse = (
  searchParams: ISearchPage,
  currentType: SearchType = SearchType.Avia,
  oneWay = false) => {

  return (dispatch) => {
    dispatch(SearchActions.searchResponseRequest(searchParams));
    return fetch(
      `${config.apiEndpoint}/search/${currentType}/search/`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(
          formatAviaSearchRequest(
            searchParams.get('properties'),
            searchParams.get('passengers'),
            oneWay,
          ),
        ),
      }).then((res) => {
      if (res.ok) {
        return res.json()
          .then((res) => (res && res.uid)
            ? dispatch(SearchActions.searchResponseSuccess(res.uid))
            : dispatch(SearchActions.searchResponseFailure(res)),
          );
      } else {
        return res.json().then((res) => {
          dispatch(SearchActions.searchResponseFailure(res));
          handleErrors(res);
          return res;
        });
      }
    }).catch();
  };
};

export const formatAviaSearchRequest = (properties: ISearchProperties, passengers: IPassengersInfo, oneWay = false) => {
  const obj = {
    directions: [ {
      departure_code: properties.get('departure_point').get('code'),
      date: moment(properties.get('departure_date')).format('YYYY-MM-DD'),
      arrival_code: properties.get('arrival_point').get('code'),
    } ],
    passengers: {
      adults: passengers.get('adults'),
      children: passengers.get('children'),
      infants: passengers.get('children_without_seats'),
    },
    class: passengers.get('businessClass') ? 'B' : 'E',
  };
  if (!oneWay) {
    const date = properties.get('arrival_date') || properties.get('departure_date');
    obj.directions.push({
      arrival_code: properties.get('departure_point').get('code'),
      departure_code: properties.get('arrival_point').get('code'),
      date: moment(date).format('YYYY-MM-DD'),
    });
  }
  return obj;
};

/**
 * Formats props of avia search to the format of MOW1404KZN1504-210e-XXXXXX
 * @type {string}
 */
export const formatAviaSearchRequestURL = (
  properties: ISearchProperties,
  passengers: IPassengersInfo,
  responseId?: number,
  oneWay = false) => {
  let url = '' + properties.get('departure_point').get('code')
    + moment(properties.get('departure_date')).format('DDMM')
    + properties.get('arrival_point').get('code');
  if (!oneWay) {
    const date = properties.get('arrival_date') || properties.get('departure_date');
    url += moment(date).format('DDMM');
  } else {
    url += '0000';
  }
  url += `-${passengers.get('adults')}`;
  url += `${passengers.get('children')}${passengers.get('children_without_seats')}`;
  url += (passengers.get('businessClass')) ? 'b' : 'e';
  if (responseId) {
    url += '-' + responseId;
  }
  return url;
};

/**
 * Formats props to the format of Лос-Анджелес-2307_2607_2_8,4_XXXXXXX
 * @type {string}
 */
export const formatHotelSearchRequestURL = (
  properties: ISearchProperties,
  passengers: IPassengersInfo,
  responseId?: any,
) => {
  if (properties && passengers) {
    const arrival = properties.get('arrival_date')
      ? moment(properties.get('arrival_date')).format('DDMM')
      : moment(properties.get('departure_date')).add(1, 'days').format('DDMM');
    let url = '' + properties.get('departure_point').get('title') + '-'
      + moment(properties.get('departure_date')).format('DDMM') + '_'
      + arrival + '_'
      + passengers.get('adults') + '_'
      + passengers.get('children_of_year').join(',');
    if (responseId) {
      url += '_' + responseId;
    }
    return url;
  } else {
    return '';
  }

};

export const validationMessages = {
  passengersOverflow: 'Количество пассажиров уже максимально!',
  unfilledFields: 'Выберите из выпадающего списка города и даты!',
};

export const checkValidity = (state: ISearchState) => {
  return (dispatch) => {
    let valid = true;
    const currentType = state.get('currentType');
    const currentPage = state.get(currentType);
    const properties = currentPage.get('properties');
    const passengers = currentPage.get('passengers');
    if (currentType === SearchType.Avia) {
      valid = passengers.get('adults') + passengers.get('children') + passengers.get('children_without_seats') < 10;
    } else if (currentType === SearchType.Hotel) {
      valid = (passengers.get('adults') <= 4) && (passengers.get('children_of_year').count() <= 4);
    }
    if (!valid) {
      dispatch(SearchActions.searchCheckFailure(validationMessages.passengersOverflow));
      handleErrors(validationMessages.passengersOverflow, dispatch);
    } else {
      if (currentType === SearchType.Avia) {
        valid = valid && properties.get('departure_point') && properties.get('arrival_point')
          && properties.get('departure_date');
      } else if (currentType === SearchType.Hotel) {
        valid = valid && properties.get('departure_point') && properties.get('departure_date');
      }
      if (!valid) {
        dispatch(SearchActions.searchCheckFailure(validationMessages.unfilledFields));
        handleErrors(validationMessages.unfilledFields, dispatch);
      }
    }
    return valid;
  };
};

const pickNecessarilyPropsForHotels = (filters: ISearchFilters) => {
  if (filters) {
    const f = filters.toJS();
    return {
      price: f.price,
      // payment: f.payment,
      services: (f.services.length > 0) ? f.services.join(',') : 'any',
      accommodation: (f.accommodation && f.accommodation.length === 12) ? 'any' : f.accommodation.join(','),
      stars: f.stars,
    };
  } else {
    return {}; // pickNecessarilyPropsForHotels(SearchFiltersRecord as ISearchFilters);
  }

};

export let airlinesList = [];

let gotResult = false;
let numberOfTries = 1;
let timeOut = null;
let firstPartial = true;
const clearProps = () => {
  clearTimeout(timeOut);
  numberOfTries = 0;
  gotResult = false;
  firstPartial = true;
};

export const getSearchResults = (responseId: any, currentType: SearchType,
                                 params: { offset?: number, limit?: number, filters?: ISearchFilters } = {
                                   offset: 0, limit: 15, filters: SearchFiltersRecord as ISearchFilters,
                                 }, newSearch = true, oneWay = false) => {
  return (dispatch) => {
    dispatch(SearchActions.searchResultsRequest(responseId));
    let suffix = '';
    if (currentType === SearchType.Hotel) {
      // tslint:disable-next-line
      suffix = `?${queryParams({ offset: params.offset, limit: params.limit, ...pickNecessarilyPropsForHotels(params.filters) })}`;
    }
    if (newSearch) { clearProps(); }
    if (typeof (window) !== 'undefined') {
      const currentLocation = window.location.href;
      if (!currentLocation.includes('avia')
        && !currentLocation.includes('hotel')) {
        return null;
      }
    }
    return fetch(
      `${config.apiEndpoint}/search/${currentType}/search_response/${responseId}/${suffix}`, {
        headers: getHeaders(),
      }).then((res) => {
      if (res.ok) {
        return res.json()
          .then((res) => {
            if (res && (res.status === 'PENDING' || res.status === 'RETRY')) {
              if (gotResult && numberOfTries === 0) {
                gotResult = false;
              }
              if (res.data && res.data.offers && res.data.offers.length > 0) {
                // Got partial result
                handleAviaResults(res, responseId, dispatch, true, oneWay);
                // To not transfer lots of data every second
                numberOfTries = 8;
              }
              if (!gotResult && numberOfTries < 20) {
                clearTimeout(timeOut);
                timeOut = setTimeout(() => {
                  dispatch(getSearchResults(responseId, currentType, params, false, oneWay));
                  numberOfTries++;
                }, numberOfTries * 1000);
              }
              if (numberOfTries >= 20) {
                clearProps();
              }
            } else if (res.success && res.status !== 'FAILURE') {
              if (currentType === SearchType.Hotel) {
                if (!res.data || res.data.length === 0) {
                  dispatch(SearchActions.searchPageLoadFailure('There is nothing to load'));
                } else {
                  dispatch(SearchActions.searchPageLoadSuccess(res.data, params.offset, SearchType.Hotel));
                }
                // dispatch(getHotelsDetails(res.data, params.offset));
              }
              if (currentType === SearchType.Avia && res.data && res.data.offers && res.data.offers.length > 0) {
                handleAviaResults(res, responseId, dispatch, false, oneWay);
              }
              numberOfTries = 0;
              gotResult = true;
              setTimeout(() => {
                gotResult = false;
              }, 5000);
            } else {
              dispatch(SearchActions.searchResultsFailure(
                `Failed after ${numberOfTries} tries with message ${JSON.stringify(res)}`));
            }
            return res;
          }).catch();
      } else {
        return res.json().then((res) => {
          if (!res || !res.data || !res.data.offers || res.data.offers.length === 0) {
            // We still haven't got a result
            dispatch(SearchActions.searchResultsFailure(res));
          }
          if (res && res.message) {
            handleErrors(res.message, dispatch);
          } else {
            handleErrors(res);
          }
          return res;
        }).catch();
      }
    }).catch();
  };
};

const handleAviaResults = (res, responseId, dispatch, partial: boolean, oneWay: boolean) => {
  const tickets = res.data.offers.reduce((accumulator, offer: IOffer) => {
    return accumulator.concat(offerToTickets(offer, responseId, oneWay));
  }, []);

  if (!partial || partial && firstPartial) {
    const airlinesMap = {};
    const airportsMap = {};
    airlinesList = res.data.offers.forEach((offer: IOffer) => {
      offer.segments.forEach((el: IFlight) => {
        el.flights_info.forEach((flight: IFlightsInfo) => {
          /* tslint:disable-next-line */
          airportsMap[ flight.departure_airport ] = `${flight.departure_airport}, г. ${flight.departure_city}`;
          airportsMap[ flight.arrival_airport ] = `${flight.arrival_airport}, г. ${flight.arrival_city}`;
          airlinesMap[ flight.operating_airline_name ] = true;
        });
      });
    });
    dispatch(SearchActions.selectFilter(
      'airlines',
      List(Object.keys(airlinesMap).map((airline) => {
        return {
          value: airline, text: airline, type: 'airline',
          selected: true,
        } as IMultiSelectItem;
      })),
    ));
    dispatch(SearchActions.selectFilter(
      'airports',
      List(Object.keys(airportsMap).map((airport) => {
        return {
          value: airport, text: airportsMap[ airport ], type: 'airport',
          selected: true,
        } as IMultiSelectItem;
      })),
    ));
  }
  if (partial) {
    dispatch(SearchActions.searchPageLoadPartialSuccess(tickets, 0,
      SearchType.Avia, firstPartial));
    firstPartial = false;
  } else {
    dispatch(SearchActions.searchPageLoadSuccess(tickets, 0,
      SearchType.Avia, res.data.hotel_task_id || ''));
  }
};

export const stopSearching = () => {
  clearProps();
};

export const getHotelDetails = (hotelID: string) => {
  return (dispatch) => {
    dispatch(SearchActions.searchPageLoadRequest([hotelID]));
    // console.log (hotelIds);
    return fetch(
      `${config.apiEndpoint}/search/hotel/detail/`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({
          ids: [hotelID],
        }),
      }).then((res) => {
      if (res.ok) {
        return res.json()
          .then((res) => {
            if (res && res.success) {
              dispatch(SearchActions.selectCurrentSearchEntry(res.data[0] as IHotel));
              return res.data[ 0 ];
            }
          }).catch();
      } else {
        return res.json().then((res) => {
          dispatch(SearchActions.searchPageLoadFailure(JSON.stringify(res)));
          handleErrors(res);
          return res;
        }).catch();
      }
    }).catch();
  };
};

export const actualizeRates = (hotelId: string, properties: ISearchProperties, passengers: IPassengersInfo) => {
  return (dispatch) => {
    dispatch(SearchActions.actualizeRatesRequest(hotelId));
    return fetch(
      `${config.apiEndpoint}/search/hotel/actualize_rates/`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({
          id: hotelId,
          checkin: moment(properties.get('departure_date')).format('YYYY-MM-DD'),
          checkout: properties.get('arrival_date')
                    ? moment(properties.get('arrival_date')).format('YYYY-MM-DD')
                    : moment(properties.get('departure_date')).add(1, 'days').format('YYYY-MM-DD'),
          adults: passengers.get('adults'),
          children: passengers.get('children_of_year'),
        }),
      }).then((res) => {
      if (res.ok) {
        return res.json()
          .then((res) => {
            if (res && res.success) {
              if (res.data.hotels && res.data.hotels.length === 1) {
                dispatch(SearchActions.actualizeRatesSuccess(res.data.hotels[ 0 ] as IPrice));
                return res.data.hotels[ 0 ];
              }
            }
          }).catch();
      } else {
        return res.json().then((res) => {
          dispatch(SearchActions.actualizeRatesFailure(JSON.stringify(res)));
          handleErrors(res);
          return res;
        }).catch();
      }
    }).catch();
  };
};

export const getAviaTicketDetails = (requestId: string, segmentId: any, oneWay: boolean) => {
  return (dispatch) => {
    dispatch(SearchActions.actualizeRatesRequest(segmentId));
    return fetch(
      `${config.apiEndpoint}/search/avia/search_response/${requestId}/${segmentId}/`, {
      // `${config.apiEndpoint}/search/avia/search_detail/${requestId}/${segmentId}/`, {
        method: 'GET',
        headers: getHeaders(),
      }).then((res) => {
      if (res.ok) {
        return res.json()
          .then((res) => {
            if (res && res.success) {
              if (res.data.offers) {
                let ticket: ITicket;
                res.data.offers.forEach((offer: IOffer) => {
                  offer.segments.forEach((el: IFlight) => {
                    if (el.buy_id === segmentId) {
                      ticket = {
                        id: el.buy_id,
                        firstDirection: offer.segments[ 0 ],
                        price: offer.min_price,
                        secondDirection: !oneWay ? el : null,
                        responseId: requestId,
                      };
                      dispatch(SearchActions.selectCurrentSearchEntry(ticket));
                    }
                  });
                });
                return ticket;
              } else {
                return res.data;
              }
            }
          }).catch((e) => console.error(e));
      } else {
        return res.json().then(() => {
          handleErrors({ 'Ошибка': 'Авиабилет не найден' }, dispatch);
        }).catch((e) => console.error(e));
      }
    }).catch((e) => console.error(e));
  };
};
export const getFlightTariffs = (segmentId: string) => {
  return (dispatch) => {
    dispatch(SearchActions.getFlightTariffsRequest(segmentId));
    return fetch(
      `${config.apiEndpoint}/search/avia/detail/${segmentId}/`, {
        method: 'GET',
        headers: getHeaders(),
      }).then((res) => {
      if (res.ok) {
        return res.json()
          .then((res) => {
            if (res && res.success) {
              if (res.data.fare_family) {
                const tariffs = [];
                res.data.fare_family.forEach((tariff: IFlightTariffMeta) => {
                  tariff.components.forEach((comp: IFlightTariff) => {
                    comp.price = tariff.price;
                    comp.price.price_currency = res.data.price_currency;
                    comp.price.segments = tariff.segments;
                    tariffs.push(comp);
                  });
                });
                dispatch(SearchActions.getFlightTariffsSuccess(tariffs));
                return tariffs;
              } else {
                return res.data;
              }
            }
          }).catch();
      } else {
        return res.json().then(() => {
          dispatch(SearchActions.getFlightTariffsFailure('Тарифы для этого билета не найдены'));
          handleErrors('Тарифы для этого билета не найдены', dispatch);
        }).catch();
      }
    }).catch();
  };
};
// tslint:disable-next-line
export const currencies = {"USD":"$","CAD":"$","EUR":"€","AED":"د.إ.‏","AFN":"؋","ALL":"Lek","AMD":"դր.","ARS":"$","AUD":"$","AZN":"ман.","BAM":"KM","BDT":"৳","BGN":"лв.","BHD":"د.ب.‏","BIF":"FBu","BND":"$","BOB":"Bs","BRL":"R$","BWP":"P","BYR":"BYR","BZD":"$","CDF":"FrCD","CHF":"CHF","CLP":"$","CNY":"CN¥","COP":"$","CRC":"₡","CVE":"CV$","CZK":"Kč","DJF":"Fdj","DKK":"kr","DOP":"RD$","DZD":"د.ج.‏","EEK":"kr","EGP":"ج.م.‏","ERN":"Nfk","ETB":"Br","GBP":"£","GEL":"GEL","GHS":"GH₵","GNF":"FG","GTQ":"Q","HKD":"$","HNL":"L","HRK":"kn","HUF":"Ft","IDR":"Rp","ILS":"₪","INR":"টকা","IQD":"د.ع.‏","IRR":"﷼","ISK":"kr","JMD":"$","JOD":"د.أ.‏","JPY":"￥","KES":"Ksh","KHR":"៛","KMF":"FC","KRW":"₩","KWD":"د.ك.‏","KZT":"тңг.","LBP":"ل.ل.‏","LKR":"SL Re","LTL":"Lt","LVL":"Ls","LYD":"د.ل.‏","MAD":"د.م.‏","MDL":"MDL","MGA":"MGA","MKD":"MKD","MMK":"K","MOP":"MOP$","MUR":"MURs","MXN":"$","MYR":"RM","MZN":"MTn","NAD":"N$","NGN":"₦","NIO":"C$","NOK":"kr","NPR":"नेरू","NZD":"$","OMR":"ر.ع.‏","PAB":"B/.","PEN":"S/.","PHP":"₱","PKR":"₨","PLN":"zł","PYG":"₲","QAR":"ر.ق.‏","RON":"RON","RSD":"дин.","RUB":"₽","RWF":"FR","SAR":"ر.س.‏","SDG":"SDG","SEK":"kr","SGD":"$","SOS":"Ssh","SYP":"ل.س.‏","THB":"฿","TND":"د.ت.‏","TOP":"T$","TRY":"TL","TTD":"$","TWD":"NT$","TZS":"TSh","UAH":"₴","UGX":"USh","UYU":"$","UZS":"UZS","VEF":"Bs.F.","VND":"₫","XAF":"FCFA","XOF":"CFA","YER":"ر.ي.‏","ZAR":"R","ZMK":"ZK"};
// tslint:disable-next-line
export const logosX25 = ['0A','6U','B2','DL','GE','JK','LZ','OL','RU','TW','WE','0B','7B','B5','DN','GF','JL','M3','OM','RV','TX','WF','0C','7C','B6','DP','GK','JM','M5','OR','RX','TY','WG','0D','7F','BA','DQ','GL','JN','M7','OS','RZ','TZ','WK','0J','7G','BB','DS','GM','JP','M8','OT','S0','U2','WS','0V','7K','BC','DT','GN','JQ','M9','OU','S2','U4','WT','1G','7M','BD','DU','GR','JR','MA','OV','S3','U5','WW','1I','7N','BE','DV','GS','JT','MB','OX','S4','U6','WX','1R','7R','BF','DW','GV','JU','MD','OY','S5','UA','WY','1S','7T','BG','DX','H2','JV','ME','OZ','S7','UD','WZ','1U','8E','BH','DY','H7','JW','MF','P6','SA','UG','X3','1Y','8H','BI','E0','HA','JY','MG','PA','SB','UH','X7','2A','8I','BK','E7','HD','JZ','MH','PC','SC','UL','X9','2B','8L','BL','E8','HG','K5','MI','PD','SE','UM','XC','2F','8M','BM','EI','HM','K6','MJ','PE','SG','UN','XF','2G','8P','BN','EK','HO','KA','MK','PF','SI','UO','XG','2L','8Q','BO','EL','HQ','KB','ML','PG','SJ','UP','XJ','2M','8T','BP','EN','HR','KC','MM','PI','SK','US','XK','2N','8U','BR','EP','HU','KE','MN','PJ','SL','UT','XL','2P','8V','BS','EQ','HV','KF','MO','PK','SM','UU','XM','3G','9C','BT','ET','HW','KI','MP','PM','SN','UX','XQ','3K','9K','BV','EV','HX','KK','MS','PO','SP','V2','XT','3L','9R','BW','EW','HY','KL','MT','PR','SQ','V3','XW','3O','9U','BX','EY','HZ','KM','MU','PS','SR','V4','Y0','3P','9V','BY','F3','I2','KN','MW','PU','SS','V7','Y4','3R','9W','C3','F7','I4','KP','MX','PW','ST','V8','Y5','3S','9Y','C4','F9','I5','KQ','MY','PX','SU','V9','YM','3T','A0','C7','FB','I9','KU','MZ','PY','SV','VA','YQ','3U','A2','CA','FC','IB','KV','N4','PZ','SW','VB','YT','3X','A3','CC','FD','ID','KX','N7','Q6','SX','VC','YV','4C','A4','CD','FI','IG','KZ','N9','QC','SY','VF','YW','4H','A5','CE','FJ','IK','L4','NA','QF','SZ','VG','Z2','4M','A9','CF','FL','IN','L9','NF','QH','T3','VH','Z6','4N','AA','CI','FM','IO','LA','NH','QI','T4','VJ','Z8','4O','AB','CJ','FN','IR','LC','NK','QJ','T5','VK','ZB','4R','AC','CL','FO','IT','LF','NL','QR','T7','VN','ZE','4T','AD','CM','FP','IW','LG','NN','QS','T9','VO','ZG','4U','AE','CO','FR','IX','LH','NO','QU','TC','VQ','ZH','4Y','AF','CX','FS','IY','LI','NT','QV','TF','VR','ZI','5C','AG','CY','FV','IZ','LJ','NU','QZ','TG','VS','ZK','5F','AH','CZ','FW','J2','LM','NW','R0','TJ','VT','ZL','5J','AI','D0','FY','J3','LN','NX','R2','TK','VV','ZV','5T','AK','D7','FZ','J4','LO','NY','R3','TM','VW','5W','AM','D8','G0','J9','LP','NZ','RB','TN','VX','5Y','AP','DA','G1','JA','LQ','O4','RC','TO','VY','5Z','AR','DC','G3','JC','LR','O6','RE','TP','VZ','6A','AS','DD','G4','JD','LS','O7','RG','TQ','W2','6E','AT','DE','G7','JE','LT','OA','RI','TR','W3','6J','AV','DG','G8','JF','LU','OB','RJ','TS','W5','6P','AY','DI','G9','JH','LX','OD','RL','TT','W6','6R','AZ','DJ','GA','JJ','LY','OK','RO','TU','WB'];
// tslint:disable-next-line
export const logosX50 = ['0A', '9K', 'EK', 'JM', 'OO', 'TS', '0B', '9L', 'EL', 'JN', 'OP', 'TT', '0C', '9M', 'EM*', 'JO', 'OR', 'TU', '0D', '9O', 'EM', 'JP', 'OS', 'TV', '0J', '9Q', 'EN', 'JQ', 'OT', 'TW', '0V', '9R', 'EO', 'JR', 'OU', 'TX', '1A', '9T', 'EP', 'JS', 'OV', 'TY', '1B', '9U', 'EQ', 'JT', 'OW', 'TZ', '1C', '9V', 'ER', 'JU', 'OX', 'U2', '1D', '9W', 'ES', 'JV', 'OY', 'U3', '1E', '9Y', 'ET', 'JW', 'OZ', 'U4', '1F', 'A0', 'EU', 'JX', 'P0', 'U5', '1G', 'A2', 'EV', 'JY', 'P3', 'U6', '1H', 'A3', 'EW', 'JZ', 'P5', 'U7', '1I', 'A4', 'EX', 'K2', 'P6', 'U8', '1K', 'A5', 'EY', 'K3', 'P7', 'UA', '1L', 'A6', 'EZ', 'K4', 'P8', 'UB', '1M', 'A7', 'F2', 'K5', 'P9', 'UC', '1N', 'A8', 'F3', 'K6', 'PA', 'UD', '1P', 'A9', 'F4', 'K8', 'PC', 'UE', '1Q', 'AA', 'F5', 'K9', 'PD', 'UF', '1R', 'AB', 'F6', 'KA', 'PE', 'UG', '1S', 'AC', 'F7', 'KB', 'PF', 'UH', '1T', 'AD', 'F9', 'KC', 'PG', 'UI', '1U', 'AE', 'FA', 'KD', 'PH', 'UL', '1Y', 'AF', 'FB', 'KE', 'PI', 'UM', '1Z', 'AG', 'FC', 'KF', 'PJ', 'UN', '2A', 'AH', 'FD', 'KG', 'PK', 'UO', '2B', 'AI', 'FE', 'KH', 'PL', 'UP', '2C', 'AJ', 'FF', 'KI', 'PM', 'UQ', '2D', 'AK', 'FG', 'KJ', 'PN', 'US', '2F', 'AL', 'FH', 'KK', 'PO', 'UT', '2G*', 'AM', 'FI', 'KL', 'PP', 'UU', '2G', 'AN', 'FJ', 'KM', 'PR', 'UX', '2H', 'AO', 'FK', 'KN', 'PS', 'UY', '2J', 'AP', 'FL', 'KO', 'PT', 'UZ', '2K', 'AQ', 'FM', 'KP', 'PU', 'V0', '2L', 'AR', 'FN', 'KQ', 'PV', 'V2', '2M', 'AS', 'FO', 'KR', 'PW', 'V3', '2N', 'AT', 'FP', 'KS', 'PX', 'V4', '2O', 'AU', 'FR', 'KU', 'PY', 'V5', '2P', 'AV', 'FS', 'KV', 'PZ', 'V7', '2Q', 'AW', 'FT', 'KW', 'Q2', 'V8', '2R', 'AX', 'FV', 'KX', 'Q3', 'V9', '2S', 'AY', 'FW', 'KY', 'Q4', 'VA', '2T', 'AZ', 'FX', 'KZ', 'Q5', 'VB', '2U', 'B2', 'FY', 'L1', 'Q6', 'VC', '2V*', 'B3', 'FZ', 'L2', 'Q8', 'VD', '2W', 'B4', 'G0', 'L3', 'Q9', 'VE', '2Z', 'B5', 'G1', 'L4', 'QB', 'VF', '3C', 'B6', 'G2', 'L5', 'QC', 'VG', '3G', 'B8', 'G3', 'L6', 'QD', 'VH', '3J', 'B9', 'G4', 'L7', 'QE', 'VI', '3K', 'BA', 'G5', 'L8', 'QF', 'VJ', '3L', 'BB', 'G6', 'L9', 'QH', 'VK', '3N', 'BC', 'G7', 'LA', 'QI', 'VL', '3O', 'BD', 'G8', 'LB', 'QJ', 'VM', '3P', 'BE', 'G9', 'LC', 'QK', 'VN', '3Q', 'BF', 'GA', 'LD', 'QL', 'VO', '3R', 'BG', 'GB', 'LF', 'QM', 'VP', '3S*', 'BH', 'GC', 'LG', 'QN', 'VQ', '3S', 'BI', 'GD', 'LH', 'QO', 'VR', '3T', 'BJ', 'GE', 'LI', 'QQ', 'VS', '3U', 'BK', 'GF', 'LJ', 'QR', 'VT', '3V', 'BL', 'GG', 'LK', 'QS', 'VU', '3W*', 'BM', 'GH', 'LL', 'QT', 'VV', '3W', 'BN', 'GI', 'LM', 'QU', 'VW', '3X', 'BO', 'GJ', 'LN', 'QV', 'VX', '4A', 'BP', 'GK', 'LO', 'QW', 'VY', '4C', 'BQ', 'GL', 'LP', 'QX', 'VZ', '4D', 'BR', 'GM', 'LQ', 'QY', 'W2', '4F', 'BS', 'GN', 'LR', 'QZ', 'W3', '4G*', 'BT', 'GO', 'LS', 'R0', 'W4', '4G', 'BU', 'GP', 'LT', 'R1', 'W5', '4H', 'BV', 'GQ', 'LU', 'R2', 'W6', '4K*', 'BW', 'GR', 'LV', 'R3', 'W7', '4M', 'BX', 'GS', 'LW', 'R5', 'W8', '4N', 'BY', 'GT', 'LX', 'R6', 'W9', '4O', 'BZ', 'GV', 'LY', 'R7', 'WA', '4R', 'C3', 'GW', 'LZ', 'R8', 'WB', '4S', 'C4', 'GX', 'LZ[30]', 'R9', 'WC', '4T', 'C5', 'GY', 'M2', 'RA', 'WD*', '4U', 'C6', 'GZ', 'M3', 'RB', 'WD', '4Y', 'C7', 'H1', 'M4', 'RC', 'WE', '5A', 'C8', 'H2', 'M5', 'RD', 'WF', '5C', 'C9', 'H4', 'M6', 'RE', 'WG', '5D', 'CA', 'H5', 'M7', 'RF', 'WH', '5F', 'CB*', 'H6', 'M8', 'RG', 'WK', '5G', 'CC', 'H7', 'M9', 'RH', 'WN', '5J', 'CD', 'H8', 'MA', 'RI', 'WO', '5K', 'CE', 'H9', 'MB', 'RJ', 'WR', '5L', 'CF', 'HA', 'MC', 'RK', 'WS', '5M', 'CG', 'HB', 'MD', 'RL', 'WT', '5N', 'CH', 'HC', 'ME', 'RO', 'WV', '5O', 'CI', 'HD', 'MF', 'RP*', 'WW', '5T', 'CJ', 'HE', 'MG', 'RQ', 'WX', '5V', 'CK', 'HF', 'MH', 'RR', 'WY', '5W', 'CL', 'HG', 'MI', 'RS', 'WZ', '5X', 'CM', 'HH', 'MJ', 'RU', 'X3', '5Y', 'CN', 'HJ', 'MK', 'RV*', 'X7', '5Z', 'CO', 'HK', 'ML', 'RV', 'X9', '6A', 'CP', 'HM', 'MM', 'RW', 'XC', '6B', 'CQ', 'HN', 'MN', 'RX', 'XF', '6E', 'CS', 'HO', 'MO', 'RZ', 'XG', '6G', 'CT', 'HP', 'MP', 'S0', 'XJ', '6H', 'CU', 'HQ', 'MQ', 'S2', 'XK', '6I', 'CV', 'HR', 'MR', 'S3', 'XL', '6J', 'CW', 'HT', 'MS', 'S4', 'XM', '6K', 'CX', 'HU', 'MT', 'S5', 'XN', '6N', 'CY', 'HV', 'MU', 'S6', 'XO', '6P', 'CZ', 'HW', 'MV', 'S7', 'XP', '6Q', 'D0', 'HX', 'MW', 'S8', 'XQ', '6R', 'D2', 'HY', 'MX', 'S9', 'XS', '6U', 'D3', 'HZ', 'MY', 'SA', 'XT', '6V', 'D4', 'I2', 'MZ', 'SB', 'XW', '6W', 'D5', 'I4', 'N2', 'SC', 'Y0', '6Y', 'D6', 'I5', 'N4', 'SD', 'Y2', '6Z', 'D7', 'I6', 'N5', 'SE', 'Y4', '7A', 'D8', 'I7', 'N6', 'SF', 'Y5', '7B', 'D9', 'I9*', 'N7', 'SG', 'Y6', '7C', 'DA', 'I9', 'N8', 'SH', 'Y8', '7E', 'DB', 'IA', 'N9', 'SI', 'Y9', '7F', 'DC', 'IB', 'NA', 'SJ', 'YB', '7G', 'DD', 'IC', 'NB', 'SK', 'YD', '7K', 'DE', 'ID', 'NC', 'SL', 'YE', '7L', 'DG', 'IE', 'NE', 'SM', 'YH', '7M', 'DH', 'IF', 'NF', 'SN', 'YK', '7N', 'DI', 'IG', 'NG', 'SO', 'YL', '7O', 'DJ', 'IH', 'NH', 'SP', 'YM', '7R', 'DK', 'II', 'NI', 'SQ', 'YQ', '7S', 'DL', 'IJ', 'NK', 'SR', 'YS', '7T', 'DM', 'IK', 'NL', 'SS', 'YT', '7W', 'DN', 'IM', 'NM', 'ST', 'YU', '8A', 'DO', 'IN', 'NN', 'SU', 'YV', '8B', 'DP', 'IO', 'NO', 'SV', 'YW', '8C', 'DQ', 'IP', 'NQ', 'SW', 'YX', '8D*', 'DS', 'IQ', 'NR', 'SX', 'Z2', '8D', 'DT', 'IR', 'NT', 'SY', 'Z3', '8E', 'DU', 'IT', 'NU', 'SZ', 'Z4', '8F', 'DV', 'IV', 'NV', 'T2', 'Z5', '8H', 'DW', 'IW', 'NW', 'T3', 'Z6', '8I', 'DX', 'IX', 'NX', 'T4', 'Z7*', '8J', 'DY', 'IY', 'NY', 'T5', 'Z8', '8L', 'E0', 'IZ', 'NZ', 'T6', 'ZA', '8M', 'E1', 'J2', 'O2', 'T7', 'ZB', '8N', 'E2', 'J3', 'O3', 'T9', 'ZE', '8O', 'E3', 'J4', 'O4', 'TC', 'ZG', '8P', 'E4', 'J6', 'O6', 'TD', 'ZH', '8Q*', 'E5', 'J7', 'O7', 'TE', 'ZI', '8Q', 'E6', 'J8', 'O8', 'TF', 'ZK', '8S', 'E7', 'J9', 'O9', 'TG', 'ZL', '8T', 'E8', 'JA', 'OA', 'TH', 'ZP', '8U', 'E9', 'JB', 'OB', 'TI', 'ZS', '8V', 'EA', 'JC', 'OD', 'TJ', 'ZT', '8W', 'EC', 'JD', 'OE', 'TK', 'ZU', '8W?', 'ED*', 'JE', 'OF', 'TL', 'ZV', '8Y', 'EE', 'JF', 'OH', 'TM', 'ZW', '8Z', 'EF', 'JH', 'OJ', 'TN', 'ZX', '9A', 'EG', 'JI', 'OK', 'TO', 'ZY', '9C', 'EH', 'JJ', 'OL', 'TP', '9E', 'EI', 'JK', 'OM', 'TQ', '9I', 'EJ', 'JL', 'ON', 'TR'];
