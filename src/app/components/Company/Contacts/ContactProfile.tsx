import * as React from 'react';
import * as moment from 'moment';
import * as cx from 'classnames';
import 'moment/locale/ru';
import { IBonusCard, IPassport, IUser, PassportType } from '../../../models/users';
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
import { BonusCard } from './BonusCard';
import { App } from '../../../containers/App';
moment.locale('ru');

export interface IContactProfileProps {
  id: number;
  userId: number;
  contact: IUser;
  addNewLegalEntity?: ActionCreator<ICompanyAction>;
  changeContactData?: ActionCreator<ICompanyAction>;
  deleteContact?: ActionCreator<ICompanyAction>;
  addNewDocument?: any;
  changeDocument?: any;
  removeDocument?: any;

  addNewBonusCard?: (card: IBonusCard, token: string) => any;
  changeBonusCard?: (card: IBonusCard, token: string) => any;
  removeBonusCard?: (cardId: number, token: string) => any;
}
export interface IContactProfileState {
  contactData: IUser;
  birth_date_formatted: string;
}
export const defaultPassport: IPassport = fromJS({
  type: PassportType.GENERAL_PASSPORT,
  validity: '', number: '',
});

export const defaultBonusCard: IBonusCard = {
  number: '',
  airlines_id: 1,
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
export class ContactProfile extends React.Component<IContactProfileProps, IContactProfileState> {
  public readonly state: IContactProfileState = {
    contactData: {
      ...this.props.contact.toJS(),
      phone_number: '+7' + this.props.contact.get('phone_number'),
    },
    birth_date_formatted: this.props.contact.get('birth_date')
      ? moment(this.props.contact.get('birth_date')).format('DDMMYYYY')
      : '',
  };
  constructor(props) {
    super(props);
    this.changeValue = this.changeValue.bind(this);
    this._deleteContact = this._deleteContact.bind(this);
    this._onChange = this._onChange.bind(this);
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
  public componentWillUpdate() {
    App.resetWebflow();
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
      this.updateData(type, value);
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
    const type = e.target.name;
    this.setState({ [type]: e.target.rawValue });
  }
  private selectGender(gender: string) {
    if (gender === 'M' || gender === 'F') {
      this.setState({ contactData: { ...this.state.contactData, gender } });
      this.updateData('gender', gender);
    }
  }
  private updateData(type: string, value: any) {
    this.props.changeContactData(this.props.contact.get('company_id'), this.props.contact.get('id'), type, value);
  }
  private changeDate(e: FormEvent<HTMLInputElement>) {
    const type = e.currentTarget.name;
    const value = moment(e.currentTarget.value, 'DD.MM.YYYY').toDate();
    if (value !== this.props.contact.get(type)) {
      this.updateData(type, value);
    }
  }
  private getContactMeta() {
    const builder: string[] = [];
    if (this.state.contactData.id === this.props.userId) {
      builder.push('Контактное лицо');
    } else {
      builder.push('Сотрудник');
    }
    if (this.state.contactData.age_type && this.state.contactData.age_type === 'C') {
      builder.push('Ребенок');
    } else {
      builder.push('Взрослый');
    }
    if (this.state.contactData.id === this.props.userId) {
      builder.unshift('Я');
      return (<span style={{color: '#f24458', opacity: 1}}>{builder.join(' · ')}</span>);
    } else {
      return (<span>{builder.join(' · ')}</span>);
    }
  }
  private addDocument(passport: IPassport) {
    const token = localStorage.getItem('avt_token');
    this.props.addNewDocument({...passport.toJS(), user_id: this.props.contact.get('id')}, token)
      .then((passport: IPassport) => {
        const documents = fromJS(this.state.contactData.documents).push(fromJS(passport));
        this.setState({ contactData: { ...this.state.contactData, documents } });
      });
  }
  private documentEdit(id: number, param: string, value: any) {
    const token = localStorage.getItem('avt_token');
    const docs = fromJS(this.state.contactData.documents);
    const document = docs.find((doc) => doc.get('id') === id);
    if (document) {
      this.props.changeDocument(document.set(param, value), token);
      this.setState({ contactData: { ...this.state.contactData,
          documents: docs.map((doc) => (doc.get('id') === id) ? document.set(param, value) : doc) } });
    }
  }
  private removeDocument(id: number) {
    const token = localStorage.getItem('avt_token');
    this.props.removeDocument(id, token).then(() => {
      console.log(this.state.contactData.documents);
      const documents = fromJS(this.state.contactData.documents).filter((cur) => cur.get('id') !== id);
      this.setState({ contactData: { ...this.state.contactData, documents } });
    });
  }
  private addBonusCard() {
    const token = localStorage.getItem('avt_token');
    this.props.addNewBonusCard({...defaultBonusCard, user_id: this.props.contact.get('id')}, token)

      .then((res: IBonusCard) => {
      const cards = this.state.contactData.bonus_cards;
      cards.push(res);
      this.setState({ contactData: { ...this.state.contactData, bonus_cards: cards } });
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
      this.setState({ contactData: { ...this.state.contactData, bonus_cards: cards } });
    }
  }
  private removeBonusCard(id: number) {
    const token = localStorage.getItem('avt_token');
    this.props.removeBonusCard(id, token).then(() => {
      const cards = this.state.contactData.bonus_cards.filter((cur) => cur.id !== id);
      this.setState({ contactData: { ...this.state.contactData, bonus_cards: cards } });
    });
  }
  public render() {
    // Я · Контактное лицо · Взрослый
    const contactMeta = this.getContactMeta();
    const docs = fromJS(this.state.contactData.documents);
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
      <div data-delay="200" className="order-drop margin-bottom-order-drop w-dropdown" data-ix="edit-user">
        <div className="order-drop-toggle w-dropdown-toggle">
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
              <div className="edit-icon-block">
                <img src="/public/images/edit-black.svg" />
              </div>
            </div>
          </div>
        </div>
        <nav className="order-drop-list w-dropdown-list">
          <div className="order-details">
            <div className="form w-form">
              <form id="email-form-4" name="email-form-4" data-name="Email Form 4">
                <div className="row flex-row w-clearfix">
                  <div className="column-33">
                    <CellForm
                      id={this.props.id}
                      label={'Фамилия'}
                      name={'last_name'}
                      value={this.state.contactData.last_name}
                      disabled={true}
                      required={true} />
                  </div>
                  <div className="column-33">
                    <CellForm
                      id={this.props.id}
                      label={'Имя'}
                      name={'first_name'}
                      value={this.state.contactData.first_name}
                      disabled={true}
                      required={true} />
                  </div>
                  <div className="column-33">
                    <CellForm
                      id={this.props.id}
                      label={'Отчество'}
                      name={'middle_name'}
                      value={this.state.contactData.middle_name}
                      disabled={true}
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
                      disabled={true}
                      required={true} />
                  </div>
                </div>
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
                      onChange={(e) => this.validateCleave(e)}
                      onBlur={(e) => this.changeValue(e)}
                      required={true} />
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
                      name={'birth_date_formatted'}
                      value={this.state.birth_date_formatted}
                      onChange={(e) => this.editDate(e)}
                      onBlur={(e) => this.changeDate(e)}
                      required={true} />
                  </div>
                </div>
              </form>
            </div>
            <div className="order-drop-block">
              <div className="tech-uc black-tech-uc margin-bottom-tech-uc">Документы</div>
              {documents}
              <a href="#" className="link" onClick={() => this.addDocument(defaultPassport)}>Добавить документ</a>
            </div>
            <div className="order-drop-block">
              <div className="tech-uc black-tech-uc margin-bottom-tech-uc">Бонусные карты</div>
              <div className="bonus-card margin-bottom-bonus-card w-clearfix">
                {bonusCards}
                <a className="link" onClick={() => this.addBonusCard()}>Добавить</a>
              </div>
            </div>
          </div>
          {!this.state.contactData.is_active && (
            <div className="order-details paddings-order-details w-clearfix">
              <a href="#" className="link-block left-link-block w-inline-block w-clearfix"
                 data-ix="link-icon" onClick={this._deleteContact}>
                <img src="/public/images/trash-red.svg" className="link-icon" />
                <div>Удалить сотрудника</div>
              </a>
            </div>
          )}
        </nav>
      </div>
    );
  }
}
