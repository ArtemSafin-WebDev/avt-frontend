import * as React from 'react';
import * as cx from 'classnames';
import * as moment from 'moment';
import { AutocompleteInput } from '../Input/AutocompleteInput';
import { IDestination } from '../../../models/search/IDestination';
import { DayPickerRangeController } from 'react-dates';
import { START_DATE, END_DATE } from 'react-dates/lib/constants';
import { connect } from 'react-redux';
import { SearchActions } from '../../../redux/modules/search/actions';
import { IStore } from '../../../redux/IStore';
import {
  checkValidity, formatHotelSearchRequestURL,
  getDestinationHints, getHotelSearchResponse, getSearchResults,
} from '../../../redux/modules/search/service';
import { ISearchState } from '../../../redux/modules/search/state';
import { getPassengersOfType, getPropertiesOfType } from '../../../redux/modules/search/selectors';
import { ISearchProperties } from '../../../models/search/ISearchProperties';
import { SyntheticEvent } from 'react';
import { push } from 'react-router-redux';
import { ISearchPage } from '../../../models/search/ISearchPage';
import { SearchType } from '../../../models/search/SearchType';
import { ISearchAction } from '../../../models/search/ISearchAction';
import { ISearchFilters } from '../../../models/search/ISearchFilters';
import { PropertySelectorHotel } from './PropertySelectorHotel';
import { IPassengersInfo } from '../../../models/search/IPassengersInfo';
import { IHotel } from '../../../models/search/ISearchEntryHotel';
import { queryParams } from '../../../helpers/HttpHelpers';
const s = require('../Input/styles.css');

export interface ISearchBoxHotelsProps {
  selectDestination?: any;
  searchDestinations?: any;
  getSearchResponse?: any;
  getSearchResults?: any;
  redirect?: any;
  checkValidity?: any;
  selectDate?: any;
  leadRequest?: any;
  search?: ISearchState;
  properties?: ISearchProperties;
  passengers?: IPassengersInfo;
}
export interface ISearchBoxHotelsState {
  focusedInput: string;
  focused: string;
  inputRandomKeys: number[]; // For chrome autocomplete fix
}

const today = new Date();
@(connect(
  (store: IStore) => ({
    search: store.get('search'),
    properties: getPropertiesOfType('hotel')(store),
    passengers: getPassengersOfType('hotel')(store),
  }),
  (dispatch) => ({
    searchDestinations: (targetInput: string, partialQuery: string, token: string) =>
      dispatch(getDestinationHints(targetInput, partialQuery, token, SearchType.Hotel)),
    selectDestination: (targetInput: string, destination: IDestination) =>
      dispatch(SearchActions.selectDestination(targetInput, destination)),
    selectDate: (targetInput: string, date: Date) =>
      dispatch(SearchActions.selectDate(targetInput, date)),
    getSearchResponse: (searchParams: ISearchPage, currentType: SearchType) =>
      dispatch(getHotelSearchResponse(searchParams, currentType)),
    getSearchResults: (responseId: any, type: SearchType,
                       params: {offset?: number, limit?: number, filters?: ISearchFilters}) =>
      dispatch(getSearchResults(responseId, type, params)),
    checkValidity: (state: ISearchState) =>
      dispatch(checkValidity(state)),
    redirect: (route: string) => dispatch(push(route)),
  }),
) as any)
export class SearchBoxHotels extends React.Component<ISearchBoxHotelsProps, ISearchBoxHotelsState> {
  public readonly state = {
    focusedInput: START_DATE,
    focused: '',
    inputRandomKeys: [],
  };

  private yesterday =
    moment(new Date (today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0));
  private nextYear =
    moment(new Date (today.getFullYear() + 1, today.getMonth(), today.getDate(), 0, 0, 0));
  constructor(props) {
    super(props);
    for (let i = 0; i < 3; i++) {
      const id = Math.random() * 100000000 + i;
      this.state.inputRandomKeys.push(id);
    }
    this.onTypeExtended = this.onTypeExtended.bind(this);
    this.getOutsideDateRange = this.getOutsideDateRange.bind(this);
    this.validateSearch = this.validateSearch.bind(this);
    this.handleFocusChange = this.handleFocusChange.bind(this);
    this.popupState = this.popupState.bind(this);
    this.clickHandler = this.clickHandler.bind(this);
    this.selectDate = this.selectDate.bind(this);
  }
  private clickHandler(e) {
    if ($(e.target).parents('.main-search').length === 0) {
      this.popupState('');
    }
  }
  public componentDidMount() {
    setTimeout(() => {
      if (typeof ($) !== 'undefined') {
        $('body').on('click', this.clickHandler);
        $('.form-drop-input').each((i, el) => {
          const id = '' + this.state.inputRandomKeys[i % 3];
          $(el).attr('name', `name_${id}`);
          $(el).attr('id', `id_${id}`);
        });
      }
    }, 500);

  }
  public componentDidUpdate() {
    if (typeof ($) !== 'undefined') {
      $('body').off('click', this.clickHandler).on('click', this.clickHandler);
    }
  }
  public componentWillUnmount() {

    if (typeof ($) !== 'undefined') {
      $('body').off('click', this.clickHandler);
    }
  }

