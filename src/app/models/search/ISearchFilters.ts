import { List, Map } from 'immutable';

export interface ISearchFilters extends Map<string, any> {
  price: TicketPriceSortingCriterion;
  changes?: TicketChangesCriterion;
  from_time?: TimeCriterion;
  to_time?: TimeCriterion;
  payment?: PaymentCriterion;
  services?: ServicesCriterion[];
  accommodation?: AccommodationKind[];
  stars?: StarsCriterion;
  airports?: List<IMultiSelectItem>;
  airlines?: List<IMultiSelectItem>;
  pristine: boolean;
  isOneWay: boolean;
}

export enum TicketPriceSortingCriterion {
  RECOMMENDED = 'recommended',
  DESC = 'desc',
  ASC = 'asc',
}

export enum TicketChangesCriterion {
  WITH_CHANGES = 'with',
  WITHOUT_CHANGES = 'without',
}

export enum TimeCriterion {
  ANY = 'any',
  MORNING = 'morning',
  DAY = 'day',
  EVENING = 'evening',
  NIGHT = 'night',
}

export interface IMultiSelectItem {
  value: any;
  text: string;
  selected: boolean;
  type?: string;
}

export enum PaymentCriterion {
  ANY = '',
  AT_HOTEL = 'at_hotel',
  NOW = 'now',
  FREE_CANCELLING = 'free_cancelling',
}

export enum ServicesCriterion {
  FREE_INTERNET = 'has_internet',
  FREE_BREAKFAST = 'has_breakfast',
  TRANSFER = 'has_airport_transfer',
  BAR_RESTAURANT = 'has_meal',
  PARKING = 'has_parking',
  SWIMMING_POOL = 'has_pool',
  FITNESS = 'has_fitness',
  BATHROOM = 'has_bathroom',
  SPA = 'has_spa',
}

export enum AccommodationKind {
  HOTEL = 'Hotel',
  RESORT = 'Resort',
  MINIHOTEL = 'Mini-hotel',
  BOUTIQUE = 'Boutique_and_Design',
  GUEST_HOUSE = 'Guesthouse',
  HOSTEL = 'Hostel',
  SANATORIUM = 'Sanatorium',
  APARTMENT = 'Apartment',
  CAMPING = 'Camping',
  COTTAGE = 'Cottages_and_Houses',
  VILLAS_AND_BUNGALOWS = 'Villas_and_Bungalows',
  BNB = 'BNB',
}

export enum StarsCriterion {
  ANY = 'any',
  ONE   = 1,
  TWO   = 2,
  THREE = 3,
  FOUR  = 4,
  FIVE  = 5,
}

export const SearchFiltersRecord = Map<string, any>({
  price: TicketPriceSortingCriterion.RECOMMENDED,
  changes: TicketChangesCriterion.WITH_CHANGES,
  from_time: TimeCriterion.ANY,
  to_time: TimeCriterion.ANY,
  payment: List([
    PaymentCriterion.AT_HOTEL,
    PaymentCriterion.NOW,
    PaymentCriterion.FREE_CANCELLING,
  ]),
  services: List([
    // ServicesCriterion.FREE_INTERNET,
    // ServicesCriterion.FREE_BREAKFAST,
    // ServicesCriterion.TRANSFER,
    // ServicesCriterion.BAR_RESTAURANT,
    // ServicesCriterion.PARKING,
    // ServicesCriterion.SWIMMING_POOL,
    // ServicesCriterion.FITNESS,
    // ServicesCriterion.BATHROOM,
    // ServicesCriterion.SPA,
  ]),
  accommodation: List([
    AccommodationKind.HOTEL,
    AccommodationKind.RESORT,
    AccommodationKind.MINIHOTEL,
    AccommodationKind.BOUTIQUE,
    AccommodationKind.GUEST_HOUSE,
    AccommodationKind.HOSTEL,
    AccommodationKind.SANATORIUM,
    AccommodationKind.APARTMENT,
    AccommodationKind.CAMPING,
    AccommodationKind.COTTAGE,
    AccommodationKind.VILLAS_AND_BUNGALOWS,
    AccommodationKind.BNB,
  ]),
  stars: StarsCriterion.ANY,
  airports: List([]),
  airlines: List([]),
  pristine: true,
  isOneWay: false,
});
