import * as React from 'react';
import { IStore } from '../../redux/IStore';
import { connect } from 'react-redux';
import { Header } from '../../components/Header/index';
import { getError, getLoadingStatus, getUserCompany, getMessages } from '../../redux/modules/companies/selectors';
import { SignInForm } from '../../components/Modals/SignInModal/SignInForm';
import { Loader } from '../../components/Misc/Loader/Loader';
import { LegalEntityProfile } from '../../components/Company/LegalEntities/LegalEntityProfile';
import { ContactProfile } from '../../components/Company/Contacts/ContactProfile';
import { userLogout } from '../../redux/modules/users/service';
import { ContactCreateFormProfile } from '../../components/Company/Contacts/ContactCreateFormProfile';
import { ActionCreator } from 'redux';
import { ICompanyAction } from '../../models/companies';
import { ICompanyState } from '../../redux/modules/companies/state';
import { IUserState } from '../../redux/modules/users/state';
import { Link } from 'react-router';
import { List, Map } from 'immutable';
import { sendNotification } from '../../helpers/Notifications';
import { push } from 'react-router-redux';
import { App } from '../App';
import { getOrders } from '../../redux/modules/purchasing/service';
import { IOrder } from '../../models/purchasing/IOrder';
import { OrderProfile } from '../../components/Purchasing/OrderProfile';
import { IUser } from '../../models/users';

export interface IProfileProps {
  company: ICompanyState;
  user: IUserState;
  isFetching: boolean;
  error: boolean;
  message: Map<string, any>;
  addNewContact?: ActionCreator<ICompanyAction>;
  redirect?: ActionCreator<{location: string}>;
  sendNotification?: ActionCreator<{title: string, message?: string}>;
  logout?: ActionCreator<ICompanyAction>;
  getOrders: (token: string) => any;
}
export interface IProfileState {
  newContact: boolean;
  orders: IOrder[];
}
@(connect(
  (state: IStore) => ({
    user: state.get('user'),
    company: getUserCompany(state),
    isFetching: getLoadingStatus(state),
    error: getError(state),
    message: getMessages(state),
  }),
  (dispatch) => ({
    redirect: (location: string) => dispatch(push(location)),
    sendNotification: (title: string, message?: string) => dispatch(sendNotification(title, message)),
    getOrders: (token: string) => dispatch(getOrders(token)),
    logout: () => dispatch(userLogout()),
  }),
) as any)
export class Profile extends React.Component<IProfileProps, IProfileState> {
  public readonly state: IProfileState = {
    newContact: false,
    orders: [],
  };
  constructor(props) {
    super(props);
    this.openNewContactForm = this.openNewContactForm.bind(this);
    this.closeNewContactForm = this.closeNewContactForm.bind(this);
    this.userLogout = this.userLogout.bind(this);
  }

