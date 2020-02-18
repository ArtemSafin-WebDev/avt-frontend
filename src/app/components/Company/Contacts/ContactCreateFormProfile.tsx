import * as React from 'react';
import * as moment from 'moment';
import 'moment/locale/ru';
import { IUser } from '../../../models/users';
import { ChangeEvent } from 'react';
import { connect } from '../../../redux/connect';
import { addNewContact } from '../../../redux/modules/companies/service';
import { CellForm } from '../../Misc/Input/CellForm';
import { CellFormCleave } from 'components/Misc/Input/CellFormCleave';
import { fromJS, Map } from 'immutable';
moment.locale('ru');

export interface IContactCreateFormProfileProps {
  companyId: number;
  submitCallBack: (contact: IUser) => void;
  addNewContact?: any;
  legalEntities: number[];
  onDelete?: () => any;
}
export interface IContactCreateFormProfileState {
  contactData: IUser;
  birth_date_formatted: string;
}

@(connect(
  () => ({}),
  (dispatch) => ({
    addNewContact: (contact: IUser) =>
      dispatch(addNewContact(contact)),
  }),
) as any)
export class ContactCreateFormProfile
       extends React.Component<IContactCreateFormProfileProps, IContactCreateFormProfileState> {
  public defultValues = {
    contactData: {
      phone_number: '',
      first_name: '',
      last_name: '',
      middle_name: '',
      position: '',
      email: '',
      company_id: this.props.companyId,
      legal_entities: this.props.legalEntities,
      id: 0,
      gender: 'M',
      age_type: 'A',
    } as IUser,
    birth_date_formatted: '',
  };
  public readonly state: IContactCreateFormProfileState = this.defultValues;
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
        birthday: moment(this.state.birth_date_formatted, 'DD.MM.YYYY').format('YYYY-MM-DD'),
        phone_number: this.state.contactData.phone_number.replace('+7', ''),
      });
    this.props.addNewContact(contact).then((res) => {
      if (res && (fromJS(res).get('id'))) {
        this.setState(this.defultValues);
        this.props.submitCallBack(res);
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

  private getContactMeta() {
    const builder: string[] = [];
    if (this.state.contactData.company_id === this.props.companyId) {
      builder.push('Контактное лицо');
    } else {
      builder.push('Сотрудник');
    }
    if (this.state.contactData.age_type && this.state.contactData.age_type === 'C') {
      builder.push('Ребенок');
    } else {
      builder.push('Взрослый');
    }
    return (<span>{builder.join(' · ')}</span>);
  }
  public render() {
    // Я · Контактное лицо · Взрослый
    const contactMeta = this.getContactMeta();

    return (
      <div data-delay="200" className="order-drop margin-bottom-order-drop w-dropdown" data-ix="edit-user">
        <div className="order-drop-toggle w-dropdown-toggle w--open">
          <div className="w-row">
            <div className="w-col w-col-9 w-col-small-9 w-col-tiny-9">
              {this.state.contactData.last_name.length > 0 ? (
                <div className="result-info">
                  <div className="p height-1-p white-space-normal" style={{whiteSpace: 'normal'}}>{
                    this.state.contactData.last_name + ' '
                    + this.state.contactData.first_name + ' '
                    + this.state.contactData.middle_name
                  }</div>
                  <div className="tech-text white-space-normal">{contactMeta}</div>
                </div>
              ) : (
                <div className="result-info">
                  <div className="p height-1-p grey-p">Новый сотрудник</div>
                  <div className="tech-text white-space-normal">Заполните данные, чтобы добавить нового сотрудника</div>
                </div>
              )}
            </div>
            <div className="w-clearfix w-col w-col-3 w-col-small-3 w-col-tiny-3">
              <a href="#" onClick={() => this.props.onDelete()} className="link delete-link">Удалить</a>
            </div>
          </div>
        </div>
        <nav className="order-drop-list w-dropdown-list w--open" style={{display: `block`}}>
          <div className="order-details">
            <div className="form w-form">
              <form id="email-form-4" name="email-form-4" data-name="Email Form 4">
                <div className="row flex-row w-clearfix">
                  <div className="column-33">
                    <CellForm
                      label={'Фамилия'}
                      name={'last_name'}
                      onChange={(e) => this._onChange(e)}
                      value={this.state.contactData.last_name}
                      required={true} />
                  </div>
                  <div className="column-33">
                    <CellForm
                      label={'Имя'}
                      name={'first_name'}
                      onChange={(e) => this._onChange(e)}
                      value={this.state.contactData.first_name}
                      required={true} />
                  </div>
                  <div className="column-33">
                    <CellForm
                      label={'Отчество'}
                      name={'middle_name'}
                      onChange={(e) => this._onChange(e)}
                      value={this.state.contactData.middle_name}
                      required={true} />
                  </div>
                </div>
                <div className="row flex-row w-clearfix">
                  <div className="column-50">
                    <CellForm
                      label={'Должность'}
                      maxLength={30}
                      name={'position'}
                      onChange={(e) => this._onChange(e)}
                      value={this.state.contactData.position}
                      required={true} />
                  </div>
                  <div className="column-50">
                    <CellForm
                      label={'E-mail'}
                      type={'email'}
                      name={'email'}
                      value={this.state.contactData.email}
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
                      label={'Телефон'}
                      name={'phone_number'}
                      value={this.state.contactData.phone_number}
                      onChange={(e) => this.validateCleave(e)}
                      required={true} />
                  </div>
                  <div className="column-50">
                    <CellFormCleave
                      options={{
                        blocks: [ 2, 2, 4 ],
                        delimiter: '.', numericOnly: true,
                      }}
                      label={'Дата рождения'}
                      name={'birth_date_formatted'}
                      value={this.state.birth_date_formatted}
                      onChange={(e) => this.editDate(e)}
                      required={true} />
                  </div>
                </div>
              </form>
            </div>
          </div>
          <div className="order-details paddings-order-details w-clearfix">
            <a href="#" className="link-block left-link-block w-inline-block w-clearfix"
               data-ix="link-icon" onClick={this._addNewContact}>
              <img src="/public/images/plus-red.svg" className="link-icon" />
              <div>Добавить сотрудника</div>
            </a>
          </div>
        </nav>
      </div>
    );
  }
}
