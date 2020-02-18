// tslint:disable
import * as React from 'react';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import { SearchBox } from '../../components/Misc/SearchBox/SearchBox';
import { Header } from '../../components/Header';
import { Card } from '../../components/Landing/Card/Card';
import { IStore } from '../../redux/IStore';
import {
  getCurrentEntry,
  getCurrentEntryPrice,
  getPassengersOfType,
  getPropertiesOfType,
} from '../../redux/modules/search/selectors';
import { IPassengersInfo } from '../../models/search/IPassengersInfo';
import { HotelDetails } from '../../components/Misc/Hotels/HotelDetails';
import {
  actualizeRates,
  getDestinationHints,
  getHotelDetails, getHotelSearchResponse, getSearchResults,
} from '../../redux/modules/search/service';
import { ISearchState } from '../../redux/modules/search/state';
import { Loader } from '../../components/Misc/Loader/Loader';
import { IHotel, IImage, IPrice } from '../../models/search/ISearchEntryHotel';
import { SearchActions } from '../../redux/modules/search/actions';
import { ISearchProperties } from '../../models/search/ISearchProperties';
import { SearchType } from '../../models/search/SearchType';
import { Basket } from '../../components/Purchasing/Basket';
import { IProduct, IProductValue, ProductType } from '../../models/purchasing/IProduct';
import { addProduct } from '../../redux/modules/purchasing/service';
import { getBasket } from '../../redux/modules/purchasing/selectors';
import { IDestination } from '../../models/search/IDestination';
import { Footer } from '../../components/Footer/Footer';
import { SimilarHotels } from '../../components/Hotel/SimilarHotels';
import { parseQueryParams } from '../../helpers/HttpHelpers';
import { ISearchProps } from '../Search/SearchHotel';
import { ISearchPage } from '../../models/search/ISearchPage';
import { ISearchFilters } from '../../models/search/ISearchFilters';
import { fromJS } from 'immutable';
import { push } from 'react-router-redux';
import { App } from '../App';
import { TicketAvia } from '../Avia/TicketAvia';

export interface IHotelProps {
  getHotel?: any;
  selectDate?: any;
  actualizeRates?: any;
  searchDestinations?: any;
  selectCurrentHotel?: any;
  selectDestination?: any;
  changeCurrentType?: any;
  addToBasket: (basket: IProduct[], type: ProductType, value: any, note?: string) => any;
  selectPassengerProperty: (property: string, value: any) => any;
  getNearHotels?: (searchParams: ISearchPage, currentType: SearchType) => any;
  getNearHotelsResults?: (responseId: any, type: SearchType, offset: number, filters: ISearchFilters) => any;
  passengers: IPassengersInfo;
  properties: ISearchProperties;
  params: any; // URL params
  location: any; // Query params
  search: ISearchState;
  hotel: IHotel;
  basket: IProduct[];
  price: IPrice;
  isAuthenticated: boolean;
  redirect: (route: string) => any;
}
export interface IHotelState {
}
@(connect(
  (state: IStore) => ({
    isAuthenticated: state.get('user').get('isAuthenticated'),
    passengers: getPassengersOfType('hotel')(state),
    properties: getPropertiesOfType('hotel')(state),
    search: state.get('search'),
    hotel: getCurrentEntry(state),
    basket: getBasket(state),
    price: getCurrentEntryPrice(state),
  }),
  (dispatch) => ({
    searchDestinations: (targetInput: string, partialQuery: string, token: string) =>
      dispatch(getDestinationHints(targetInput, partialQuery, token, SearchType.Hotel)),
    selectDestination: (targetInput: string, destination: IDestination) =>
      dispatch(SearchActions.selectDestination(targetInput, destination)),
    getHotel: (hotelId: string) =>
      dispatch(getHotelDetails(hotelId)),
    selectDate: (targetInput: string, date: Date) =>
      dispatch(SearchActions.selectDate(targetInput, date)),
    changeCurrentType: (newType: SearchType) =>
      dispatch(SearchActions.changeCurrentType(newType)),
    selectCurrentHotel: (ticket: any) =>
      dispatch(SearchActions.selectCurrentSearchEntry(ticket)),
    selectPassengerProperty: (property: string, value: any) =>
      dispatch(SearchActions.selectPassengerProperty(property, value)),
    getNearHotels: (searchParams: ISearchPage, currentType: SearchType) =>
      dispatch(getHotelSearchResponse(searchParams, currentType)),
    getNearHotelsResults: (responseId: any, type: SearchType, offset: number, filters: ISearchFilters) =>
      dispatch(getSearchResults(responseId, type, {offset, limit: 15, filters})),
    actualizeRates: (hotelId: string, properties: ISearchProperties, passengers: IPassengersInfo) =>
      dispatch(actualizeRates(hotelId, properties, passengers)),
    addToBasket: (basket: IProduct[], type: ProductType, value: any, note?: string) =>
      dispatch(addProduct(basket, type, value, note)),
    redirect: (route: string) => dispatch(dispatch(push(route))),
  }),
) as any)
export class Hotel extends React.Component<IHotelProps, IHotelState> {
  public readonly state: IHotelState = {
    users: [],
  };

