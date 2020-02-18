import { ILegalEntity } from './legalEntities';
import { IUser } from './users';
import { List, Map } from 'immutable';
export interface ICompany extends Map<string, any> {
  id: number;
  title: string;
  is_approved: boolean;
  is_reviewed: boolean;
  created_date: Date;
  legal_entities: List<ILegalEntity>;
  users: List<IUser>;
}

export enum CompaniesFilter {
  Waiting,
  Authorized,
  Declined,
}

export interface ICompanyAction {
  type: string;
  payload?: {
    company_id?: number;
    company?: ICompany;
    contact?: IUser;
    companies?: [ICompany];
    is_approved?: boolean;
    is_reviewed?: boolean;
    legalEntity?: ILegalEntity;
    changes?: {
      companyId?: number;
      contactId?: number;
      entityId?: number;
      param?: string;
      value?: any;
      legalEntity?: ILegalEntity;
    };
    deletes?: {
      companyId?: number;
      contactId?: number;
      entityId?: number;
    };
    message?: any;
  };
}
