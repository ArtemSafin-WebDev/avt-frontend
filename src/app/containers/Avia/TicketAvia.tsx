import * as React from 'react';
import * as moment from 'moment';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import { SearchBox } from '../../components/Misc/SearchBox/SearchBox';
import { Header } from '../../components/Header';
import { SearchActions } from '../../redux/modules/search/actions';
import { FlightDetails } from '../../components/Misc/Flights/FlightDetails';
import { Card } from '../../components/Landing/Card/Card';
import { IStore } from '../../redux/IStore';
import { getUserCompany } from '../../redux/modules/companies/selectors';
import { ICompany } from '../../models/companies';
import { emptyPassenger, IUser } from '../../models/users';
import { getUserData } from '../../redux/modules/users/selectors';
import {
  getCurrentEntry,
  getPassengersOfType,
  getPropertiesOfType,
  getTariffs,
} from '../../redux/modules/search/selectors';
import { IPassengersInfo } from '../../models/search/IPassengersInfo';
import { IFlightsInfo, ITicket } from '../../models/search/ISearchEntryAvia';
import { Loader } from '../../components/Misc/Loader/Loader';
import {
  actualizeRates,
  getAviaTicketDetails,
  getDestinationHints, getFlightTariffs,
  getHotelSearchResponse, getSearchResults,
} from '../../redux/modules/search/service';
import { ISearchProperties } from '../../models/search/ISearchProperties';
import { SearchType } from '../../models/search/SearchType';
import { IProduct, IProductValue, ProductType } from '../../models/purchasing/IProduct';
import { addProduct } from '../../redux/modules/purchasing/service';
import { IDestination } from '../../models/search/IDestination';
import { ISearchState } from '../../redux/modules/search/state';
import { getBasket } from '../../redux/modules/purchasing/selectors';
import { Basket } from '../../components/Purchasing/Basket';
import { PropertySelector } from '../../components/Misc/SearchBox/PropertySelector';
import { ISearchAction } from '../../models/search/ISearchAction';
import { ISearchPage } from '../../models/search/ISearchPage';
import { SimilarHotels } from '../../components/Hotel/SimilarHotels';
import { PaymentCriterion } from '../../models/search/ISearchFilters';
import { push } from 'react-router-redux';
import { App } from '../App';
import { FlightPlans } from '../../components/Misc/Flights/FlightPlans';
import { IFlightTariff } from '../../models/search/IFlightTariff';
import { InlineLoader } from '../../components/Misc/Loader/InlineLoader';

const config = require('../../../../config/main');

export interface ITicketAviaProps {
  ticket: ITicket;
  getTicket?: any;
  selectDate?: any;
  addToBasket?: any;
  actualizeRates?: any;
  searchDestinations?: any;
  selectDestination?: any;
  changeCurrentType?: any;
  getNearHotels?: any;
  getNearHotelsResults?: any;
  selectCurrentTicket?: any;
  selectResponseId?: (responseId: any) => any;
  getSearchResults?: (responseId: any, type: SearchType,
                      params: { offset?: number, limit?: number, payment?: PaymentCriterion }) => any;
  selectPassengerProperty?: (property: string, value: any) => any;
  getFlightTariffs: (segmentId: string) => any;
  selectCurrentTariff: (tariff: IFlightTariff) => any;
  redirect: (route: string) => any;
  passengers: IPassengersInfo;
  properties: ISearchProperties;
  params: any; // GET query params
  location: any; // GET query params
  search: ISearchState;
  basket: IProduct[];
  isAuthenticated: boolean;
  company: ICompany;
  me: IUser;
  tariffs: IFlightTariff[];
}

export interface ITicketAviaState {
  oneWay: boolean;
  users: IUser[];
  notFound: boolean;
}

