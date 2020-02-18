import { Map } from 'immutable';
import { IPassengersInfo, PassengersInfoRecord } from './IPassengersInfo';
import { ISearchProperties, SearchPropertiesRecord } from './ISearchProperties';

export interface ISearchPage extends Map<string, any> {
  properties: ISearchProperties;
  passengers: IPassengersInfo;
}

export const SearchPageRecord = Map<string, any>({
  properties: SearchPropertiesRecord,
  passengers: PassengersInfoRecord,
});
