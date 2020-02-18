import * as React from 'react';
import * as cx from 'classnames';
import { connect } from 'react-redux';
import { Footer } from '../../components/Footer/Footer';
import { IStore } from '../../redux/IStore';
import { ISearchState } from '../../redux/modules/search/state';
import { IDestination } from '../../models/search/IDestination';
import { SearchActions } from '../../redux/modules/search/actions';
import { getDestinationHints, getSearchResults } from '../../redux/modules/search/service';
import { push } from 'react-router-redux';
import { SearchBox } from '../../components/Misc/SearchBox/SearchBox';
import { Header } from '../../components/Header';
import { FlightSearch } from '../../components/Misc/Flights/FlightSearch';
// import { Loader } from '../../components/Misc/Loader/Loader';
import { SearchFiltersAvia } from '../../components/Misc/SearchBox/SearchFiltersAvia';
import { getFilteredFlights } from '../../redux/modules/search/selectors';
import { SearchType } from '../../models/search/SearchType';
import { PaymentCriterion } from '../../models/search/ISearchFilters';
import { ITicket } from '../../models/search/ISearchEntryAvia';
import { InlineLoader } from '../../components/Misc/Loader/InlineLoader';
import { TicketAvia } from '../Avia/TicketAvia';

export interface ISearchAviaProps {
  selectDate?: any;
  selectDestination?: any;
  searchDestinations?: any;
  selectCurrentTicket?: any;
  selectPassengerProperty?: (property: string, value: any) => any;
  selectFilter?: any;
  selectResponseId?: any;
  getSearchResults?: any;
  redirect?: any;
  location: any;
  params: any; // GET query params
  search: ISearchState;
  flights: any[];
  isAuthenticated: boolean;
}
export interface ISearchAviaState {
  numberToDisplay: number;
  airports: object;
  oneWay: boolean;
  preloaded: number;
}
@(connect(
  (state: IStore) => {
    return ({
      isAuthenticated: state.get('user').get('isAuthenticated'),
      search: state.get('search'),
      flights: getFilteredFlights(state.get('search')),
      router: state.get('router'),
    });
  },
  (dispatch) => ({
    searchDestinations: (targetInput: string, partialQuery: string, token: string) =>
      dispatch(getDestinationHints(targetInput, partialQuery, token)),
    selectDestination: (targetInput: string, destination: IDestination) =>
      dispatch(SearchActions.selectDestination(targetInput, destination)),
    selectDate: (targetInput: string, date: Date) =>
      dispatch(SearchActions.selectDate(targetInput, date)),
    selectFilter: (param: string, value: string) =>
      dispatch(SearchActions.selectFilter(param, value)),
    selectCurrentTicket: (ticket: any) =>
      dispatch(SearchActions.selectCurrentSearchEntry(ticket)),
    selectResponseId: (responseId: any) =>
      dispatch(SearchActions.selectResponseId(responseId)),
    getSearchResults: (responseId: any, type: SearchType,
                       params: {offset?: number, limit?: number, payment?: PaymentCriterion}, isOneWay: boolean) =>
      dispatch(getSearchResults(responseId, type, params, true, isOneWay)),
    selectPassengerProperty: (property: string, value: any) =>
      dispatch(SearchActions.selectPassengerProperty(property, value)),
    redirect: (route: string) => dispatch(dispatch(push(route))),
  }),
) as any)
export class SearchAvia extends React.Component<ISearchAviaProps, ISearchAviaState> {
  public readonly state: ISearchAviaState = {
    numberToDisplay: 15,
    airports: {},
    oneWay: false,
    preloaded: 0, // 0 = not loaded yet, 1 = loading, 2 = already loaded all
  };
  constructor(props) {
    super(props);
    this.increaseResultCount = this.increaseResultCount.bind(this);
    this.selectCurrentTicket = this.selectCurrentTicket.bind(this);
    this.handleAutoLoad = this.handleAutoLoad.bind(this);
  }
  public shouldComponentUpdate(nextProps, nextState: ISearchAviaState) {
    const currentFlightsCount = (this.props.flights instanceof Array) ? this.props.flights.length : 0;
    return nextProps.search.get('shouldBeUpdated') || !nextProps.search.get('pristine')
      || this.state.numberToDisplay !== nextState.numberToDisplay
      || (nextProps.search.get('partiallyLoaded') &&
          ((currentFlightsCount < nextProps.flights.length))
      || (!this.props.search.get('loaded') && nextProps.search.get('loaded'))
      || nextProps.search.get('error') !== this.props.search.get('error'));
  }

