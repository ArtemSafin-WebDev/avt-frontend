import * as React from 'react';
import { ICompany, ICompanyAction } from '../../models/companies';
import * as moment from 'moment';
import 'moment/locale/ru';
import { Contact } from './Contacts/Contact';
import { LegalEntity } from './LegalEntities/LegalEntity';
import { ActionCreator } from 'redux';
import { addNewContact, addNewLegalEntity, approveCompany, changeCompanyData } from 'redux/modules/companies/service';
import { ILegalEntity } from '../../models/legalEntities';
import { connect } from '../../redux/connect';
import { Map } from 'immutable';
import * as classNames from 'classnames';
import { IUser } from '../../models/users';
import { ContactCreateForm } from './Contacts/ContactCreateForm';
import { App } from '../../containers/App';
moment.locale('ru');
export interface ICompanyProps {
  company: ICompany;
  addNewContact?: ActionCreator<ICompanyAction>;
  addNewLegalEntity?: ActionCreator<ICompanyAction>;
  changeCompanyData?: ActionCreator<ICompanyAction>;
  approveCompany?: (company: ICompany, status: boolean) => any;
}
export interface ICompanyState {
  newContact: boolean;
}
@(connect(
  () => ({}),
  (dispatch) => ({
    addNewContact: (contact: IUser) =>
      dispatch(addNewContact(contact)),
    addNewLegalEntity: (legalEntity: ILegalEntity) =>
      dispatch(addNewLegalEntity(legalEntity)),
    changeCompanyData: (company: ICompany, param: string, value: any) =>
      dispatch(changeCompanyData(company, param, value)),
    approveCompany: (company: ICompany, status: boolean) =>
      dispatch(approveCompany(company, status)),
  }),
) as any)
export class Company extends React.Component<ICompanyProps, ICompanyState> {
  public readonly state: ICompanyState = {
    newContact: false,
  };
  constructor(props) {
    super(props);
    this.openNewContactForm = this.openNewContactForm.bind(this);
    this.closeNewContactForm = this.closeNewContactForm.bind(this);
    this._addNewLegalEntity = this._addNewLegalEntity.bind(this);
    this._changeCompanyData = this._changeCompanyData.bind(this);
  }
  public componentDidMount() {
    App.resetWebflow();
  }
  private _addNewLegalEntity() {
    const legalEntity = Map({
      company_id: this.props.company.get('id'),
    });
    this.props.addNewLegalEntity(legalEntity);
  }
  private _changeCompanyData(e: any, param: string, value: any) {
    this.props.changeCompanyData(this.props.company, param, value);
    return e;
  }
  private openNewContactForm() {
    this.setState({newContact: true});
  }
  private closeNewContactForm() {
    setTimeout(() => {
      this.setState({newContact: false});
    }, 1000);
  }
  public render() {
    const headingClass = classNames({ 'order-drop-toggle w-dropdown-toggle': true,
      'force-open': this.state.newContact });
    const bodyClass = classNames({ 'order-drop-list w-dropdown-list': true, 'force-open': this.state.newContact });
    return (
      <div data-delay="200" className="order-drop margin-bottom-order-drop w-dropdown" data-ix="edit-user">
        <div className={headingClass}>
          <div className="w-row">
            <div className="w-col w-col-6 w-col-small-6 w-col-tiny-6">
              <div className="result-info">
                <div className="p height-1-p">{this.props.company.get('title')}</div>
                <div className="tech-text">{moment(this.props.company.get('created_date')).format('LL')}</div>
              </div>
            </div>
            <div className="w-clearfix w-col w-col-6 w-col-small-6 w-col-tiny-6">
              <div className="edit-icon-block">
                <img src="/public/images/edit-black.svg"/>
              </div>
            </div>
          </div>
        </div>
        <nav className={bodyClass} data-ix="order-droplist">
          <div className="order-details">
            <div className="form w-form">
              <form id="email-form-4" name="email-form-4" data-name="Email Form 4">
                {this.props.company.get('legal_entities').reverse().map((legalEntity, i) => {
                  return (
                    <div className="legal-entity" key={legalEntity.get('id')}>
                      <div className="order-drop-block no-border">
                        <div className="tech-uc black-tech-uc margin-bottom-tech-uc">Реквизиты</div>
                        <LegalEntity key={legalEntity.get('id')} id={++i} legalEntity={legalEntity}/>
                      </div>
                      <div className="order-drop-block">
                        <div className="tech-uc black-tech-uc margin-bottom-tech-uc">Контактные лица</div>
                        {legalEntity.get('users')
                          .map((user, i) =>
                            (<Contact key={user.get('id')} id={++i} contact={user}/>),
                          )}
                        {this.state.newContact && (
                          <ContactCreateForm submitCallBack={this.closeNewContactForm}
                                             legalEntityId={legalEntity.get('id')}
                                             companyId={this.props.company.get('id')} />
                        )}
                        <div className="cell-form w-clearfix">
                          <a href="#" className="link" onClick={this.openNewContactForm}>Добавить контакт</a>
                        </div>
                      </div>
                    </div>
                  );
                })}
                <a href="#" onClick={this._addNewLegalEntity} className="add-button w-inline-block">
                  <img src="/public/images/plus-red.svg" className="icon-more" />
                  <div>Добавить юр. лицо</div>
                </a>
              </form>
            </div>
          </div>
          <div className="order-details paddings-order-details w-clearfix">
            {!this.props.company.get('is_approved') && (
              <a href="#" className="link-block left-link-block margin-right-link-block w-inline-block w-clearfix"
                 onClick={() => this.props.approveCompany(this.props.company, true)}
                 data-ix="link-icon">
                <img src="/public/images/circleCheck-red.svg" className="link-icon"/>
                <div>Разрешить доступ в AVT</div>
              </a>
            )}
            <a href="#" className="link-block grey-link-block left-link-block w-inline-block"
               onClick={() => this.props.approveCompany(this.props.company, false)}
               data-ix="link-icon">
              <div>Отклонить заявку</div>
            </a>
            <a href="#" className="link-block left-link-block hidden-link-block w-inline-block w-clearfix"
               data-ix="link-icon">
              <img src="/public/images/arrow-left-red.svg" className="link-icon"/>
              <div>Отменить действие</div>
            </a>
          </div>
        </nav>
      </div>
    );
  }
}
