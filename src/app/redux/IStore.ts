import { IUserState, UserStateRecord } from './modules/users/state';
import { CompanyStateRecord, ICompanyState } from './modules/companies/state';
import { NotificationsState } from 'react-notification-system-redux';
import { Map, Record } from 'immutable';
import { ISearchState, SearchStateRecord } from './modules/search/state';
import { IPurchasingState, PurchasingStateRecord } from './modules/purchasing/state';

export interface IStore extends Map<string, any> {
  user: IUserState;
  company: ICompanyState;
  notifications: NotificationsState;
  search: ISearchState;
  purchasing: IPurchasingState;
  router: Map<string, any>;
  locationBeforeTransitions?: any;
}

export const initialState = Record({
  routing: Map({}),
  user: UserStateRecord,
  company: CompanyStateRecord,
  search: SearchStateRecord,
  purchasing: PurchasingStateRecord,
  notifications: [],
});
