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
import { SearchFiltersHotels } from '../../components/Misc/SearchBox/SearchFiltersHotels';
import { getFilteredHotels, getPassengersOfType, getPropertiesOfType } from '../../redux/modules/search/selectors';
import { SearchType } from '../../models/search/SearchType';
import { IHotel } from '../../models/search/ISearchEntryHotel';
import { HotelSearch } from '../../components/Misc/Hotels/HotelSearch';
import { getPage } from '../../redux/modules/pages/service';
import { ImagedCard } from '../../components/Landing/Card/ImagedCard';
import { IBlock } from '../../redux/modules/pages/IBlock';
import { ISearchProperties } from '../../models/search/ISearchProperties';
import { ISearchFilters } from '../../models/search/ISearchFilters';
import { fromJS } from 'immutable';
import { IPassengersInfo } from '../../models/search/IPassengersInfo';
import { InlineLoader } from '../../components/Misc/Loader/InlineLoader';
import { TicketAvia } from '../Avia/TicketAvia';

export interface ISearchHotelProps {
  selectDate?: any;
  selectDestination?: any;
  searchDestinations?: any;
  selectCurrentHotel?: any;
  getPageNodes?: () => Promise<any>;
  selectFilter?: any;
  selectResponseId?: any;
  getSearchResults?: any;
  getHotelsDetails?: any;

  selectPassengerProperty: (property: string, value: any) => any;
  redirect?: any;
  params: any; // GET query params
  searchProperties: ISearchProperties;
  passengers: IPassengersInfo;
  search: ISearchState;
  hotels: IHotel[];
  isAuthenticated: boolean;
}

export interface ISearchHotelState {
  numberToDisplay: number;
  nodes: IBlock[];
  preloaded: number;
}

export interface ISearchProps {
  city: string;
  checkin: string;
  checkout: string;
  adults: string;
  children: string;
  responseId?: string;
  index?: number;
  offset?: number;
};

@(connect(
  (state: IStore) => {
    return ({
      isAuthenticated: state.get('user').get('isAuthenticated'),
      search: state.get('search'),
      hotels: getFilteredHotels(state.get('search')),
      searchProperties: getPropertiesOfType('hotel')(state),
      passengers: getPassengersOfType('hotel')(state),
      router: state.get('router'),
    });
  },
  (dispatch) => ({
    searchDestinations: (targetInput: string, partialQuery: string, token: string) =>
      dispatch(getDestinationHints(targetInput, partialQuery, token, SearchType.Hotel)),
    selectDestination: (targetInput: string, destination: IDestination) =>
      dispatch(SearchActions.selectDestination(targetInput, destination)),
    selectDate: (targetInput: string, date: Date) =>
      dispatch(SearchActions.selectDate(targetInput, date)),
    selectFilter: (param: string, value: string) =>
      dispatch(SearchActions.selectFilter(param, value)),
    selectCurrentHotel: (ticket: any) =>
      dispatch(SearchActions.selectCurrentSearchEntry(ticket)),
    selectResponseId: (responseId: any) =>
      dispatch(SearchActions.selectResponseId(responseId)),
    getSearchResults: (responseId: any, type: SearchType,
                       params: { offset?: number, limit?: number, filters?: ISearchFilters }) =>
      dispatch(getSearchResults(responseId, type, params)),
    getPageNodes: () =>
      dispatch(getPage('search-hotel')),
    selectPassengerProperty: (property: string, value: any) =>
      dispatch(SearchActions.selectPassengerProperty(property, value)),
    redirect: (route: string) => dispatch(push(route)),
  }),
) as any)
export class SearchHotel extends React.Component<ISearchHotelProps, ISearchHotelState> {
  public readonly state: ISearchHotelState = {
    numberToDisplay: 15,
    nodes: [],
    preloaded: 0,
  };

  constructor(props) {
    super(props);
    this.increaseResultCount = this.increaseResultCount.bind(this);
    this.selectCurrentHotel = this.selectCurrentHotel.bind(this);
    this.handleAutoLoad = this.handleAutoLoad.bind(this);
  }

  private getCityFromCode(targetInput: string, code: string) {
    const token = localStorage.getItem('avt_token');
    this.props.searchDestinations(targetInput, code, token).then((res) => {
      if (res.payload.destinations && res.payload.destinations.length > 0) {
        this.props.selectDestination(targetInput, res.payload.destinations[ 0 ] as IDestination);
      }
    }).catch((e) => {
      console.log(e);
    });
  }

  private parts: ISearchProps;

