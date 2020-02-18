import { AccommodationKind } from './ISearchFilters';

export interface ISearchEntry {
  id: any;
  label?: string;
  searchRating?: number;
  responseId?: string;
}
export interface IHotel extends ISearchEntry {
  address: string;
  amenities: IAmenity[];
  check_in_time: string;
  check_out_time: string;
  city: string;
  cityName: string;
  clean_address: string;
  country: string;
  country_code: string;
  description: string;
  description_short: string;
  email: string;
  hotelpage: string;
  id: string;
  images: IImage[];
  is_bookable_in_api: boolean;
  kind: AccommodationKind;
  latitude: number;
  longitude: number;
  low_rate: ILowRate;
  master_id: number;
  matching: IMatching;
  name: string;
  phone: string;
  policy_description: string;
  rating: IRating;
  region_id: number;
  room_groups: IRoom[];
  serp_filters: string[];
  star_rating: number;
  thumbnail: string;
  price?: IPrice;
  rate_price_min?: number;
  rates: IRate[];
  stars: number;
}

export interface IAmenity {
  amenities: string[];
  group_name: string;
  group_slug: string;
}

export interface IImage {
  height: number;
  orig_height: number;
  orig_url: string;
  orig_width: number;
  url: string;
  width: number;
}

export interface ILowRate {
  amount: string;
  currency: string;
  updated_at: Date;
}

export interface IMatching {
  HRS: number;
  Laterooms: number;
  HotelsPro: number;
  Ostrovok: number;
  Carsolize: number;
  ClickTripz: number;
  Booking: number;
  Expedia: number;
}

export interface IDetailed {
  cleanness: number;
  comfort: number;
  location: number;
  personnel: number;
  price: number;
  services: number;
}

export interface ICenter {
  lat: number;
  lng: number;
}

export interface IAuthorRegion {
  center: ICenter;
  country_code: string;
  country_en: string;
  country_ru: string;
  hotels_count: number;
  locative_in_en: string;
  locative_in_ru: string;
  locative_where_en: string;
  locative_where_ru: string;
  name_en: string;
  name_ru: string;
  official_languages: any[];
  parent_en: string;
  parent_ru: string;
  photos?: any;
  region_id: number;
  type: string;
}

export interface IReviewBest {
  author: string;
  author_region: IAuthorRegion;
  author_room: string;
  cleanness_rate: number;
  created: string;
  id: number;
  location_rate: number;
  price_rate: number;
  review_minus: string;
  review_plus: string;
  review_title: string;
}

export interface IRating {
  count: number;
  detailed: IDetailed;
  exists: boolean;
  other_reviews_count: number;
  our_reviews_count: number;
  review_best: IReviewBest;
  reviews_count: number;
  total: number;
  total_verbose: string;
}

export interface IImageList {
  height: number;
  src: string;
  src_secure: string;
  width: number;
}

export interface IRoom {
  amenities: IAmenity[];
  image_list_tmpl: IImageList[];
  name: string;
  room_group_id: number;
  description: string;
  name_struct: {
    bedding_type?: string;
    main_name: string;
  };
}

export interface IPenalty {
  amount: string;
  percent: string;
  currency_code: string;
  currency_rate_to_rub: string;
}

export interface IPolicy {
  start_at?: Date;
  end_at?: Date;
  penalty: IPenalty;
}

export interface ICancellationInfo {
  free_cancellation_before?: Date;
  policies: IPolicy[];
}

export interface ITax {
  trans_key: string;
  included_by_supplier: boolean;
  amount: string;
  currency_code: string;
}

export interface ITaxData {
  taxes: ITax[];
}

export interface IPaymentType {
  amount: string;
  by: string;
  currency_code: string;
  is_need_credit_card_data: boolean;
  is_need_cvc: boolean;
  type: string;
  vat_value: string;
  vat_included: boolean;
  tax_data: ITaxData;
}

export interface IPaymentOptions {
  payment_types: IPaymentType[];
}

export interface IValueAdd {
  code: string;
  description: string;
  title: string;
  uid: number;
}

export interface IBedPlaces {
  child_cot_count: number;
  extra_count: number;
  main_count: number;
  shared_with_children_count: number;
}

export interface IRate {
  availability_hash: string;
  bed_places: IBedPlaces;
  book_hash: string;
  cancellation_info: ICancellationInfo;
  daily_prices: string[];
  hotelpage: string;
  meal: string;
  images: any[];
  payment_options: IPaymentOptions;
  rate_currency: string;
  rate_price: string;
  bar_rate_price_data?: any;
  room_group_id: number;
  room_name: string;
  room_type_id: string;
  serp_filters: string[];
  value_adds: IValueAdd[];
}

export interface IPrice {
  id: string;
  rates: IRate[];
  bar_price_data?: any;
}

export const MealRates = {
  'all-inclusive': '<strong>Всё включено</strong>',
  'breakfast': '<strong>Завтрак включён</strong>',
  'breakfast-buffet': '<strong>Завтрак "шведский стол"</strong>',
  'continental-breakfast': '<strong>Континентальный завтрак</strong>',
  'dinner': '<strong>Ужин</strong>',
  'full-board': '<strong>Полный пансион</strong>',
  'half-board': '<strong>Полупансион</strong>',
  'lunch': '<strong>Обед</strong>',
  'nomeal': 'Питание не включено',
  'some-meal': '<strong>Питание включено</strong>',
};

export const PaymentTypes = {
  hotel: 'Оплата в отеле (при заезде)',
  now: 'Оплата в момент бронирования',
  deposit: 'Депозит',
};