  public userLogout() {
    this.props.logout();
  }
  public componentDidMount() {
    App.resetWebflow();
    this.props.getOrders(localStorage.getItem('avt_token')).then((orders: IOrder[]) => {
      this.setState({
        orders: orders.sort((orderA, orderB) => {
          return orderA.id - orderB.id;
        }),
      });
    });
  }
  private openNewContactForm() {
    this.setState({newContact: true});
  }
  private closeNewContactForm() {
    this.setState({newContact: false});
    App.resetWebflow();
  }
  public render() {
    if (typeof this.props.company !== 'undefined' && typeof this.props.user !== 'undefined') {
      const contactEntries = this.props.company.get('legal_entities').reduce((accumulator, current) => {
        return accumulator.concat(current.get('users'));
      }, List<IUser>([]));
      const contacts = contactEntries.sort((a, b) => {
        // true values first
        return (a.is_active === b.is_active);
      }).map((user, i) => (
        <ContactProfile key={`${user.get('id')}_${i}`} id={++i}
                        userId={this.props.user.get('userData').get('id')} contact={user}/>
      ));
      const legalEntities = this.props.company.get('legal_entities').map((legalEntity, i) => {
        return (
          <LegalEntityProfile key={`${legalEntity.get('id')}_${i}`} id={++i} legalEntity={legalEntity}/>
        );
      });
      return this.props.user.get('userData') ? (
        <div>
          <main className="header" data-ix="fixed-nav">
            <Header />
          </main>
          <div className="section profile-section">
            <div className="container cart-container">
              <div className="ticket-bar w-clearfix">
                <Link to={'/'} className="link-block left-link-block w-inline-block w-clearfix"
                   data-ix="link-icon">
                  <img src="/public/images/arrow-left-red.svg" width="30" className="link-icon"/>
                  <div className="w-hidden-tiny">Назад</div>
                </Link>
              </div>
              <div className="row ticket-row w-row">
                <div className="column w-col w-col-8 w-col-stack">
                  <div className="div-block-5 w-clearfix">
                    <div className="company-name w-clearfix">
                      <div>{this.props.company.get('title')}</div>
                    </div>
                  </div>
                  <div className="result-header w-clearfix">
                    <h3 className="h3 left-h3 margin-bottom-h3">{
                      this.props.user.get('userData').get('last_name') + ' '
                      + this.props.user.get('userData').get('first_name') + ' '
                      + this.props.user.get('userData').get('middle_name')
                    }</h3>
                    <Link to="/" className="link-block left-link-block w-inline-block w-clearfix"
                       data-ix="link-icon" onClick={this.userLogout}>
                      <img src="/public/images/exit-red.svg" width="30" className="link-icon"/>
                      <div className="w-hidden-tiny">Выйти</div>
                    </Link>
                  </div>
                  <div data-duration-in="300" data-duration-out="100" className="profiletabs w-tabs">
                    <div className="profiletabs-menu w-tab-menu">
                      <a data-w-tab="Orders" className="profiletabs-link w-inline-block w-tab-link w--current">
                        <div>Заказы</div>
                      </a>
                      <a data-w-tab="Workers" className="profiletabs-link w-inline-block w-tab-link">
                        <div>Сотрудники</div>
                      </a>
                      <a data-w-tab="Requisites" className="profiletabs-link w-inline-block w-tab-link">
                        <div>Реквизиты</div>
                      </a>
                    </div>
                    <div className="profiletabs-content w-tab-content">
                      <div data-w-tab="Orders" className="profiletabs-tab w-tab-pane w--tab-active">
                        {this.state.orders && this.state.orders.length > 0 ? (
                          this.state.orders.sort(
                            (a, b) => new Date(b.created_date).getTime() - new Date(a.created_date).getTime(),
                          ).map((order: IOrder) => (
                            <OrderProfile key={order.id} order={order}
                                          users={contactEntries}
                                          legalEntities={this.props.company.get('legal_entities')}/>
                          ))
                        ) : (
                          <h3>Здесь пока ничего нет :(</h3>
                        )}
                      </div>
                      <div data-w-tab="Workers" className="profiletabs-tab w-tab-pane">
                        <a href="#" className="add-button w-inline-block" onClick={this.openNewContactForm} >
                          <img src="/public/images/plus-red.svg" className="icon-more"/>
                          <div>Добавить сотрудника</div>
                        </a>
                        {this.state.newContact && (
                          <ContactCreateFormProfile submitCallBack={this.closeNewContactForm}
                              legalEntities={this.props.user.getIn(['userData', 'legal_entities'])}
                              companyId={this.props.company.get('id')} />
                        )}
                        {contacts}
                      </div>
                      <div data-w-tab="Requisites" className="profiletabs-tab w-tab-pane">
                        {legalEntities}
                      </div>
                    </div>
                  </div>
                </div>
                {/*tslint:disable:max-line-length*/}
                <div className="column cart-column w-hidden-medium w-hidden-small w-hidden-tiny w-col w-col-4 w-col-stack"/>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <h1>Доступ запрещен!</h1>
      );
    } else {
      if (!this.props.user.get('isAuthenticated') && !this.props.user.get('isFetching')) {
        return (
          <div style={{ maxWidth: '540px', padding: '40px 60px',
            margin: '10% auto 0', position: 'relative', zIndex: 10000 }}>
            <SignInForm current={true} selectOther={null} />
          </div>
        );
      } else {
        if (this.props.error) {
          this.props.message.forEach((message) => {
            this.props.sendNotification(message.toString());
            this.props.redirect('/');
          });
        }
        return (<Loader />);
      }
    }
  }
}