  public componentDidMount() {
    const destination: string = this.props.params.destination;
    if (destination) {
      // Destination if format Лос-Анджелес-2307_2607_2_8,4_XXXXXXX
      const rex = /^(.+)-(\d{4})_(\d{4})_(\d)_([\d,]*)[_]?(.+)?$/;
      const parts = rex.exec(destination);
      if (parts && parts.length > 6) {
        const city = decodeURI(parts[ 1 ]);
        this.parts = { city, checkin: parts[ 2 ], checkout: parts[ 3 ], adults: parts[ 4 ], children: parts[ 5 ] };
        if (!this.props.search.getIn([ 'hotel', 'properties', 'departure_point' ])) {
          this.getCityFromCode('from', city);
        }
        const checkIn = TicketAvia.stringToDate(parts[ 2 ]);
        const checkOut = TicketAvia.stringToDate(parts[ 3 ]);
        this.props.selectDate('from', checkIn);
        this.props.selectDate('to', checkOut);
        this.props.selectPassengerProperty('adults', Number(parts[ 4 ]));
        if (parts[ 5 ].length > 0) {
          const splitted = parts[ 5 ].split(',');
          this.props.selectPassengerProperty(
            'children_of_year',
            fromJS(splitted.map((el) => Number(el))),
          );
          this.props.selectPassengerProperty('children', splitted.length);
        }
        const responseId = parts[ 6 ];
        if (responseId) {
          this.parts.responseId = responseId;
          this.props.selectResponseId(responseId);
          this.props.getSearchResults(responseId, SearchType.Hotel,
            { offset: 0, limit: 15, filters: this.props.search.get(`filters`) });
          this.handleAutoLoad();
        }
      } else {
        this.props.redirect('/');
      }
    }
    /* else {
          this.props.redirect('/');
        }*/
    setTimeout(() => {
      if (typeof ($) !== 'undefined') {
        $('.open-lead-modal').on('click', () => {
          $('.modal-lead-red').fadeTo('fast', 1);
        });
        $('.modal-close').on('click', () => {
          $('.modal-lead-red').fadeOut('fast');
        });
        $('.modal-flex').on('click', (e) => {
          if ($(e.target).is('.modal-flex')) {
            $('.modal-lead').fadeOut('fast');
          }
        });
      }
    }, 1000);
    this.props.getPageNodes().then((data) => {
      this.setState({ nodes: data.nodes[ 0 ].children || [] });
    });
  }

  private selectCurrentHotel(hotel: IHotel) {
    if (hotel) {
      this.props.selectCurrentHotel(null);
      $('html,body').animate({ scrollTop: 0 }, 'slow');
    }
  }

  private renderResult() {
    const hotels = this.props.hotels.filter((hotel: IHotel) => !!hotel.thumbnail);
    if (hotels instanceof Array && this.parts) {
      return hotels.slice(0, this.state.numberToDisplay).map((hotel, i) => {
        if (hotel) {
          return (
            <HotelSearch URLProps={{...this.parts, index: i, offset: this.state.numberToDisplay - 15}}
                         onClick={() => this.selectCurrentHotel(hotel)}
                         properties={this.props.searchProperties}
                         hotel={hotel} key={hotel.id + i}/>
          );
        }
      });
    }
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
            if (this.props.search.get('responseId')) {
              this.increaseResultCount();
            }
          }
          ticking = false;
        });
        ticking = true;
      }
    });

  }

  private increaseResultCount() {
    // Increase by 15, but not more that length of
    this.setState({ preloaded: 1 });
    this.props.getSearchResults(this.props.search.get('responseId'), SearchType.Hotel,
      {
        offset: this.state.numberToDisplay, limit: 15,
        filters: this.props.search.get('filters'),
      }).then(() => {
      setTimeout(() => {
        this.setState({ numberToDisplay: (this.state.numberToDisplay + 15), preloaded: 0 });
      }, 5000);
    });

  }

  public componentWillReceiveProps(nextProps: ISearchHotelProps) {
    if (nextProps.search.get('error')) {
      this.setState({ preloaded: 2 });
    }
  }

  public render() {
    const results = this.props.hotels;
    const hasError = this.props.search.get('error');
    const isFetching = this.props.search.get('isFetching');
    const resultsReady = results instanceof Array && results.length > 0;
    return (
      <div>
        {/*<div className="fixed-header w-hidden-medium w-hidden-small w-hidden-tiny">
          <div className="container">
            <div className="main-search w-form">
              <SearchBox showMenu={false} key="fixed" pageName={'hotel'}/>
            </div>
          </div>
        </div>*/}
        <main className="header" data-ix="fixed-nav">
          <Header/>
          <div className="container margin-top-container">
            <SearchBox showMenu={true} key="top" pageName={'hotel'}/>
          </div>
          <div className="progress-bar w-clearfix">
            <div className={cx('progress-line', {
              fetching: !resultsReady || isFetching,
              done: !isFetching && resultsReady,
            })}/>
          </div>
        </main>
        <div className="section search-section">
          <div className="container" style={{ minHeight: 400 }}>
            <SearchFiltersHotels numberToDisplay={this.state.numberToDisplay}/>

            <div className="row w-row">
              <div className="column w-col w-col-8 w-col-stack">
                {(!isFetching && this.props.search.get('loaded') && results.length === 0
                  || (this.props.search.get('error') && results.length === 0)) && (
                  <div>
                    <div style={{ display: 'flex' }}><img src="/public/images/404-img.svg"/></div>
                    <h3 className="h2">Ничего не найдено</h3>
                    <div className="p p-ui">
                      Попробуйте изменить параметры поиска или
                      <a href="#" className="span-link"> спросить у нас напрямую</a>
                    </div>
                  </div>
                )}
                {this.renderResult()}
                {!isFetching && resultsReady && !hasError && (
                  <a href="#" className="wide-button w-inline-block" onClick={this.increaseResultCount}>
                    <img src="/public/images/refresh-white.svg" className="icon-more"/>
                    <div>Показать ещё</div>
                  </a>
                )}
                {isFetching && !hasError && (
                  <InlineLoader customTextStyle={{ marginLeft: '30px' }}
                                customBlockStyle={{ maxWidth: '320px' }}
                                dotUpdating={true} text="Идет поиск отелей"/>
                )}
              </div>
              {/*tslint:disable-next-line*/}
              <div className="column hotel-rightside w-hidden-medium w-hidden-small w-hidden-tiny w-col w-col-4 w-col-stack">
                {false && this.state.nodes.map((node: IBlock) => (
                  <ImagedCard title={node.title} description={node.description} key={node.id}
                              imageURL={node.image_url} actionURL={node.action_url} actionText={node.action_text}/>))}
              </div>
            </div>
          </div>
        </div>
        <Footer/>
      </div>
    );
  }
}