@(connect(
  (state: IStore) => ({
    isAuthenticated: state.get('user').get('isAuthenticated'),
    passengers: getPassengersOfType('avia')(state),
    properties: getPropertiesOfType('avia')(state),
    basket: getBasket(state),
    ticket: getCurrentEntry(state),
    tariffs: getTariffs(state),
    search: state.get('search'),
    company: getUserCompany(state),
    me: getUserData(state),
  }),
  (dispatch) => ({
    selectCurrentTicket: (ticket: ITicket) =>
      dispatch(SearchActions.selectCurrentSearchEntry(ticket)),
    searchDestinations: (targetInput: string, partialQuery: string, token: string, type: SearchType) =>
      dispatch(getDestinationHints(targetInput, partialQuery, token, type)),
    selectDestination: (targetInput: string, destination: IDestination) =>
      dispatch(SearchActions.selectDestination(targetInput, destination)),
    getTicket: (requestId: string, segmentId: any, oneWay: boolean) =>
      dispatch(getAviaTicketDetails(requestId, segmentId, oneWay)),
    selectDate: (targetInput: string, date: Date) =>
      dispatch(SearchActions.selectDate(targetInput, date)),
    changeCurrentType: (newType: SearchType) =>
      dispatch(SearchActions.changeCurrentType(newType)),
    actualizeRates: (hotelId: string, properties: ISearchProperties, passengers: IPassengersInfo) =>
      dispatch(actualizeRates(hotelId, properties, passengers)),
    addToBasket: (basket: IProduct[], type: ProductType, value: any, note?: string) =>
      dispatch(addProduct(basket, type, value, note)),
    getNearHotels: (searchParams: ISearchPage, currentType: SearchType) =>
      dispatch(getHotelSearchResponse(searchParams, currentType)),
    getNearHotelsResults: (responseId: any, currentType: SearchType) =>
      dispatch(getSearchResults(responseId, currentType, { offset: 0, limit: 15 })),
    selectResponseId: (responseId: any) =>
      dispatch(SearchActions.selectResponseId(responseId)),
    getFlightTariffs: (segmentId: string) => dispatch(getFlightTariffs(segmentId)),
    getSearchResults: (responseId: any, type: SearchType,
                       params: { offset?: number, limit?: number, payment?: PaymentCriterion }) =>
      dispatch(getSearchResults(responseId, type, params)),
    selectPassengerProperty: (property: string, value: any) =>
      dispatch(SearchActions.selectPassengerProperty(property, value)),
    selectCurrentTariff: (tariff: IFlightTariff) =>
      dispatch(SearchActions.selectCurrentTariff(tariff)),
    redirect: (route: string) => dispatch(dispatch(push(route))),
  }),
) as any)
export class TicketAvia extends React.Component<ITicketAviaProps, ITicketAviaState> {
  public readonly state: ITicketAviaState = {
    oneWay: false,
    users: [],
    notFound: false,
  };

  constructor(props: ITicketAviaProps) {
    super(props);
    if (!props.ticket) {
      this.props.changeCurrentType(SearchType.Avia);
    } else {
      const flight = props.ticket.firstDirection.flights_info[ props.ticket.firstDirection.flights_info.length - 1 ];
      this.getNearestHotels(flight);
    }
    this.addUserForms = this.addUserForms.bind(this);
  }

  public componentDidMount() {
    if (this.state.users.length === 0 && !this.props.company) {
      const count = this.getTotal();
      this.addUserForms(Array.from({ length: count }, () => emptyPassenger));
    }
    const destination: string = this.props.params.destination;
    const hotelResponseId: string = this.props.location.search.replace('?hotelResponseId=', '');
    if (destination) {
      // Destination in format MOW1404KZN1504-210e-XXXXXX
      const rex = /^([A-Z]{3})(\d{4})([A-Z]{3})(\d{4})?-(\d)(\d)(\d)(\w)[-]?(.+)?/;
      const parts = rex.exec(destination);

      if (parts && parts.length >= 9) {
        if (!this.props.search.getIn([ 'avia', 'properties', 'departure_point' ])) {
          this.getCityFromCode('from', parts[ 1 ]);
          this.getCityFromCode('to', parts[ 3 ]);
        }
        this.props.selectDate('from', TicketAvia.stringToDate(parts[ 2 ]));
        if (parts[ 4 ] !== '0000') {
          this.props.selectDate('to', TicketAvia.stringToDate(parts[ 4 ]));
        } else {
          this.setState({ oneWay: true });
        }
        this.props.selectPassengerProperty('adults', Number(parts[ 5 ]));
        this.props.selectPassengerProperty('children', Number(parts[ 6 ]));
        this.props.selectPassengerProperty('children_without_seats', Number(parts[ 7 ]));
        this.props.selectPassengerProperty('businessClass', parts[ 8 ].toLowerCase() === 'b');

        if (parts.length > 9) {
          const responseId = parts[ 9 ];
          if (responseId) {
            this.props.selectResponseId(responseId);
            this.props.getTicket(responseId, this.props.params.id, parts[ 4 ] === '0000')
              .then((ticket: ITicket) => {
                if (ticket && ticket.firstDirection && ticket.firstDirection.flights_info) {
                  const flight = ticket.firstDirection.flights_info[ ticket.firstDirection.flights_info.length - 1 ];
                  this.props.getFlightTariffs(this.props.params.id).then((tariffs) => {
                    if (tariffs instanceof Array && tariffs.length > 0) {
                      this.props.selectCurrentTariff(tariffs[0]);
                    }
                  });
                  this.getNearestHotels(flight, hotelResponseId);
                } else {
                  this.setState({notFound: true});
                }
              });
          }
        } else {
          this.props.redirect('/');
        }
      }
    } else if (this.props.ticket) {
      const { ticket } = this.props;
      const flight = ticket.firstDirection.flights_info[ ticket.firstDirection.flights_info.length - 1 ];
      this.getNearestHotels(flight, hotelResponseId);
    }
    /* else {
          this.props.redirect('/');
        }*/
  }