  private getCityFromCode(targetInput: string, code: string) {
    this.props.searchDestinations(targetInput, code, '').then((res) => {
      if (res.payload.destinations && res.payload.destinations.length > 0) {
        const airports = this.state.airports;
        const newAirport = res.payload.destinations[ 0 ];
        this.props.selectDestination(targetInput, newAirport as IDestination);
        // airports[code] = newAirport;
        // TODO Add airport code -> name
        airports[ code ] = code;
        this.setState({ airports });
      }
    }).catch((e) => {
      console.log(e);
    });
  }
  public componentDidMount() {
    const destination: string = this.props.params.destination;
    if (destination && (!this.props.flights || this.props.flights.length === 0)) {
      // Destination in format MOW1404KZN1504-210e-XXXXXX
      const rex = /^([A-Z]{3})(\d{4})([A-Z]{3})(\d{4})?-(\d)(\d)(\d)(\w)[-]?(.+)?/;
      const parts = rex.exec(destination);

      if (parts && parts.length >= 9) {
        if (!this.props.search.getIn(['avia', 'properties', 'departure_point'])) {
          this.getCityFromCode('from', parts[1]);
          this.getCityFromCode('to', parts[3]);
        }
        this.props.selectDate('from', TicketAvia.stringToDate(parts[2]));
        if (parts[4] !== '0000') {
          this.props.selectDate('to', TicketAvia.stringToDate(parts[4]));
        } else {
          this.setState({ oneWay: true });
        }
        this.props.selectPassengerProperty('adults', Number(parts[5]));
        this.props.selectPassengerProperty('children', Number(parts[6]));
        this.props.selectPassengerProperty('children_without_seats', Number(parts[7]));
        this.props.selectPassengerProperty('businessClass', parts[8].toLowerCase() === 'b');

        if (parts.length > 9) {
          const responseId = parts[9];
          if (responseId) {
            this.props.selectResponseId(responseId);
            this.props.getSearchResults(responseId, SearchType.Avia,
              {offset: this.state.numberToDisplay, limit: 15,
                payment: this.props.search.getIn(['filters', 'payment'])}, this.state.oneWay);
          }
        } else {
          this.props.redirect('/');
        }
      }
    }
    this.handleAutoLoad();
  }

  private handleAutoLoad() {
    // Debounced function for handling scroll events
    let lastY = 0;
    let ticking = false;

    window.addEventListener('scroll', () => {
      lastY = window.scrollY;
      if (!ticking) {
        requestAnimationFrame(() => {
          if (document.body.scrollHeight - lastY < 1500 && this.state.preloaded === 0) {
            this.increaseResultCount();
          }
          ticking = false;
        });
        ticking = true;
      }
    });

  }

  private selectCurrentTicket(ticket: any) {
    if (ticket) {
      this.props.selectCurrentTicket(ticket);
      $('html,body').animate({scrollTop: 0}, 'slow');
    }
  }

  private renderResult() {
    const flights = this.props.flights;
    if (flights instanceof Array
      && (!this.props.search.get('isFetching') || this.props.search.get('partiallyLoaded'))) {
      return flights.slice(0, this.state.numberToDisplay).map((ticket: ITicket, i) => {
        if (ticket) {
          return (
            <FlightSearch onClick={() => this.selectCurrentTicket(ticket)}
                          properties={this.props.params.destination}
                          hotelResponseId={this.props.search.get('hotelResponseId')}
                          ticket={ticket} key={ticket.id + i} />
          );
        }
      });
    }
  }

