import { ICompany } from './companies';
import { Map } from 'immutable';
import { IUser } from './users';

export interface ILegalEntity extends Map<string, any> {
  id?: number;
  company_id: number;
  company?: ICompany;
  title?: string;
  contact_phone?: string;
  contact_email?: string;
  bank_name?: string;
  legal_address?: string; // Юридический адрес
  postal_address?: string; // Почтовый адрес
  bank_account?: string; // Расчётный счёт
  bank_identification_code?: string; // Бик
  bank_correspondent_account?: string; // Корреспондентский счёт банка
  tax_identification_number?: string; // Идентификационный номер налогоплательщика (ИНН)
  statement_reason_code?: string; // Код причины постановки (КПП)
  main_state_registration_number?: string; // Основной государственный регистрационный номер (ОГРН)
  contract_code?: string; // Код договора
  director_first_name?: string;
  director_middle_name?: string;
  director_last_name?: string;
  users: IUser[];
}