  public static stringToDate(str: string) {
    const currentYear = new Date().getFullYear();
    let date;
    // Month -1: Jan = 0
    if (str && str.length === 4) {
      date = new Date(currentYear, Number(str.slice(2, 4)) - 1, Number(str.slice(0, 2)));
    }
    if (str && moment(date).isBefore(moment().subtract(1, 'day'))) {
      date = new Date(currentYear + 1, Number(str.slice(2, 4)) - 1, Number(str.slice(0, 2)));
    }
    return date;
  }

  private getCityFromCode(targetInput: string, code: string) {
    this.props.searchDestinations(targetInput, code, '').then((res) => {
      if (res.payload.destinations && res.payload.destinations.length > 0) {
        const newAirport = res.payload.destinations[ 0 ];
        this.props.selectDestination(targetInput, newAirport as IDestination);
      }
    }).catch((e) => {
      console.log(e);
    });
  }

  private getNearestHotels(flight: IFlightsInfo, hotelResponseId?: string) {
    if (!hotelResponseId) {
      this.props.searchDestinations('hotelsNear', flight.arrival_city, '', SearchType.Hotel).then((res) => {
        if (res.payload.destinations && res.payload.destinations.length > 0) {
          this.props.selectDestination('hotelsNear', res.payload.destinations[ 0 ] as IDestination);
          this.props.selectDestination('to', res.payload.destinations[ 0 ].set('code', flight.arrival_airport));
          this.props.getNearHotels(
            this.props.search.get('avia').setIn([ 'properties', 'departure_point' ], res.payload.destinations[ 0 ]),
            SearchType.Hotel,
          ).then((action: ISearchAction) => {
            if (action && action.payload.responseId) {
              this.props.getNearHotelsResults(action.payload.responseId, SearchType.Hotel);
            }
          }).catch((e) => console.log(e));
        }
      });
    } else {
      this.props.getNearHotelsResults(hotelResponseId, SearchType.Hotel);
    }
  }

  private addTicketToBasket(ticket: ITicket) {
    this.props.addToBasket(
      this.props.basket,
      ProductType.TICKET_AVIA,
      this.getNecessaryInfo(ticket),
      PropertySelector.renderString(this.props.passengers)
      + (this.props.passengers.get('businessClass') ? ', бизнес' : ', эконом'),
    );
  }

