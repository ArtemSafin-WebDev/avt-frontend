import { List, Map } from 'immutable';
export interface IUserBase extends Map<string, any> {
  username?: string;
  phone_number: string;

  first_name: string;
  last_name: string;
  middle_name: string;

  address?: {
    country: string;
    city: string;
    additional: string;
    zip: string;
  };

  position?: string;
  email?: string;
  company_id?: number;
  companyData?: {
    title?: string,
  };
}

export interface IUser extends IUserBase {
  id: number;
  gender?: string;
  legal_entities?: number[];
  bonus_cards?: IBonusCard[];
  documents?: IPassport[];
  age_type?: string;
  birth_date?: Date;

  preferences?: boolean;
  preference_position?: PositionType;
  preference_luggage?: boolean;
  preference_return_rate?: ReturnType;
  preference_food?: boolean;
  has_bonus_card?: boolean;

  is_superuser?: boolean;
  is_active?: boolean;
  is_admin?: boolean;

  last_login?: Date;
  date_joined?: Date;
}

export interface IPassenger extends IUser {
  preference_position: PositionType;
  preference_return_rate: ReturnType;
  preference_luggage: boolean;
  preference_food: boolean;
  has_bonus_card: boolean;
}

export interface IUserAction {
  type: string;
  payload?: {
    id?: number;
    user?: IUserBase;
    token?: string;
    message?: string;
    passport?: any;
    credentials?: {
      username: string;
      password?: string;
      verificationCode?: string;
    }
  };
}

export interface IPassport extends Map<string, any> {
  id?: number;
  user_id?: number;
  type?: PassportType;
  number?: string;
  validity?: string;
}

export interface IBonusCard {
  id?: number;
  airlines_id?: any;
  number?: string;
  user_id?: number;
}

export enum PassportType {
  FOREIGN_PASSPORT = 'FP',
  GENERAL_PASSPORT = 'GP',
}

export enum AgeType {
  ADULT = 'A',
  CHILD = 'C',
  INFANT = 'I',
}

export enum PositionType {
  STANDARD = 'standard',
  NEAR_EXIT = 'near_exit',
  EXTRA_SPACE_FOR_LEGS = 'extra_space',
  FIRST_SEATS = 'first_seats',
}

export enum ReturnType {
  RETURNABLE = 'returnable',
  IRRETURNABLE = 'irreturnable',
}
export const emptyPassenger = Map<string, any>({
  id: -1,
  gender: 'M',
  legal_entities: List([]),
  bonus_cards: List([]),
  documents: List([]),
  age_type: 'A',

  username: '',
  phone_number: '',

  first_name: '',
  last_name: '',
  middle_name: '',

  position: '',
  email: '',

  is_superuser: false,
  is_active: false,
  is_admin: false,

  preference_position: PositionType.STANDARD,
  preference_return_rate: ReturnType.RETURNABLE,
  preference_luggage: true,
  preference_food: true,
  has_bonus_card: false,
}) as IPassenger;
