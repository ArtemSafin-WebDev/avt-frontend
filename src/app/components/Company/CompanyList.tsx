import * as React from 'react';
import { ICompany } from '../../models/companies';
import { Company } from './Company';

export interface ICompanyListProps {
  companies: ICompany[];
}
export class CompanyList extends React.Component<ICompanyListProps> {
  public render() {
    return (this.props.companies.length > 0)
      ? this.props.companies.reverse().map((company) => {
        return (
          <Company key={company.get('id')} company={company}/>
        );
      })
      : (<h3>Ничего не найдено</h3>);
  }
}