  private getNecessaryInfo(ticket: ITicket): IProductValue {
    let tariff = '';
    if (ticket.tariff) {
      tariff = `${ticket.tariff.name} (${ticket.tariff.route})`;
    }
    const obj = {
      id: 'ticket-avia',
      buy_id: ticket.id,
      responseId: ticket.responseId,
      directions: [],
      expiration: moment().add(config.productExpiration.avia, 'minutes').toDate(),
      link: location.pathname + location.search,
      price: ticket.tariff ? ticket.tariff.price.total_amount : ticket.price,
      tariff,
      passengers: this.props.passengers.toJS(),
    } as IProductValue;
    obj.directions.push({
      id: ticket.id,
      title: `${ticket.firstDirection.flights_info[ 0 ].departure_airport} — `
        + `${ticket.firstDirection.flights_info[ ticket.firstDirection.flights_info.length - 1 ].arrival_airport}`,
      titleExtended: `${ticket.firstDirection.flights_info[ 0 ].departure_city} — `
        + `${ticket.firstDirection.flights_info[ ticket.firstDirection.flights_info.length - 1 ].arrival_city}`,
      dates: `${moment(ticket.firstDirection.departure_timestamp * 1000).format('LL')}, `
        + ticket.firstDirection.flights_info[ 0 ].departure_local_time,
    });
    obj.departure_date = new Date(ticket.firstDirection.departure_timestamp * 1000);
    if (ticket.secondDirection) {
      obj.directions.push({
        id: ticket.id,
        title: `${ticket.secondDirection.flights_info[ 0 ].departure_airport} — `
          + `${ticket.secondDirection.flights_info[ ticket.secondDirection.flights_info.length - 1 ].arrival_airport}`,
        titleExtended: `${ticket.secondDirection.flights_info[ 0 ].departure_city} — `
          + `${ticket.secondDirection.flights_info[ ticket.secondDirection.flights_info.length - 1 ].arrival_city}`,
        dates: `${moment(ticket.secondDirection.departure_timestamp * 1000).format('LL')}, `
          + ticket.secondDirection.flights_info[ 0 ].departure_local_time,
      });
      obj.arrival_date = new Date(ticket.secondDirection.arrival_timestamp * 1000);
    } else {
      obj.arrival_date = new Date(ticket.firstDirection.arrival_timestamp * 1000);
    }
    return obj;
  }

  private getTotal() {
    return this.props.passengers.get('adults')
      + this.props.passengers.get('children')
      + this.props.passengers.get('children_without_seats');
  }

  public componentWillReceiveProps(nextProps: ITicketAviaProps) {
    if (nextProps.company) {
      // Reset list for authenticated users
      this.addUserForms([]);
    }
  }

  public componentWillUpdate() {
    App.resetWebflow();
  }

  private addUserForms(users: IUser[]) {
    this.setState({ users });
  }

  private addExtraItem(value: IProductValue, note: string = '') {
    this.props.addToBasket(this.props.basket, ProductType.EXTRA_ITEM, value, note);
  }

