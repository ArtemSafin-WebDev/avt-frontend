import * as React from 'react';
import * as moment from 'moment';
import * as cx from 'classnames';
import 'moment/locale/ru';
import {
  AgeType,
  IBonusCard,
  IPassenger,
  IPassport,
  IUser,
  PassportType,
  PositionType,
  ReturnType,
} from '../../../models/users';
import { ChangeEvent, FormEvent } from 'react';
import { connect } from '../../../redux/connect';
import { ActionCreator } from 'redux';
import { ICompanyAction } from '../../../models/companies';
import { CellForm } from '../../Misc/Input/CellForm';
import { CellFormCleave } from 'components/Misc/Input/CellFormCleave';
import { PassportRow } from './PassportRow';
import { deleteContact, editContactData } from '../../../redux/modules/companies/service';
import {
  addNewBonusCard,
  addNewDocument,
  editBonusCard,
  editDocument,
  removeBonusCard,
  removeDocument,
} from '../../../redux/modules/users/service';
import { fromJS } from 'immutable';
import { DropdownSelect } from '../../Misc/Input/DropdownSelect';
import { BonusCard } from './BonusCard';
import { App } from '../../../containers/App';
moment.locale('ru');

export interface IContactProfileTicketProps {
  id: number;
  myUserId: number;
  allowPreferences: boolean;
  openPreferences: boolean;
  contact: IUser;
  addNewLegalEntity?: ActionCreator<ICompanyAction>;
  changeContactData?: ActionCreator<ICompanyAction>;
  deleteContact?: ActionCreator<ICompanyAction>;
  addNewDocument?: any;
  changeDocument?: any;
  removeDocument?: any;
  addNewBonusCard?: any;
  changeBonusCard?: any;
  removeBonusCard?: any;
  onEdit?: (prop: string, value: any) => any;
  onDelete?: () => any;
}
export interface IContactProfileTicketState {
  contactData: IPassenger;
  birthday_formatted: string;
  preferences: boolean;
}
export const defaultPassport: IPassport = fromJS({
  type: PassportType.GENERAL_PASSPORT,
  validity: '', number: '',
});
export const defaultBonusCard: IBonusCard = {
  number: '',
  airlines_id: 434,
  user_id: 0,
};
@(connect(
  () => ({}),
  (dispatch) => ({
    changeContactData: (companyId: number, contactId: number, param: string, data: any) =>
      dispatch(editContactData(companyId, contactId, param, data)),
    addNewDocument: (passport: IPassport, token: string) =>
      dispatch(addNewDocument(passport, token)),
    changeDocument: (passport: IPassport, token: string) =>
      dispatch(editDocument(passport, token)),
    removeDocument: (documentId: number, token: string) =>
      dispatch(removeDocument(documentId, token)),
    addNewBonusCard: (card: IBonusCard, token: string) =>
      dispatch(addNewBonusCard(card, token)),
    changeBonusCard: (card: IBonusCard, token: string) =>
      dispatch(editBonusCard(card, token)),
    removeBonusCard: (cardId: number, token: string) =>
      dispatch(removeBonusCard(cardId, token)),
    deleteContact: (companyId: number, contactId: number) =>
      dispatch(deleteContact(companyId, contactId)),
  }),
) as any)
export class ContactProfileTicket extends React.Component<IContactProfileTicketProps, IContactProfileTicketState> {
  public readonly state: IContactProfileTicketState = {
    contactData: {
      ...this.props.contact.toJS(),
      phone_number: '+7' + this.props.contact.get('phone_number'),
      preference_position: this.props.contact.get('preference_position') || PositionType.STANDARD,
      preference_luggage: this.props.contact.get('preference_luggage') || true,
      preference_return_rate: this.props.contact.get('preference_return_rate') || ReturnType.RETURNABLE,
      preference_food: this.props.contact.get('preference_food') || true,
      has_bonus_card: this.props.contact.get('has_bonus_card')
        || fromJS(this.props.contact.get('bonus_cards')).count() > 0,
    },
    preferences: this.props.contact.get('preferences'),
    birthday_formatted: this.props.contact.get('birthday')
      ? moment(this.props.contact.get('birthday')).format('DDMMYYYY')
      : '',
  };
  constructor(props) {
    super(props);
    this.changeValue = this.changeValue.bind(this);
    this._deleteContact = this._deleteContact.bind(this);
    this._onChange = this._onChange.bind(this);
    this.editProp = this.editProp.bind(this);
    this.validateCleave = this.validateCleave.bind(this);
    this.changeDate = this.changeDate.bind(this);
    this.removeDocument = this.removeDocument.bind(this);
    this.editDate = this.editDate.bind(this);
    this.addDocument = this.addDocument.bind(this);
    this.documentEdit = this.documentEdit.bind(this);
    this.removeDocument = this.removeDocument.bind(this);
    this.addBonusCard = this.addBonusCard.bind(this);
    this.editBonusCard = this.editBonusCard.bind(this);
    this.removeBonusCard = this.removeBonusCard.bind(this);
  }

