import * as React from 'react';
import * as cx from 'classnames';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import { ContactProfileTicket, defaultPassport } from '../../components/Company/Contacts/ContactProfileTicket';
import { EmployeeSelectForm } from '../../components/Forms/EmployeeSelectForm';
import { IUser, IUserBase } from '../../models/users';
import { getUserCompany } from '../../redux/modules/companies/selectors';
import { getUserData } from '../../redux/modules/users/selectors';
import { IStore } from '../../redux/IStore';
import { getPassengersOfType, getPropertiesOfType } from '../../redux/modules/search/selectors';
import { ICompany } from '../../models/companies';
import { IProduct, ProductType } from '../../models/purchasing/IProduct';
import { IPassengersInfo } from '../../models/search/IPassengersInfo';
import { ISearchProperties } from '../../models/search/ISearchProperties';
import { getBasket } from '../../redux/modules/purchasing/selectors';
import { ISearchState } from '../../redux/modules/search/state';
import { Header } from '../../components/Header';
import { Basket } from '../../components/Purchasing/Basket';
import { createOrder } from '../../redux/modules/purchasing/service';
import { SearchActions } from '../../redux/modules/search/actions';
import { fromJS } from 'immutable';
import { App } from '../App';
import { ContactCreateFormProfile } from '../../components/Company/Contacts/ContactCreateFormProfile';
import { push } from 'react-router-redux';
import { ILegalEntity } from '../../models/legalEntities';
import { InlineLoader } from '../../components/Misc/Loader/InlineLoader';
import { sendNotification } from '../../helpers/Notifications';
import { ContactForm } from '../../components/Forms/ContactForm';

export interface IOfferProps {
  passengers: IPassengersInfo;
  properties: ISearchProperties;
  search: ISearchState;
  basket: IProduct[];
  company: ICompany;
  me: IUser;
  location: any;
  selectPassengerProperty?: (property: string, value: any) => any;
  createOrder?: (
    basket: IProduct[],
    passengers: IUser[],
    legalEntities: ILegalEntity[],
    token: string,
    contactInfo: IUserBase,
  ) => any;
  sendNotification: (title: string, message?: string, type?: string) => any;
  redirect: (route: string) => any;
}
export interface IOfferState {
  users: IUser[];
  formsForAvia: number;
  newContact: boolean;
  legalEntities: ILegalEntity[];
  checkingForCorrectness: boolean;
  contactInfo: IUserBase;
  step: number;
  showErrors: boolean;
}
// const sampleUser = {
//   companyData: {
//     title: 'Carlson Duffy Plc',
//   },
//   address: {
//     zip: '420500',
//       country: 'RU',
//       city: 'Innopolis',
//       additional: 'Universitetskaya 1',
//   },
//   email: 'qybusod@mailinator.com',
//     first_name: 'Merrill',
//     last_name: 'Duran',
//     middle_name: 'Brynne Farmer',
//     phone_number: '+71231232112',
//     position: 'Dawson Bernard LLC',
// } as IUserBase;

const defaultState = {
  users: [],
  formsForAvia: 0,
  newContact: false,
  legalEntities: [],
  checkingForCorrectness: false,
  contactInfo: null,
  step: 1,
  showErrors: false,
};
@(connect(
  (state: IStore) => ({
    passengers: getPassengersOfType(state.getIn(['search', 'currentType']))(state),
    properties: getPropertiesOfType(state.getIn(['search', 'currentType']))(state),
    company: getUserCompany(state),
    search: state.get('search'),
    basket: getBasket(state),
    me: getUserData(state),
  }),
  (dispatch) => ({
    createOrder: (
      basket: IProduct[],
      passengers: IUser[],
      legalEntities: ILegalEntity[],
      token: string,
      contactInfo: IUserBase,
    ) => dispatch(createOrder(basket, passengers, legalEntities, token, contactInfo)),
    selectPassengerProperty: (property: string, value: any) =>
      dispatch(SearchActions.selectPassengerProperty(property, value)),
    sendNotification: (title: string, message?: string, type?: string) =>
      dispatch(sendNotification(title, message, type)),
    redirect: (route: string) => dispatch(push(route)),
  }),
) as any)
export class Offer extends React.Component<IOfferProps, IOfferState> {
  public readonly state: IOfferState = defaultState;

