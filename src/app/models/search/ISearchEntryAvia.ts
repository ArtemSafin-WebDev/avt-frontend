import { ISearchEntry } from './ISearchEntryHotel';
import { IFlightTariff } from './IFlightTariff';

export interface IOffer {
  min_price: number;
  segments: IFlight[];
  carrier_code: string;
  carrier_name: string;
  carrier_logo: string;
}
export interface ITicket extends ISearchEntry {
  firstDirection: IFlight;
  secondDirection?: IFlight;
  price: number;
  tariff?: IFlightTariff;
}

export const offerToTickets = (offer: IOffer, responseId: string, oneWay: boolean) => {
  const accumulator: ITicket[] = [];
  const sketch: ITicket = {
    id: offer.segments[0].buy_id,
    firstDirection: offer.segments[0],
    price: offer.min_price,
    responseId,
  };
  offer.segments.forEach((segment: IFlight) => {
    if (segment.dir_number !== 1) {
      accumulator.push({
        ...sketch, id: segment.buy_id, secondDirection: segment, responseId,
      });
    } else if (oneWay) {
      // One way search
      accumulator.push({
        // ...sketch, id: segment.segment_id, secondDirection: segment, responseId,
        ...sketch, id: segment.buy_id, firstDirection: segment, responseId,
      });
    }
  });
  return (accumulator.length === 0) ? [sketch] : accumulator;
};

export interface IFlight  {
  segment_id: string;
  buy_id: string;
  dir_number: number;
  flight_number: string;
  departure_airport: string;
  departure_timestamp: number;
  arrival_airport: string;
  arrival_timestamp: number;
  duration_formated: string;
  duration_minutes: number;
  stops: string;
  flights_info: IFlightsInfo[];
  services_available: boolean;
  tariff: string;
  class: string;
  price: number;
  price_details: IPriceDetail[];
  baggage: string;
  price_fare_family?: boolean;
  fare_type: string;
  fare_messages: IFareMessages;
  fare_family: string;
  sita_calculate: boolean;
  pcc_name: string;
  pcc_office: string;
  fee?: number;
  comm?: number;
}

export interface IFlightsInfo {
  operating_airline_code: string;
  operating_airline_name: string;
  operating_airline_logo: string;
  marketing_airline_code: string;
  marketing_airline_name: string;
  marketing_airline_logo: string;
  flight_number: string;
  flight_number_print: string;
  airplane_code: string;
  airplane_name: string;
  departure_country: string;
  departure_city: string;
  departure_airport: string;
  departure_terminal: string;
  departure_date: string;
  departure_local_time: string;
  departure_timezone: string;
  departure_local_timestamp: number;
  arrival_country: string;
  arrival_city: string;
  arrival_airport: string;
  arrival_terminal: string;
  arrival_date: string;
  arrival_local_time: string;
  arrival_timezone: string;
  arrival_local_timestamp: number;
  duration_formated: string;
  duration_minutes?: number;
  stop_time: string;
  stop_time_minutes?: number;
  ifs: any;
  delays?: any;
}

export interface IPriceDetail {
  type: string;
  qty: string;
  base: string;
  base_amount: number;
  tax: string;
  tax_amount: number;
  tax_dtl: any[];
  fee: string;
  fee_amount: number;
  single: string;
  single_amount: number;
  total: string;
  total_amount: number;
}

export interface IFareMessages {
  PEN: string;
  NRF: boolean;
  LTD: string;
  SUR: string;
}