  private popupState(state: string) {
    if (state) {
      if (window.innerWidth <= 767) {
        $('.nav-container').fadeOut('fast');
      }
    } else {
      $('.nav-container').fadeIn('fast');
    }
    this.setState({focused: state});
  }

  private onTypeExtended(targetInput: string, currentValue: string, currentDestination?: IDestination) {
    // If reset or set
    if (currentDestination || currentDestination === null) {
      return this.props.selectDestination(targetInput, currentDestination);
    } else {
      return this.props.searchDestinations(targetInput, currentValue, localStorage.getItem('avt_token'));
    }
  }

  private getOutsideDateRange(day) {
    return moment(day).isBefore(this.yesterday) || moment(day).isAfter(this.nextYear);
  }

  private selectDate({ startDate, endDate }) {
    const departureDate = this.props.properties.get('departure_date');
    const arrivalDate = this.props.properties.get('arrival_date');
    if (this.state.focusedInput === START_DATE) {
      if (
        arrivalDate && arrivalDate.toDate && startDate.toDate
        && startDate.toDate().getTime() > arrivalDate.toDate().getTime()
      ) {
        this.props.selectDate('to', null);
      }
      this.props.selectDate('from', startDate);
    } else {
      if (endDate) {
        this.props.selectDate('to', endDate);
      } else {
        this.props.selectDate('from', startDate);
        this.props.selectDate('to', departureDate);
      }
    }
    const focusedInput = this.state.focusedInput === START_DATE ? END_DATE : START_DATE;
    this.setState({focusedInput});
  }

  private getLinkToHotel(hotel: IHotel) {
    const parts = {
      city: hotel.city,
      checkin: moment(this.props.properties.get('departure_date')).format('DDMM'),
      checkout: moment(this.props.properties.get('arrival_date')).format('DDMM'),
      adults: this.props.passengers.get('adults'),
      children: this.props.passengers.get('children_of_year').join(','),
    };
    return `/book-hotel/${hotel.city}/${hotel.id}?${queryParams(parts)}`;
  }

  private validateSearch(e: SyntheticEvent<HTMLElement>) {
    e.preventDefault();
    this.setState({focused: ''});
    const valid = this.props.checkValidity(this.props.search);
    const isSearchPage = location.pathname.indexOf('search-hotel') > -1;
    if (valid) {
      if (this.props.properties.getIn(['departure_point', 'type']) === 'hotel') {
        const hotel = this.props.properties.get('departure_point').toJS();
        this.props.redirect(this.getLinkToHotel(hotel));
      } else {
        if (!this.props.search.getIn(['filters', 'pristine'])) {
          this.props.getSearchResults(this.props.search.get('responseId'), SearchType.Hotel,
            {offset: 0, limit: 15, filters: this.props.search.get('filters')});
        } else {
          this.props.getSearchResponse(this.props.search.get('hotel'), SearchType.Hotel)
            .then((action: ISearchAction) => {
              // search-hotels/Лос-Анджелес-2307_2607_2_8,4_UID
              if (action) {
                const route = `/search-hotel/${formatHotelSearchRequestURL(
                  this.props.properties,
                  this.props.passengers,
                  action.payload.responseId)}`;
                if (isSearchPage) {
                  this.props.getSearchResults(action.payload.responseId, SearchType.Hotel,
                    {offset: 0, limit: 15,
                      payment: this.props.search.getIn(['filters', 'payment'])});
                }
                this.props.redirect(route);
              }
            }).catch((e) => console.log(e));
        }
      }
    }
  }