  constructor(props) {
    super(props);

    this.addUserForms = this.addUserForms.bind(this);
    this.addLegalEntity = this.addLegalEntity.bind(this);
    this.handleOrder = this.handleOrder.bind(this);
  }
  public componentDidMount() {
    this.updateUserCount(this.props);
    App.resetWebflow();
  }
  public componentWillReceiveProps(props: IOfferProps) {
    this.updateUserCount(props);
  }
  private updateUserCount(props: IOfferProps) {
    const max = { adults: 0, children: 0, childrenWithoutSeats: 0, businessClass: false };
    props.basket.forEach((product: IProduct) => {
      const passengers = product.value.passengers;
      if (product.value.passengers) {
        if (passengers.adults > max.adults) { max.adults = passengers.adults; }
        if (passengers.children > max.children) { max.children = passengers.children; }
        if (passengers.children_without_seats > max.childrenWithoutSeats) {
          max.childrenWithoutSeats = passengers.children_without_seats;
        }
        if (passengers.businessClass === true) { max.businessClass = true; }
        if (product.type === ProductType.TICKET_AVIA) {
          this.setState({formsForAvia: this.getTotal(fromJS(passengers))});
        }
      }
    });
    if (props.basket.length > 0) {
      props.selectPassengerProperty('adults', max.adults);
      props.selectPassengerProperty('children', max.children);
      props.selectPassengerProperty('children_without_seats', max.childrenWithoutSeats);
      props.selectPassengerProperty('businessClass', max.businessClass);
    }
  }

  private addUserForms(users: IUser[]) {
    this.setState({users: [...this.state.users, ...users].filter(this.onlyUnique)});
  }
  private addLegalEntity(legalEntities: ILegalEntity) {
    this.setState({legalEntities: [...this.state.legalEntities, legalEntities].filter(this.onlyUnique)});
  }
  private onlyUnique = (value, index, self) => {
    return self.indexOf(value) === index;
  }
  private getTotal(passengers: IPassengersInfo) {
    return Number(passengers.get('adults'))
      + Number(passengers.get('children'))
      + Number(passengers.get('children_without_seats'));
  }
  private handleOrder() {
    this.setState({checkingForCorrectness: true});
    $('html,body').animate({scrollTop: 0}, 'slow');
    this.props.createOrder(
      this.props.basket,
      this.state.users,
      this.state.legalEntities,
      localStorage.getItem('avt_token'),
      this.state.contactInfo,
    ).then((res) => {
      if (this.props.me && res) {
        $('.modal-success').show().fadeTo('fast', 1);
        $('.modal-success .modal-close').on('click', () => {
          $('.modal-success').fadeTo('fast', 0).hide();
        });
        setTimeout(() => {
          $('.modal-success').fadeTo('fast', 0).hide();
          localStorage.removeItem('basket');
          this.setState(defaultState);
          this.props.redirect('/profile');
        }, 5000);
      } else if (res) {
        const url = res;
        localStorage.removeItem('basket');
        this.setState(defaultState);
        window.location.href = url;
      } else {
        this.props.sendNotification('Что-то пошло не так, обратитесь к менеджеру');
      }
      // this.props.redirect('/profile');
    });
  }

  private generateEmptyForms(amount: number) {
    const users = [];
    for (let i = 0; i < amount; i++) {
      const id = -i - 1; // Negative for imaginary users
      users.push(fromJS({
        phone_number: '',
        first_name: '',
        last_name: '',
        middle_name: '',
        position: '',
        email: '',
        birthday: null,
        company_id: id,
        legal_entities: [],
        bonus_cards: [],
        documents: [{...defaultPassport, user_id: id}],
        id,
        gender: 'M',
        age_type: 'A',
      }));
    }

    return users;
  }
  private getValidationErrors() {
    const errors = [];
    this.state.users.forEach((user: IUser, i) => {
      const fullName = EmployeeSelectForm.getFullName(user).trim() || `Пассажир №${i + 1}`;
      const codes = {
        phone_number: `${fullName}: Введите номер телефона`,
        last_name: `${fullName}: Введите фамилию`,
        middle_name: `${fullName}: Введите отчество`,
        first_name: `${fullName}: Введите имя`,
        position: `${fullName}: Введите свою должность`,
      };
      for (const prop in codes) {
        if (user.get(prop) instanceof String && !user.get(prop).trim()) {
          errors.push(codes[prop]);
        }
      }
      if (user.get('documents').count() === 0) {
        errors.push(`${fullName}: Укажите как минимум один паспорт`);
      } else {
        const valid = user.get('documents').reduce((accumulator, current) => {
          return accumulator && !!current.get('number');
        }, true);
        if (!valid) {
          errors.push(`${fullName}: Заполните паспортные данные`);
        }
      }
      if (!user.get('birthday')) {
        errors.push(`${fullName}: Дата рождения не указана`);
      }
    });
    return errors;
  }

