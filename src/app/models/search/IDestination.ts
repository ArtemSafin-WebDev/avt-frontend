import { Map } from 'immutable';

export interface IDestination extends Map<string, any>  {
  id: number;
  title: string;
  type: string;
  country: string;
  countryShort?: string;
  code?: any;
  children?: IDestination[];
}