  private increaseResultCount() {
    const total = this.props.flights.length;
    if (total > 0) {
      // Increase by 15, but not more that length of
      if (this.state.numberToDisplay + 15 < total) {
        this.setState({numberToDisplay: this.state.numberToDisplay + 15, preloaded: 1});

        setTimeout(() => {
          this.setState({preloaded: 0});
        }, 1000);
      } else {
        this.setState({numberToDisplay: total, preloaded: 2});
      }
    }
  }

  public render() {
    const results = this.props.flights;
    const isFetching = this.props.search.get('isFetching');
    const partiallyLoaded = this.props.search.get('partiallyLoaded');
    const oneWay = this.state.oneWay;
    const resultsReady = results instanceof Array && results.length > 0;
    return (
      <div id="search-avia">
        <div className="fixed-header w-hidden-medium w-hidden-small w-hidden-tiny">
          <div className="container">
            <div className="main-search w-form">
              <SearchBox showMenu={false} key="top" aviaOneWay={oneWay} />
            </div>
          </div>
        </div>
        <main className="header" data-ix="fixed-nav">
          <Header/>
          <div className="container margin-top-container">
            <SearchBox showMenu={true} key="fixed"  aviaOneWay={oneWay}/>
          </div>
          <div className="progress-bar w-clearfix">
            <div className={cx('progress-line', {
                fetching: !this.props.search.get('loaded')
                          || isFetching
                          || this.props.search.get('partiallyLoaded'),
                done: !isFetching && this.props.search.get('loaded'),
            })} />
          </div>
        </main>
        <div className="section search-section">
          <div className={cx('container', {'on-back': isFetching})} style={{minHeight: 400}}>
            <SearchFiltersAvia/>

            <div className="row w-row">
              <div className="column w-col w-col-8 w-col-stack">
                {((!isFetching && this.props.search.get('loaded') && results.length === 0)
                  || this.props.search.get('error')) && (
                  <div id="not-found">
                    <div style={{display: 'flex'}}><img src="/public/images/404-img.svg"/></div>
                    <h3 className="h2">Ничего не найдено</h3>
                    <div className="p p-ui">
                      Попробуйте изменить параметры поиска или
                      <a href="#" className="span-link"> спросить у нас напрямую</a>
                    </div>
                  </div>
                )}
                {!isFetching && this.props.search.get('shouldBeUpdated') && !this.props.search.get('pristine') ? (
                  <div id="data-changed">
                    <div style={{display: 'flex'}}><img src="/public/images/404-img.svg"/></div>
                    <h3 className="h3">Данные поиска изменились</h3>
                    <div className="p p-ui">
                      Чтобы произвести поиск - нажмите кнопку "Найти" или
                      <a href="#" className="span-link"> спросите у нас напрямую</a>
                    </div>
                  </div>
                ) : !this.props.search.get('error') && this.renderResult()}
                {((!isFetching && resultsReady && !this.props.search.get('shouldBeUpdated')) || partiallyLoaded)
                  && this.state.numberToDisplay < results.length
                  && (
                  <a href="#" className="wide-button w-inline-block" onClick={this.increaseResultCount}>
                    <img src="/public/images/refresh-white.svg" className="icon-more" />
                    <div>Показать ещё</div>
                  </a>
                )}
              </div>
            </div>

            {isFetching && !this.props.search.get('error') && !partiallyLoaded && (
              <InlineLoader customTextStyle={{marginLeft: '30px'}}
                            customBlockStyle={{maxWidth: '380px'}}
                            dotUpdating={true} text="Идет поиск авиабилетов" />
              )}
          </div>
        </div>
        <Footer aviaOneWay={oneWay}/>
      </div>
    );
  }
}