  public render() {
    const left = this.getTotal(this.props.passengers) - this.state.users.length;
    const errors = this.getValidationErrors();
    const isAllowedToView = (this.props.me && this.props.me.get('id')) || this.state.step === 2;
    return (
      <div>
        <main className="header" data-ix="fixed-nav">
          <Header />
        </main>
        <div className="section profile-section">
          <div className="container cart-container">
            <div className="ticket-bar w-clearfix">
              <a onClick={() => browserHistory.goBack()}
                 className="link-block left-link-block w-inline-block w-clearfix">
                <img src="/public/images/arrow-left-red.svg" width="30" className="link-icon"/>
                <div className="w-hidden-tiny">Назад</div>
              </a>
            </div>
            <div className="row ticket-row w-row">
              <div className="column w-col w-col-8 w-col-stack">
                {this.props.basket && this.props.basket.length > 0 ?
                  !this.state.checkingForCorrectness ?
                    isAllowedToView ? (
                      <div>
                        {this.props.company && (
                          <EmployeeSelectForm currentUsers={this.state.users} passengers={this.props.passengers}
                                              selectLimit={left}
                                              onLegalEntitiySelect={this.addLegalEntity}
                                              company={this.props.company} onAdd={this.addUserForms}/>
                        )}
                        {this.state.users.length > 0 && (
                          <div className="result-header w-clearfix">
                            <h3 className="h3 left-h3 margin-bottom-h3">Данные персон</h3>
                          </div>
                        )}
                        {this.state.users.map((user: IUser, i) => (
                          <ContactProfileTicket allowPreferences={this.state.formsForAvia > 0 && !!this.props.me}
                                                openPreferences={user.preferences}
                                                onEdit={(prop: string, value: any) => {
                                                  const newUsers = this.state.users.map((u: IUser) => {
                                                    return (u.get('id') === user.get('id'))
                                                      ? u.set(prop, value)
                                                      : u;
                                                  });
                                                  this.setState({
                                                    users: newUsers as IUser[],
                                                  });
                                                }}
                                                onDelete={() => {
                                                  this.setState({users: this.state.users.filter((u: IUser) =>
                                                      u.get('id') !== user.get('id'))});
                                                }}
                                                contact={user} myUserId={(this.props.me) ? this.props.me.get('id') : 0}
                                                id={user.get('id') + i} key={i} />
                        ))}
                        {this.state.newContact && (
                          <ContactCreateFormProfile legalEntities={
                                                      this.props.me
                                                        ? this.props.me.get('legal_entities')
                                                        : []
                                                    }
                                                    submitCallBack={(contact) => {
                                                      this.setState({
                                                        newContact: false,
                                                        users: [...this.state.users, contact,
                                                      ]});
                                                    }}
                                                    onDelete={() => this.setState({newContact: false})}
                                                    companyId={
                                                      this.props.company
                                                        ? this.props.company .get('id')
                                                        : -1
                                                    } />
                        )}
                        {left > 0 ? (
                          <div>
                            <div className="divider"/>
                            <a className="wide-button buy-button w-inline-block"
                               onClick={() => this.setState({newContact: true})}>
                              <img src="/public/images/user-white.svg" className="icon-more"/>
                              <div>
                                <strong>Добавить нового сотрудника</strong><br/>
                                <span>Для завершения, заполните данные ещё {left} сотрудников</span>
                              </div>
                            </a>
                          </div>
                        ) : (
                          <div>
                            {errors.length > 0 && this.state.showErrors && (
                              <ol className="validation-errors">
                                <p>Исправьте ошибки в профилях пользователей</p>
                                {errors.map((e, i) => <li key={i + e}>{e}</li>)}
                              </ol>
                            )}
                            <a className={cx('wide-button buy-button w-inline-block', {disabled: errors.length > 0})}
                               onClick={() => {
                                 this.setState({showErrors: true});
                                 if (errors.length === 0) {
                                   this.handleOrder();
                                 }
                               }}>
                              <img src="/public/images/cart-white.svg" className="icon-more"/>
                              <div>
                                <strong>Оформить заказ</strong><br/>
                                <span>
                                  {this.props.company
                                    ? `Для уточнения деталей с вами свяжется менеджер`
                                    : `Перейти к оплате`}
                                </span>
                              </div>
                            </a>
                          </div>
                        )}
                      </div>
                    ) : (
                      <ContactForm onSubmit={(user) => {
                        this.setState({contactInfo: user, step: 2, users: this.generateEmptyForms(left)});
                      }}/>
                    )
                  : (
                    <InlineLoader customTextStyle={{ marginLeft: '30px' }}
                                  customBlockStyle={{ maxWidth: '320px' }}
                                  dotUpdating={true} text="Мы подготавливаем ваш заказ к оплате"/>
                  )
                : (
                  <div>
                    <h3 className="red-h3 h3 h3-left">Ваша корзина пуста</h3>
                    <p className="p">Добавьте товаров, чтобы совершить заказ</p>
                  </div>
                )}

                {typeof window !== 'undefined' && window.innerWidth <= 991 && (
                  <div>
                    <div className="divider"/>
                    <div className="result-header w-clearfix">
                      <h3 className="h3 left-h3 margin-bottom-h3">Корзина</h3>
                    </div>
                    <Basket placement="bottom"/>
                  </div>
                )}
              </div>
              {/*tslint:disable:max-line-length*/}
              <div className="column cart-column w-hidden-medium w-hidden-small w-hidden-tiny w-col w-col-4 w-col-stack">
                <div className="result-header w-clearfix">
                  <h3 className="h3 left-h3 margin-bottom-h3">Корзина</h3>
                </div>
                <Basket placement="rightside"/>
              </div>

            </div>
          </div>
        </div>
      </div>
    );
  }
}
