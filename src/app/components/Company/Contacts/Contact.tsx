import * as React from 'react';
import * as moment from 'moment';
import 'moment/locale/ru';
import { IUser } from '../../../models/users';
import { ChangeEvent, FormEvent } from 'react';
import { connect } from '../../../redux/connect';
import { deleteContact, editContactData } from '../../../redux/modules/companies/service';
import { ActionCreator } from 'redux';
import { ICompanyAction } from '../../../models/companies';
import { CellForm } from '../../Misc/Input/CellForm';
import { CellFormCleave } from 'components/Misc/Input/CellFormCleave';
moment.locale('ru');

export interface IContactProps {
  id: number;
  contact: IUser;
  addNewLegalEntity?: ActionCreator<ICompanyAction>;
  changeContactData?: ActionCreator<ICompanyAction>;
  deleteContact?: ActionCreator<ICompanyAction>;
}
export interface IContactState {
  contactData: IUser;
}
@(connect(
  () => ({}),
  (dispatch) => ({
    changeContactData: (companyId: number, contactId: number, param: string, data: any) =>
      dispatch(editContactData(companyId, contactId, param, data)),
    deleteContact: (companyId: number, contactId: number) =>
      dispatch(deleteContact(companyId, contactId)),
  }),
) as any)
export class Contact extends React.Component<IContactProps, IContactState> {
  public readonly state: IContactState = {
    contactData: {
      ...this.props.contact.toJS(),
      // Number is 71xxxxxxxx for empty user to bypass unique and required phone and email
      phone_number: '+7' + this.props.contact.get('phone_number'),
    },
  };
  constructor(props) {
    super(props);
    this.changeValue = this.changeValue.bind(this);
    this._deleteContact = this._deleteContact.bind(this);

    this._onChange = this._onChange.bind(this);
    this.validateCleave = this.validateCleave.bind(this);
  }

  private _onChange(e: ChangeEvent<HTMLInputElement>) {
    const type = e.target.name;
    this.setState({ contactData: { ...this.state.contactData, [type]: e.target.value }});
  }
  private changeValue(e: FormEvent<HTMLInputElement>) {
    const type = e.currentTarget.name;
    let value = this.state.contactData[type];
    if (value !== this.props.contact.get(type)) {
      if (type === 'phone_number' && value.replace('+7', '')
                                  !== this.props.contact.get('phone_number').replace('+7', '')) {
        value = value.replace('+7', '');
      }
      this.props.changeContactData(this.props.contact.get('company_id'), this.props.contact.get('id'), type, value);
    }
  }
  private _deleteContact() {
    this.props.deleteContact(this.props.contact.get('company_id'), this.props.contact.get('id'));
  }
  private validateCleave(e) {
    const type = e.target.name;
    this.setState({ contactData: { ...this.state.contactData, [type]: e.target.rawValue } });
  }
  public render() {
    return (
      <div className="bonus-card" style={{position: 'relative'}}>
        <div className="passinfo-header w-clearfix">
          {this.state.contactData.last_name.length > 0 ? (
            <h3 className="h3 left-h3 margin-bottom-h3">
              { this.state.contactData.last_name + ' '
              + this.state.contactData.first_name + ' '
              + this.state.contactData.middle_name }
            </h3>
          ) : (
            <h3 className="h3 left-h3 margin-bottom-h3">Контакт №{this.props.id}</h3>
          )}
          {this.props.id > 1 && (
            <a onClick={this._deleteContact} style={{cursor: 'pointer'}}
                                    className="link delete-link">Удалить</a>
          )}
        </div>
        <div className="row flex-row w-clearfix">
          <div className="column-33">
            <CellForm
              id={this.props.id}
              label={'Фамилия'}
              name={'last_name'}
              value={this.state.contactData.last_name}
              onChange={(e) => this._onChange(e)}
              onBlur={(e) => this.changeValue(e)}
              required={true} />
          </div>
          <div className="column-33">
            <CellForm
              id={this.props.id}
              label={'Имя'}
              name={'first_name'}
              value={this.state.contactData.first_name}
              onChange={(e) => this._onChange(e)}
              onBlur={(e) => this.changeValue(e)}
              required={true} />
          </div>
          <div className="column-33">
            <CellForm
              id={this.props.id}
              label={'Отчество'}
              name={'middle_name'}
              value={this.state.contactData.middle_name}
              onChange={(e) => this._onChange(e)}
              onBlur={(e) => this.changeValue(e)}
              required={true} />
          </div>
        </div>
        <div className="row flex-row w-clearfix">
          <div className="column full-section">
            <CellForm
              id={this.props.id}
              label={'Должность'}
              maxLength={30}
              name={'position'}
              value={this.state.contactData.position}
              onChange={(e) => this._onChange(e)}
              onBlur={(e) => this.changeValue(e)}
              required={true} />
          </div>
        </div>
        <div className="row flex-row w-clearfix">
          <div className="column-50">
            <CellFormCleave
              options={{
                blocks: [ 2, 3, 3, 2, 2 ], prefix: '+7',
                delimiter: ' ', numericOnly: true,
              }}
              id={this.props.id}
              label={'Телефон'}
              name={'phone_number'}
              value={this.state.contactData.phone_number}
              onChange={(e) => this.validateCleave(e)}
              onBlur={(e) => this.changeValue(e)}
              required={true} />
          </div>
          <div className="column-50">
            <CellForm
              id={this.props.id}
              label={'E-mail'}
              type={'email'}
              name={'email'}
              value={this.state.contactData.email}
              onChange={(e) => this._onChange(e)}
              onBlur={(e) => this.changeValue(e)}
              required={true} />
          </div>
        </div>
      </div>
    );
  }
}
