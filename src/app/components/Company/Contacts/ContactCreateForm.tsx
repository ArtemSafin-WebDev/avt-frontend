import * as React from 'react';
import * as moment from 'moment';
import 'moment/locale/ru';
import { IUser } from '../../../models/users';
import { ChangeEvent } from 'react';
import { connect } from '../../../redux/connect';
import { addNewContact } from '../../../redux/modules/companies/service';
import { CellForm } from '../../Misc/Input/CellForm';
import { CellFormCleave } from 'components/Misc/Input/CellFormCleave';
import { Map } from 'immutable';
moment.locale('ru');

export interface IContactCreateFormProps {
  companyId: number;
  legalEntityId: number;
  submitCallBack: () => void;
  addNewContact?: any;
}
export interface IContactCreateFormState {
  contactData: IUser;
}

@(connect(
  () => ({}),
  (dispatch) => ({
    addNewContact: (contact: IUser) =>
      dispatch(addNewContact(contact)),
  }),
) as any)
export class ContactCreateForm
       extends React.Component<IContactCreateFormProps, IContactCreateFormState> {
  public defultValues = {
    contactData: {
      phone_number: '',
      first_name: '',
      last_name: '',
      middle_name: '',
      position: '',
      email: '',
      company_id: this.props.companyId,
      legal_entities: [this.props.legalEntityId],
      id: 0,
      is_active: true,
    } as IUser,
  };
  public readonly state: IContactCreateFormState = this.defultValues;
  constructor(props) {
    super(props);
    this._onChange = this._onChange.bind(this);
    this.validateCleave = this.validateCleave.bind(this);
    this.editDate = this.editDate.bind(this);
    this._addNewContact = this._addNewContact.bind(this);
  }
  private _addNewContact() {
    const contact = Map(
      {...this.state.contactData,
        phone_number: this.state.contactData.phone_number.replace('+7', ''),
      });
    this.props.addNewContact(contact).then((res) => {
      if (typeof res === 'undefined' || (res && res.get('id'))) {
        this.setState(this.defultValues);
        this.props.submitCallBack();
      }
    });
  }
  private _onChange(e: ChangeEvent<HTMLInputElement>) {
    const type = e.target.name;
    this.setState({ contactData: { ...this.state.contactData, [type]: e.target.value }});
  }

  private validateCleave(e) {
    const type = e.target.name;
    this.setState({ contactData: { ...this.state.contactData, [type]: e.target.rawValue } });
  }
  private editDate(e) {
    const type = e.target.name;
    this.setState({ [type]: e.target.rawValue });
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
            <h3 className="h3 left-h3 margin-bottom-h3">Новое контактное лицо</h3>
          )}
          <a onClick={(e) => { e.preventDefault(); this.props.submitCallBack(); return false; }}
             className="link delete-link" style={{cursor: 'pointer'}}>Удалить</a>

        </div>
        <div className="row flex-row w-clearfix">
          <div className="column-33">
            <CellForm
              id={0}
              label={'Фамилия'}
              name={'last_name'}
              value={this.state.contactData.last_name}
              onChange={(e) => this._onChange(e)}
              required={true} />
          </div>
          <div className="column-33">
            <CellForm
              id={0}
              label={'Имя'}
              name={'first_name'}
              value={this.state.contactData.first_name}
              onChange={(e) => this._onChange(e)}
              required={true} />
          </div>
          <div className="column-33">
            <CellForm
              id={0}
              label={'Отчество'}
              name={'middle_name'}
              value={this.state.contactData.middle_name}
              onChange={(e) => this._onChange(e)}
              required={true} />
          </div>
        </div>
        <div className="row flex-row w-clearfix">
          <div className="column full-section">
            <CellForm
              id={0}
              label={'Должность'}
              maxLength={30}
              name={'position'}
              value={this.state.contactData.position}
              onChange={(e) => this._onChange(e)}
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
              id={0}
              label={'Телефон'}
              name={'phone_number'}
              value={this.state.contactData.phone_number}
              onChange={(e) => this.validateCleave(e)}
              required={true} />
          </div>
          <div className="column-50">
            <CellForm
              id={0}
              label={'E-mail'}
              type={'email'}
              name={'email'}
              value={this.state.contactData.email}
              onChange={(e) => this._onChange(e)}
              required={true} />
          </div>
        </div>
        <div className="w-clearfix">
          <a href="#" className="link-block left-link-block w-inline-block w-clearfix"
             data-ix="link-icon" onClick={this._addNewContact}>
            <img src="/public/images/plus-red.svg" className="link-icon" />
            <div>Добавить сотрудника</div>
          </a>
        </div>
      </div>
    );
  }
}