  public render() {
    const { oneWay } = this.state;
    const allHotels = this.props.search.getIn([ 'results', 'hotel' ]);
    return (
      <div>
        <main className="header" data-ix="fixed-nav">
          <Header/>
          <div className="container margin-top-container">
            <SearchBox showMenu={true} key="fixed" aviaOneWay={oneWay}/>
          </div>
        </main>
        {this.props.ticket ? (
          <div className="section search-section">
            <div className="container cart-container">
              <div className="ticket-bar w-clearfix">
                <a style={{ opacity: 0 }} className="link-block left-link-block w-inline-block w-clearfix"
                   data-ix="link-icon" onClick={() => browserHistory.goBack()}>
                  <img src="/public/images/arrow-left-red.svg" width="30" className="link-icon"/>
                  <div className="w-hidden-tiny">Назад к билетам</div>
                </a>
              </div>
              <div className="row ticket-row w-row">
                <div className="column w-col w-col-8 w-col-stack">
                  {/*TODO to and from*/}
                  <FlightDetails ticket={this.props.ticket}/>
                  <FlightPlans tariffs={this.props.tariffs} onSelect={this.props.selectCurrentTariff}/>
                  {this.props.tariffs && this.props.tariffs.length > 0 ? (
                    <a className="wide-button buy-button w-inline-block"
                       onClick={() => this.addTicketToBasket(this.props.ticket)}>
                      <img src="/public/images/cart-white.svg" className="icon-more"/>
                      <div>
                        <strong>Добавить в корзину</strong><br/>
                        <span>за {this.props.ticket.tariff
                          ? this.props.ticket.tariff.price.total_amount
                          : this.props.ticket.price} ₽</span>
                      </div>
                    </a>
                  ) : (
                    <InlineLoader customTextStyle={{ marginLeft: '30px' }}
                                  customBlockStyle={{ maxWidth: '320px' }}
                                  dotUpdating={true} text="Загружаем тарифы"/>
                  )}
                  <div className="divider"/>

                  <SimilarHotels hotels={allHotels}
                                 cityName={this.props.ticket.firstDirection.flights_info
                                   [ this.props.ticket.firstDirection.flights_info.length - 1 ].arrival_city}
                                 responseId={this.props.search.get('responseId')}
                                 properties={this.props.properties.set(
                                   'departure_point',
                                   this.props.properties.get('arrival_point'),
                                 ) as ISearchProperties}
                                 passengers={this.props.passengers}
                                 currentHotel={0}/>

                  <div className="result-header w-clearfix">
                    <h3 className="h3 left-h3">Трансфер до отеля и аэропорта</h3>
                    <div className="p-big left-p-big">
                      Закажем любое транспортное средство от автомобиля до самолета
                    </div>
                  </div>
                  <div className="result-additional">
                    <div className="row flex-row w-clearfix">
                      <div className="column-50">
                        <Card data-w-id="189fa234-af35-be28-e546-6fa9d6758400"
                              title="Эконом-класс"
                              additionalClasses="margin-bottom-card"
                              size=""
                              actionIconURL="empty"
                              actionURL="#addToCart" actionText="Добавить в корзину"
                              onClick={() => this.addExtraItem({
                                id: this.props.ticket.id + '_transfer',
                                name: 'Трансфер (Эконом-класс)',
                                price: -1,
                              }, 'Эконом-класс')}/>
                      </div>
                      <div className="column-50">
                        <Card data-w-id="943624f4-6e6c-5472-ffb8-7d1de06abbb2"
                              title="Бизнес-класс"
                              additionalClasses="margin-bottom-card"
                              size=""
                              actionIconURL="empty"
                              actionURL="#addToCart" actionText="Добавить в корзину"
                              onClick={() => this.addExtraItem({
                                id: this.props.ticket.id + '_transfer',
                                name: 'Трансфер (Бизнес-класс)',
                                price: -1,
                              }, 'Бизнес-класс')}/>
                      </div>
                    </div>
                  </div>
                  <div className="result-header w-clearfix">
                    <h3 className="h3 left-h3">Дополнительные услуги</h3>
                    <div className="p-big left-p-big">
                      Выберите услугу, а детали поможет уточнить менеджер AVT
                    </div>
                  </div>
                  <div className="result-additional">
                    <div className="row flex-row w-clearfix">
                      <div className="column-50">
                        <Card data-w-id="189fa234-af35-be28-e546-6fa9d6758400"
                              title="Страхование"
                              additionalClasses="margin-bottom-card"
                              size=""
                              actionIconURL="empty"
                              actionURL="#addToCart" actionText="Добавить в корзину"
                              onClick={() => this.addExtraItem({
                                id: 'assurance',
                                name: 'Страхование',
                                price: -1,
                              })}
                        />
                      </div>
                      <div className="column-50">
                        <Card data-w-id="943624f4-6e6c-5472-ffb8-7d1de06abbb2"
                              title="Fast Track"
                              additionalClasses="margin-bottom-card"
                              size=""
                              actionIconURL="empty"
                              actionURL="#addToCart" actionText="Добавить в корзину"
                              onClick={() => this.addExtraItem({
                                id: 'fast_track',
                                name: 'Fast Track',
                                price: -1,
                              })}
                        />
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="divider"/>
                    <div className="result-header w-clearfix">
                      <h3 className="h3 left-h3 margin-bottom-h3">Корзина</h3>
                    </div>
                    <Basket placement="bottom"/>
                  </div>
                </div>
                {/*tslint:disable-next-line*/}
                <div className="column cart-column w-hidden-medium w-hidden-small w-hidden-tiny w-col w-col-4 w-col-stack">
                  <div className="result-header w-clearfix">
                    <h3 className="h3 left-h3 margin-bottom-h3">Корзина</h3>
                  </div>
                  <Basket placement="rightside"/>
                </div>
              </div>
            </div>
          </div>
        ) : (this.state.notFound) ? (
          <div className="not-found-suggestions flight-not-found" style={{display: 'block'}}>
            <img src="/public/images/404-img.svg"/>
            <h3 className="red-h3">Ничего не найдено</h3>
            <p className="p">
              Не удалось найти этот рейс, возможно он устарел и был удалён, либо никогда не существовал.
              Вы можете перейти к поиску и попробовать найти актуальные билеты.
            </p>
          </div>
        ) : (
          <Loader/>
        )}
      </div>
    );
  }
}