  public componentDidMount() {
    App.resetWebflow();
  }

  private _onChange(e: ChangeEvent<HTMLInputElement>) {
    const type = e.target.name;
    this.setState({ contactData: { ...this.state.contactData, [type]: e.target.value }});
  }
  private changeValue(e: any) {
    const type = e.currentTarget.name;
    let value = this.state.contactData[type];
    if (value !== this.props.contact.get(type)) {
      if (type === 'phone_number' && value.replace('+7', '')
                                  !== this.props.contact.get('phone_number').replace('+7', '')) {
        value = value.replace('+7', '');
      }
      this.updateData(type, value);
      if (this.props.onEdit) { this.props.onEdit(type, value); }
    }
  }
  private _deleteContact() {
    this.props.deleteContact(this.props.contact.get('company_id'), this.props.contact.get('id'));
  }
  private validateCleave(e) {
    const type = e.target.name;
    this.setState({ contactData: { ...this.state.contactData, [type]: e.target.rawValue } });
  }
  private editDate(e) {
    this.setState({ birthday_formatted: e.target.rawValue });
  }
  private editProp(type, value) {
    this.setState({ contactData: { ...this.state.contactData, [type]: value  } });
    if (this.props.onEdit) { this.props.onEdit(type, value); }
  }
  private selectGender(gender: string) {
    if (gender === 'M' || gender === 'F') {
      this.editProp('gender', gender);
      this.updateData('gender', gender);
    }
  }
  private updateData(type: string, value: any) {
    this.props.changeContactData(this.props.contact.get('company_id'), this.props.contact.get('id'), type, value);
  }
  private changeDate(e: FormEvent<HTMLInputElement>) {
    const type = e.currentTarget.name;
    const value = moment(e.currentTarget.value, 'DD.MM.YYYY');
    this.editProp(type, value.format('YYYY-MM-DD'));
    this.updateData(type, value.format('YYYY-MM-DD'));
  }
  private getContactMeta() {
    const builder: string[] = [];
    if (this.props.allowPreferences) {
      if (this.state.contactData.id === this.props.myUserId) {
        builder.push('Контактное лицо');
      } else {
        builder.push('Сотрудник');
      }
    }
    if (this.state.contactData.age_type && this.state.contactData.age_type === 'A') {
      builder.push('Взрослый');
    } else {
      builder.push('Ребенок');
    }
    if (this.state.contactData.id === this.props.myUserId) {
      builder.unshift('Я');
      return (<span style={{color: '#f24458', opacity: 1}}>{builder.join(' · ')}</span>);
    } else {
      return (<span>{builder.join(' · ')}</span>);
    }
  }
  private addDocument(passport: IPassport) {
    const token = localStorage.getItem('avt_token');
    this.props.addNewDocument({...passport.toJS(), user_id: this.props.id}, token)
      .then((passport: IPassport) => {
        const documents = fromJS(this.state.contactData.documents).push(fromJS(passport));
        this.props.onEdit('documents', documents);
      });
  }
  private documentEdit(id: number, param: string, value: any) {
    const token = localStorage.getItem('avt_token');
    const docs = fromJS(this.props.contact.get('documents'));
    const document = docs.find((doc) => doc.get('id') === id);
    if (document) {
      this.props.changeDocument(document.set(param, value), token);
      this.props.onEdit('documents', docs.map((doc) => (doc.get('id') === id) ? document.set(param, value) : doc));
    }
  }
  private removeDocument(id: number) {
    const token = localStorage.getItem('avt_token');
    this.props.removeDocument(id, token).then(() => {
      const documents = fromJS(this.state.contactData.documents).filter((cur) => cur.get('id') !== id);
      this.props.onEdit('documents', documents);
    });
  }
  private addBonusCard() {
    const token = localStorage.getItem('avt_token');
    this.props.addNewBonusCard({...defaultBonusCard, user_id: this.props.id}, token).then((res: IBonusCard) => {
      const cards = this.state.contactData.bonus_cards;
      cards.push(res);
      this.props.onEdit('bonus_cards', cards);
    });
  }
  private editBonusCard(id: number, param: string, value: any) {
    const token = localStorage.getItem('avt_token');
    let card;
    const cards = this.state.contactData.bonus_cards.map((bc) => {
      if (bc.id === id) {
        card = bc;
        bc[param] = value;
      }
      return bc;
    });
    if (card) {
      card[param] = value;
      this.props.changeBonusCard(card, token);
      this.props.onEdit('bonus_cards', cards);
    }
  }
  private removeBonusCard(id: number) {
    const token = localStorage.getItem('avt_token');
    this.props.removeBonusCard(id, token).then(() => {
      const cards = this.state.contactData.bonus_cards.filter((cur) => cur.id !== id);
      this.props.onEdit('bonus_cards', cards);
    });
  }

