import { List, Map } from 'immutable';
import { CompaniesFilter, ICompany } from '../../../models/companies';

export interface ICompanyState extends Map<string, any> {
  companyIds: List<number>;
  companyEntities: Map<number, ICompany>;
  selectedDocumentIds: List<number>;
  companyFilter: CompaniesFilter;
  userCompany: ICompany;

  // Request data
  isFetching?: boolean;
  error?: boolean;
  message?: Map<string, any>;
}
export const CompanyStateRecord = Map<string, any>({
  companyIds: List([]),
  companyEntities: Map({}),
  selectedDocumentIds: List([]),
  selectedTab: CompaniesFilter.Waiting,
  isFetching: true,
  message: Map({}),
  error: false,
});
