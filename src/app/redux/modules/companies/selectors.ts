import { IStore } from '../../IStore';
import { createSelector } from 'reselect';
import { ICompanyState } from './state';
import { CompaniesFilter, ICompany } from '../../../models/companies';

// Base company state selector function
export function getCompanyState(state: IStore): ICompanyState {
  return state.get('company');
}

// ******************** Individual selectors ***************************
export function fetchCompanies(state: ICompanyState) {
  const documentEntities = state.get('companyEntities');
  const list: ICompany[] = [];
  if (documentEntities) {
    documentEntities.forEach((el) => {
      list.push(el);
    });
  }
  return list;
}

export function fetchCompanyFilter(state: ICompanyState) {
  return state.get('companyFilter');
}
export function fetchUserCompany(state: ICompanyState) {
  return state.get('userCompany');
}
export function fetchLoadingStatus(state: ICompanyState) {
  return state.get('isFetching');
}
export function fetchError(state: ICompanyState) {
  return state.get('error');
}
export function fetchMessages(state: ICompanyState) {
  return state.get('message');
}
// *************************** PUBLIC API's ****************************
export const getCompanies = createSelector(getCompanyState, fetchCompanies);
export const getUserCompany = createSelector(getCompanyState, fetchUserCompany);
export const getLoadingStatus = createSelector(getCompanyState, fetchLoadingStatus);
export const getError = createSelector(getCompanyState, fetchError);
export const getMessages = createSelector(getCompanyState, fetchMessages);

export const getFilteredCompanies = (filter: CompaniesFilter) => {
  return createSelector(
    getCompanies,
    (companies) => {
      if (companies) {
        switch (filter) {
          case CompaniesFilter.Waiting:
            return companies.filter((t) => !t.get('is_approved') && !t.get('is_reviewed'));
          case CompaniesFilter.Authorized:
            return companies.filter((t) => t.get('is_approved'));
          case CompaniesFilter.Declined:
            return companies.filter((t) => !t.get('is_approved') && t.get('is_reviewed'));

          default:
            return companies;
        }
      } else {
        return [];
      }
    },
  );
};