  public static NIGHTS = ['ночь', 'ночи', 'ночей' ];
  /**
   * Подбор правильного измерения для заданного числа.
   * @return string
   */
  public static difference(departureDate, arrivalDate) {
    const diff = moment(arrivalDate).diff(moment(departureDate), 'days');
    let choose = 0;
    const lastDigits = ( (diff % 100) >= 20 ) ? diff % 10 : diff;
    if (lastDigits === 0 || lastDigits >= 5 && lastDigits <= 20 ) {
      choose = 2;
    } else if ( lastDigits === 1 ) {
      choose = 0;
    } else {
      choose = 1;
    }
    return `На ${diff} ${SearchBoxHotels.NIGHTS[choose]} с `;
  }

  private handleFocusChange(name: string, focused: boolean) {
    const value = (focused) ? name : '';
    this.popupState(value);
  }

  public render() {
    const departureDate = this.props.properties.get('departure_date');
    const arrivalDate = this.props.properties.get('arrival_date');
    return (
      <div className="main-search w-form">
        <form id="email-form" name="email-form" data-name="Email Form" autoComplete="off"
              className="main-search-block w-clearfix">
          <input autoComplete="false" name="hidden" type="text" style={{display: 'none'}}/>
          <AutocompleteInput suggestions={this.props.properties.get('departure_point_hints')}
                             destination={this.props.properties.get('departure_point')}
                             onType={this.onTypeExtended}
                             type="search"
                             autoComplete="off"
                             key={this.state.inputRandomKeys[0]}
                             className="form-drop-input w-input"
                             dataName="hotel_city"
                             focusHandler={this.handleFocusChange}
                             focused={this.state.focused === 'hotel_city'}
                             maxLength={100} name="from"
                             placeholder="Город или название отеля" required={true}/>

          <div data-delay="200" style={{minWidth: '300px'}}
               className={cx('form-drop w-dropdown', {'on-top': this.state.focused === 'date'})}>
            <div className="form-drop-toggle options_form-drop-toggle w-dropdown-toggle-modified"
                 onClick={() => this.popupState('date')}>
              <div className={cx('datepicket-text', { 'grey-p': !departureDate })}>
                {departureDate && arrivalDate
                  ? SearchBoxHotels.difference(departureDate, arrivalDate || departureDate) : ''}
                {departureDate ? moment(departureDate).format('D MMMM') : 'Период проживания'}
              </div>
              {!departureDate ? (
                <img src="/public/images/calendar-black.svg"
                   className="form-icon"/>
                ) : (
                  <img src="/public/images/close-red.svg"
                       onClick={() => {
                         this.setState({focusedInput: START_DATE });
                         this.props.selectDate('from', null);
                         this.props.selectDate('to', null);
                         $('.nav-container').fadeIn('fast');
                       }}
                       style={{background: '#fff', opacity: 1, transform: 'scale(0.7)', paddingLeft: '10px'}}
                       className="form-icon"/>
                )}
            </div>
            <nav className={
              cx('form-drop-list options_form-drop-list w-date-picker w-dropdown-list',
                {open: this.state.focused === 'date'},
                s.drop, s.searchDatePicker)} data-ix="dropdown">
              <a href="#" onClick={() => this.setState({focused: ''})}
                 className="close_drop-list w-hidden-main w-hidden-medium w-inline-block">
                <img src="/public/images/close-red.svg" />
              </a>
              <div className={cx('calendar-container', s['calendar-container'])}>
                <DayPickerRangeController
                  isOutsideRange={this.getOutsideDateRange}
                  startDate={departureDate ? moment(departureDate) : null}
                  endDate={arrivalDate ? moment(arrivalDate) : null}
                  onDatesChange={this.selectDate}
                  focusedInput={this.state.focusedInput}
                  onFocusChange={(focusedInput) => this.setState({ focusedInput })}
                  enableOutsideDays={true}
                  numberOfMonths={1}
                  transitionDuration={0}
                  navPrev={(
                    <a href="#" className={cx('calendar-nav w-inline-block', s['calendar-nav'])}>
                      <img src="/public/images/left-red.svg" />
                    </a>
                  )}
                  navNext={(
                    <a href="#" className={cx('calendar-nav w-inline-block', s['calendar-nav'])}>
                      <img src="/public/images/right-red.svg" />
                    </a>
                  )}
                />
              </div>
            </nav>
          </div>
          <PropertySelectorHotel
            focused={this.state.focused === 'property'}
            focusHandler={this.handleFocusChange}
            properties={this.props.properties}
            passengers={this.props.passengers}/>
          <input type="submit" value="Найти" data-wait="Поиск..." onClick={this.validateSearch}
                 className="submit-button_main w-button"/>
        </form>
      </div>
    );
  }
}