  public render() {
    // Я · Контактное лицо · Взрослый
    const contactMeta = this.getContactMeta();
    const docs = fromJS(this.props.contact.get('documents'));
    const cards = this.state.contactData.bonus_cards;
    const documents = docs.map((document, i) => (
      <PassportRow onEdit={this.documentEdit} key={`${document.get('id')} ${i}`}
                   onRemove={this.removeDocument}
                   passport={document.update(
                     'validity',
                     (validity) => moment(validity, 'YYYY-MM-DD').format('DD.MM.YYYY'),
                   )}/>
    ));
    const bonusCards = cards.map((bonusCard) => (
      <BonusCard onEdit={this.editBonusCard} key={bonusCard.id > -1 ? bonusCard.id : Math.random()}
                 onRemove={this.removeBonusCard} bonusCard={bonusCard}/>
    ));
    if (documents.length === 0) {
      this.addDocument(defaultPassport);
    }
    return (
      <div className="passinfo w-clearfix">
        <div className="passinfo-header w-clearfix">
          <h3 className="h3 left-h3 margin-bottom-h3">
              {this.state.contactData.last_name.trim().length > 0 ? (
                <div className="result-info">
                  <div className="p height-1-p white-space-normal" style={{whiteSpace: 'normal'}}>{
                    this.state.contactData.last_name + ' '
                    + this.state.contactData.first_name + ' '
                    + this.state.contactData.middle_name
                  }</div>
                  <div className="tech-text white-space-normal">{contactMeta}</div>
                </div>
              ) : (
                'Информация о пассажире'
              )}
          </h3>
          <div className="options margin-bottom-options w-clearfix">
            <a onClick={() => this.editProp('age_type', AgeType.ADULT )}
               className={cx('link left-link', {
                 current_link: this.state.contactData.age_type === AgeType.ADULT,
                 inactive_link: this.state.contactData.age_type !== AgeType.ADULT,
               })}>Взрослый</a>
            <a onClick={() => this.editProp('age_type', AgeType.CHILD )}
               className={cx('link left-link', {
                 current_link: this.state.contactData.age_type === AgeType.CHILD,
                 inactive_link: this.state.contactData.age_type !== AgeType.CHILD,
               })}>До 12 лет</a>
            <a onClick={() => this.editProp('age_type', AgeType.INFANT)}
               className={cx('link left-link', {
                 current_link: this.state.contactData.age_type === AgeType.INFANT,
                 inactive_link: this.state.contactData.age_type !== AgeType.INFANT,
               })}>До 2 лет</a>
          </div>
          {this.props.contact.get('id') > -1 && (
            <a href="#" onClick={() => this.props.onDelete()} className="link delete-link">Удалить</a>
          )}
        </div>
        <div className="form">
          <div className="form w-form">
            <form id="email-form-4" name="email-form-4" data-name="Email Form 4">
              <div className="row flex-row w-clearfix">
                <div className="column-33">
                    <CellForm
                      id={this.props.id}
                      label={'Фамилия'}
                      name={'last_name'}
                      value={this.state.contactData.last_name}
                      disabled={this.props.contact.get('id') > -1}
                      onChange={(e) => this._onChange(e)}
                      onBlur={(e) => this.changeValue(e)}
                      required={true}/>
                  </div>
                  <div className="column-33">
                    <CellForm
                      id={this.props.id}
                      label={'Имя'}
                      name={'first_name'}
                      value={this.state.contactData.first_name}
                      disabled={this.props.contact.get('id') > -1}
                      onChange={(e) => this._onChange(e)}
                      onBlur={(e) => this.changeValue(e)}
                      required={true}/>
                  </div>
                  <div className="column-33">
                    <CellForm
                      id={this.props.id}
                      label={'Отчество'}
                      name={'middle_name'}
                      value={this.state.contactData.middle_name}
                      disabled={this.props.contact.get('id') > -1}
                      onChange={(e) => this._onChange(e)}
                      onBlur={(e) => this.changeValue(e)}
                      required={true}/>
                  </div>
                </div>
                {this.props.allowPreferences && (
                  <div className="row flex-row w-clearfix">
                    <div className="column-50">
                      <CellForm
                        id={this.props.id}
                        label={'Email'}
                        name={'email'}
                        value={this.state.contactData.email}
                        disabled={this.props.contact.get('id') > -1}
                        onChange={(e) => this._onChange(e)}
                        onBlur={(e) => this.changeValue(e)}
                        required={true}/>
                    </div>
                    <div className="column-50">
                      <CellForm
                        id={this.props.id}
                        label={'Должность'}
                        name={'position'}
                        maxLength={30}
                        value={this.state.contactData.position}
                        disabled={this.props.contact.get('id') > -1}
                        onChange={(e) => this._onChange(e)}
                        onBlur={(e) => this.changeValue(e)}
                        required={true}/>
                    </div>
                  </div>
                )}
                <div className="row flex-row w-clearfix">
                  <div className="column-33">
                    <CellFormCleave
                      options={{
                        blocks: [ 2, 3, 3, 2, 2 ], prefix: '+7',
                        delimiter: ' ', numericOnly: true,
                      }}
                      id={this.props.id}
                      label={'Телефон'}
                      name={'phone_number'}
                      value={this.state.contactData.phone_number}
                      disabled={this.props.contact.get('id') > -1}
                      onChange={(e) => this.validateCleave(e)}
                      onBlur={(e) => this.changeValue(e)}
                      required={true}/>
                  </div>
                  <div className="column-33">
                    <div className="cell-form">
                      <label htmlFor="gender" className="label">Пол</label>
                      <div className="tumblr w-clearfix">
                        <a href="#"
                           className={cx(
                             'tumblr-button tumblr-button-left w-button',
                             {'tumblr-button-current': this.state.contactData.gender === 'M'})}
                            onClick={() => this.selectGender('M')}>
                          Мужской
                        </a>
                        <a href="#"
                           className={cx(
                             'tumblr-button tumblr-button-right w-button',
                             {'tumblr-button-current': this.state.contactData.gender === 'F'})}
                           onClick={() => this.selectGender('F')}>
                          Женский
                        </a>
                      </div>
                    </div>
                  </div>
                  <div className="column-33">
                    <CellFormCleave
                      options={{
                        blocks: [ 2, 2, 4 ],
                        delimiter: '.', numericOnly: true,
                      }}
                      id={this.props.id}
                      label={'Дата рождения'}
                      name={'birthday'}
                      value={this.state.birthday_formatted}
                      onChange={(e) => this.editDate(e)}
                      onBlur={(e) => this.changeDate(e)}
                      required={true} />
                  </div>
                </div>
                <div className="order-drop-block">
                  <div className="tech-uc black-tech-uc margin-bottom-tech-uc">Документы</div>
                  {documents}
                  {this.props.contact.get('id') > -1 && (
                    <a href="#" className="link" onClick={() => this.addDocument(defaultPassport)}>Добавить документ</a>
                  )}
                </div>
                <div hidden={!this.props.allowPreferences}
                     className={cx('passinfo-preferences w-clearfix', {open: this.state.preferences})}>
                  <div className="tech-uc black-tech-uc margin-bottom-tech-uc">Предпочтения</div>
                  <div hidden={!this.state.preferences}>
                    <div className="row flex-row w-clearfix">
                      <div className="column-50">
                        <div className="cell-form">
                          <label htmlFor="Name-8" className="label">Место в салоне</label>
                          <DropdownSelect
                            selectable={false} selectLimit={1}
                            values={[
                              {value: PositionType.NEAR_EXIT, text: 'Рядом с выходом',
                                selected: this.state.contactData.preference_position === PositionType.NEAR_EXIT},
                              {value: PositionType.FIRST_SEATS, text: 'Первые ряды',
                                selected: this.state.contactData.preference_position === PositionType.FIRST_SEATS},
                              {value: PositionType.EXTRA_SPACE_FOR_LEGS, text: 'Дополнительное место для ног',
                                selected: this.state.contactData.preference_position ===
                                PositionType.EXTRA_SPACE_FOR_LEGS},
                            ]}
                            onSelect={(id, value) => this.editProp(id, value)}
                            placeholder={'Выбрать...'}
                            name="preference_position"/>
                        </div>
                      </div>
                      <div className="column-50">
                        <div className="cell-form">
                          <label htmlFor="gender" className="label">Тариф</label>
                          <div className="tumblr w-clearfix">
                            <a href="#"
                               className={cx(
                                 'tumblr-button tumblr-button-left w-button',
                                 {'tumblr-button-current':
                                   this.state.contactData.preference_return_rate
                                                === ReturnType.RETURNABLE})}
                               onClick={() => this.editProp('preference_return_rate', ReturnType.RETURNABLE)}>
                              Возвратный
                            </a>
                            <a href="#"
                               className={cx(
                                 'tumblr-button tumblr-button-right w-button',
                                 {'tumblr-button-current':
                                   this.state.contactData.preference_return_rate
                                                === ReturnType.IRRETURNABLE})}
                               onClick={() => this.editProp('preference_return_rate', ReturnType.IRRETURNABLE)}>
                              Невозвратный
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="row flex-row w-clearfix">
                      <div className="column-50">
                        <div className="cell-form">
                          <label htmlFor="gender" className="label">Багаж</label>
                          <div className="tumblr w-clearfix">
                            <a href="#"
                               className={cx(
                                 'tumblr-button tumblr-button-left w-button',
                                 {'tumblr-button-current':
                                   !!this.props.contact.get('preference_luggage') === true})}
                               onClick={() => this.editProp('preference_luggage', true)}>
                              Возвратный
                            </a>
                            <a href="#"
                               className={cx(
                                 'tumblr-button tumblr-button-right w-button',
                                 {'tumblr-button-current':
                                   !!this.props.contact.get('preference_luggage') === false})}
                               onClick={() => this.editProp('preference_luggage', false)}>
                              Невозвратный
                            </a>
                          </div>
                        </div>
                      </div>
                      <div className="column-50">
                        <div className="cell-form">
                          <label htmlFor="gender" className="label">Питание</label>
                          <div className="tumblr w-clearfix">
                            <a href="#"
                               className={cx(
                                 'tumblr-button tumblr-button-left w-button',
                                 {'tumblr-button-current':
                                   !!this.props.contact.get('preference_food') === true})}
                               onClick={() => this.editProp('preference_food', true)}>
                              Нужно
                            </a>
                            <a href="#"
                               className={cx(
                                 'tumblr-button tumblr-button-right w-button',
                                 {'tumblr-button-current':
                                   !!this.props.contact.get('preference_food') === false})}
                               onClick={() => this.editProp('preference_food', false)}>
                              Не нужно
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                    {this.state.contactData.id > -1 && (
                      <div className="checkbox w-checkbox"
                           onClick={() => this.setState({ contactData: { ...this.state.contactData,
                               has_bonus_card: !this.state.contactData.has_bonus_card } })}>
                        <input type="checkbox" id="check_card"
                               className="checkbox-thing w-checkbox-input" />
                        <div className={cx('checkbox-icon', {
                          inactive: !this.state.contactData.has_bonus_card,
                          active: this.state.contactData.has_bonus_card})}>
                          <img src="/public/images/check-red.svg" />
                        </div>
                        <label htmlFor="check_card" className="checkbox-text w-form-label">
                          Есть бонусная карта «Аэрофлот» или «Россия»</label>
                      </div>
                    )}

                    {this.state.contactData.id > -1 && this.state.contactData.has_bonus_card && (
                      <div className="bonus-card w-clearfix">
                        {bonusCards}
                        <a className="link" onClick={() => this.addBonusCard()}>Добавить</a>
                      </div>
                    )}
                </div>
                </div>
              </form>
            </div>
          </div>
        <a href="#" className="link" hidden={!this.props.allowPreferences}
           onClick={() => this.setState({preferences: !this.state.preferences})}>
          {!this.state.preferences ? (
            `Указать предпочтения`
          ) : (`Скрыть предпочтения`)}
        </a>
      </div>
    );
  }
}