  constructor(props) {
    super(props);
    const params = parseQueryParams(this.props.location.search) as ISearchProps;
    this.props.changeCurrentType(SearchType.Hotel);
    if (params.checkin) { this.props.selectDate('from', TicketAvia.stringToDate(params.checkin)); }
    if (params.checkout) { this.props.selectDate('to', TicketAvia.stringToDate(params.checkout)); }
    if (params.adults) { this.props.selectPassengerProperty('adults', Number(params.adults)); }
    if (params.children && params.children.length > 0) {
      const splitted = params.children.split(',');
      this.props.selectPassengerProperty(
        'children_of_year',
        fromJS(splitted.map((el) => Number(el))),
      );
      this.props.selectPassengerProperty('children', splitted.length);
    }
    this.props.getHotel(this.props.params.id).then((hotel: IHotel) => {
      if (hotel && hotel.city) {
        this.props.searchDestinations('from', hotel.city, '').then((res) => {
          if (res.payload.destinations && res.payload.destinations.length > 0) {
            this.props.selectDestination('from', res.payload.destinations[ 0 ] as IDestination);
            this.props.actualizeRates(this.props.params.id, this.props.properties, this.props.passengers);
          }
        });
      }
    });

    if (params.responseId) {
      this.props.getNearHotelsResults(params.responseId, SearchType.Hotel,
        params.offset, this.props.search.get(`filters`)).then((res) => {
          if (res.data instanceof Array && res.data.length > params.index) {
            const hotel = res.data[params.index];
            this.actualizeData(hotel);
          }
      });
    }
  }
  private actualizeData(hotel) {
    if (hotel) {
      this.props.searchDestinations('from', hotel.city, '').then((res) => {
        if (res.payload.destinations && res.payload.destinations.length > 0) {
          this.props.selectDestination('from', res.payload.destinations[0] as IDestination);
          this.props.actualizeRates(this.props.params.id, this.props.properties, this.props.passengers);
        }
      });
    }
  }
  private addExtraItem(value: IProductValue, note: string = '') {
    this.props.addToBasket(this.props.basket, ProductType.EXTRA_ITEM, value, note);
  }

  public static mod = (n, m) => {
    // Fixes the bug with % modulo operator in JS
    // Look: https://stackoverflow.com/questions/4467539/javascript-modulo-gives-a-negative-result-for-negative-numbers
    return ((n % m) + m) % m;
  }
  public componentWillUpdate() {
    App.resetWebflow();
  }

  public render() {
    const hotel = this.props.hotel;
    const checkin = this.props.properties.get('departure_date');
    const checkout = this.props.properties.get('arrival_date');
    const isFetching = this.props.search.get('isFetching') && !this.props.search.get('error');
    const resultsReady = hotel && hotel.id && this.props.price;
    const allHotels = this.props.search.getIn(['results', 'hotel']);
    const shouldBeUpdated = this.props.search.get('shouldBeUpdated');
    if (hotel && typeof(hotel.images) === 'string') {
      hotel.images = JSON.parse((hotel.images as string).replace('\'', '"')) as IImage[];
    }
    return (
      <div id="hotel">
        <main className="header" data-ix="fixed-nav">
          <Header/>
          <div className="container margin-top-container">
            <SearchBox showMenu={true} key="fixed"/>
          </div>
        </main>
        <div className="section search-section">
          <div className="container cart-container">
            <div className="ticket-bar w-clearfix">
              <a style={{opacity: 0}} className="link-block left-link-block w-inline-block w-clearfix"
                 data-ix="link-icon" onClick={() => browserHistory.goBack()}>
                <img src="/public/images/arrow-left-red.svg" width="30" className="link-icon"/>
                <div className="w-hidden-tiny">Назад к отелям</div>
              </a>
            </div>
            <div className="row ticket-row w-row">
              <div className="column w-col w-col-8 w-col-stack">
                {/*TODO to and from*/}
                {!resultsReady ? (
                  <Loader hasOverLay={true}
                          customSpinnerStyle={{ position: 'absolute' }}
                          customOverlayStyle={{ position: 'absolute' }}/>
                ) : (
                  <div>
                    {!hotel ? (
                      <div className="search-fail">
                        <h3 className="h3">Ничего не найдено</h3>
                        <div className="p p-ui">Попробуйте изменить параметры поиска или
                          <a className="span-link open-lead-modal">спросить у нас напрямую</a></div>
                      </div>
                    ) : (
                      <div>
                        <HotelDetails hotel={hotel} price={this.props.price} addToBasket={this.props.addToBasket}
                                      checkin={checkin} checkout={checkout} basket={this.props.basket}
                                      passengers={this.props.passengers}/>
                        <div className="divider"/>
                        {allHotels.length > 1 && (
                          <SimilarHotels hotels={allHotels}
                                         cityName={this.props.hotel.city}
                                         responseId={this.props.search.get('responseId')}
                                         properties={this.props.properties}
                                         passengers={this.props.passengers}
                                         currentHotel={allHotels.findIndex((h: IHotel) => h.id === hotel.id)}/>
                        )}

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
                                      id: this.props.hotel.id + '_transfer',
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
                                      id: this.props.hotel.id + '_transfer',
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
                      </div>
                    )}
                  </div>
                )}
                {!isFetching && resultsReady && !shouldBeUpdated && (
                  <div>
                    <div className="divider"/>
                    <div className="result-header w-clearfix">
                      <h3 className="h3 left-h3 margin-bottom-h3">Корзина</h3>
                    </div>
                    <Basket placement="bottom"/>
                  </div>
                )}
              </div>
              {/*tslint:disable-next-line*/}
              {hotel && (
                <div className="column cart-column w-hidden-medium w-hidden-small w-hidden-tiny w-col w-col-4 w-col-stack">
                  <div className="result-header w-clearfix">
                    <h3 className="h3 left-h3 margin-bottom-h3">Корзина</h3>
                  </div>
                  <Basket placement="rightside"/>
                </div>
              )}
            </div>
          </div>
        </div>
        <Footer/>
      </div>
    );
  }
}
