export interface IPrice {
  fee_amount: number;
  comm_amount: number;
  total_amount: number;
  price_currency?: string;
  segments?: string;
}

export interface IService {
  name: string;
  status: string;
  status_name: string;
  is_bag: boolean;
}

export interface IFlightTariff {
  route: string;
  name: string;
  name_class: string;
  baggage: string;
  refund: string;
  is_refund: boolean;
  seat_choice: string;
  is_seat_choice: boolean;
  services: IService[];
  price?: IPrice;
}

export interface IFlightTariffMeta {
  components: IFlightTariff[];
  price: IPrice;
  segments: string;
}
