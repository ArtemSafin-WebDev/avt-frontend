import * as React from 'react';
import * as cx from 'classnames';
import * as moment from 'moment';
import { AutocompleteInput } from '../Input/AutocompleteInput';
import { IDestination } from '../../../models/search/IDestination';
import { DayPickerRangeController, DayPickerSingleDateController } from 'react-dates';
import { END_DATE, START_DATE } from 'react-dates/lib/constants';
import { PropertySelector } from './PropertySelector';
import { connect } from 'react-redux';
import { SearchActions } from '../../../redux/modules/search/actions';
import { IStore } from '../../../redux/IStore';
import {
  checkValidity,
  formatAviaSearchRequestURL,
  getDestinationHints,
  getAviaSearchResponse, getSearchResults,
} from '../../../redux/modules/search/service';
import { ISearchState } from '../../../redux/modules/search/state';
import { getPassengersOfType, getPropertiesOfType } from '../../../redux/modules/search/selectors';
import { ISearchProperties } from '../../../models/search/ISearchProperties';
import { ISearchPage } from '../../../models/search/ISearchPage';
import { SyntheticEvent } from 'react';
import { push } from 'react-router-redux';
import { ISearchAction } from '../../../models/search/ISearchAction';
import { SearchType } from '../../../models/search/SearchType';
import { ISearchFilters } from '../../../models/search/ISearchFilters';
import { IPassengersInfo } from '../../../models/search/IPassengersInfo';
const s = require('../Input/styles.css');
const spinStyle = require('../Loader/styles.css');

export interface ISearchBoxAviaProps {
  selectDestination?: any;
  searchDestinations?: any;
  getSearchResponse?: any;
  getSearchResults?: any;
  checkValidity?: any;
  redirect?: any;
  oneWay?: boolean;
  selectDate?: any;
  runFiltration?: any;
  search?: ISearchState;
  properties?: ISearchProperties;
  passengers?: IPassengersInfo;
}
export interface ISearchBoxAviaState {
  focusedInput: string;
  oneWay: boolean;
  pristine: boolean;
  focused: string;
  inputRandomKeys: number[]; // For chrome autocomplete fix
  requestSent: boolean;
}
const today = new Date();
@(connect(
  (store: IStore) => ({
    search: store.get('search'),
    properties: getPropertiesOfType('avia')(store),
    passengers: getPassengersOfType('avia')(store),
  }),
  (dispatch) => ({
    searchDestinations: (targetInput: string, partialQuery: string, token: string, exclude: string) =>
      dispatch(getDestinationHints(targetInput, partialQuery, token, SearchType.Avia, exclude)),
    selectDestination: (targetInput: string, destination: IDestination) =>
      dispatch(SearchActions.selectDestination(targetInput, destination)),
    selectDate: (targetInput: string, date: Date) =>
      dispatch(SearchActions.selectDate(targetInput, date)),
    getSearchResponse: (searchParams: ISearchPage, currentType: SearchType, oneWay: boolean) =>
      dispatch(getAviaSearchResponse(searchParams, currentType, oneWay)),
    getSearchResults: (responseId: any, type: SearchType, filters: ISearchFilters, isOneWay: boolean) =>
      dispatch(getSearchResults(responseId, type, {offset: 0, limit: 15, filters}, true, isOneWay)),
    checkValidity: (state: ISearchState) =>
      dispatch(checkValidity(state)),
    redirect: (route: string) => dispatch(push(route)),
    runFiltration: () => dispatch(SearchActions.runFiltration()),
  }),
) as any)
export class SearchBoxAvia extends React.Component<ISearchBoxAviaProps, ISearchBoxAviaState> {
  public readonly state;
  private yesterday =
        moment(new Date (today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0));
  private nextYear =
        moment(new Date (today.getFullYear() + 1, today.getMonth(), today.getDate(), 0, 0, 0));

  constructor(props) {
    super(props);
    this.state = {
      focusedInput: START_DATE,
      oneWay: props.oneWay,
      pristine: true,
      focused: '',
      inputRandomKeys: [],
      requestSent: false,
    };
    for (let i = 0; i < 3; i++) {
      this.state.inputRandomKeys.push(Math.random());
    }
    this.onTypeExtended = this.onTypeExtended.bind(this);
    this.getOutsideDateRange = this.getOutsideDateRange.bind(this);
    this.validateSearch = this.validateSearch.bind(this);
    this.handleFocusChange = this.handleFocusChange.bind(this);
    this.popupState = this.popupState.bind(this);
    this.clickHandler = this.clickHandler.bind(this);
    this.selectDate = this.selectDate.bind(this);
  }
  private onTypeExtended(targetInput: string, currentValue: string, currentDestination?: IDestination) {
    // If reset or set
    if (currentDestination || currentDestination === null) {
      return this.props.selectDestination(targetInput, currentDestination);
    } else {
      let exclude = '';
      if (targetInput === 'to') {
        const departure = this.props.properties.get('departure_point');
        exclude = departure ? departure.get('id') : '';
      }
      return this.props.searchDestinations(targetInput, currentValue, localStorage.getItem('avt_token'), exclude);
    }
  }
  public componentWillReceiveProps(props: ISearchBoxAviaProps) {
    if (props.oneWay && !this.state.oneWay && this.state.pristine) {
      this.setState({oneWay: true});
    }
    if (typeof ($) !== 'undefined') {
      $('body').off('click', this.clickHandler).on('click', this.clickHandler);
    }
  }
  private getOutsideDateRange(day) {
    return moment(day).isBefore(this.yesterday) || moment(day).isAfter(this.nextYear);
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
  public componentWillUnmount() {
    if (typeof ($) !== 'undefined') {
      $('body').off('click', this.clickHandler);
    }
  }
  private validateSearch(e: SyntheticEvent<HTMLElement>) {
    e.preventDefault();
    this.setState({focused: ''});
    const valid = this.props.checkValidity(this.props.search);
    const isSearchPage = location.pathname.indexOf('search-avia') > -1;
    if (valid
    /* && (!this.props.search.get('isFetching') || (isSearchPage && !this.props.search.get('pristine')))*/) {
      this.setState({requestSent: true});
      this.props.getSearchResponse(this.props.search.get('avia'), SearchType.Avia, this.state.oneWay)
        .then((action: ISearchAction) => {
          // search-avia/MOW1404KZN1504-210e-XXXXXX
          if (action) {
            const route = `/search-avia/${formatAviaSearchRequestURL(
              this.props.properties, 
              this.props.passengers, 
              action.payload.responseId, this.state.oneWay)}`;
            if (isSearchPage) {
              this.props.getSearchResults(action.payload.responseId, SearchType.Avia,
                {offset: this.state.numberToDisplay, limit: 15,
                  payment: this.props.search.getIn(['filters', 'payment'])}, this.state.oneWay);
            }
            const loader = $('#search-avia .progress-line');
            if (typeof $ !== 'undefined' && loader.length > 0) {
              loader.removeClass('done').removeClass('fetching');
              loader.addClass('done');
              setTimeout(() => {
                loader.removeClass('done').addClass('fetching');
              }, 300);
            }
            this.setState({requestSent: false});
            this.props.redirect(route);
          }
        }).catch((e) => {
          this.setState({requestSent: false});
          console.log(e);
      });
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
    this.setState({focusedInput, pristine: false});
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
          <AutocompleteInput suggestions={this.props.properties.get('departure_point_hints')}
                             destination={this.props.properties.get('departure_point')}
                             onType={this.onTypeExtended}
                             type="search"
                             key={this.state.inputRandomKeys[0]}
                             autoComplete="false"
                             className="form-drop-input w-input"
                             dataName="from_avia"
                             focused={this.state.focused === 'from_avia'}
                             focusHandler={this.handleFocusChange}
                             maxLength={100} name="from"
                             placeholder="Откуда" required={true}/>
          <AutocompleteInput suggestions={this.props.properties.get('arrival_point_hints')}
                             onType={this.onTypeExtended}
                             destination={this.props.properties.get('arrival_point')}
                             dataName="to_avia"
                             focused={this.state.focused === 'to_avia'}
                             focusHandler={this.handleFocusChange}
                             type="search"
                             key={this.state.inputRandomKeys[1]}
                             autoComplete="false"
                             className="right_form-drop-input form-drop-input w-input"
                             maxLength={100} name="to"
                             placeholder="Куда" required={true}/>

          <div style={{minWidth: '250px'}}
               className={cx('form-drop w-dropdown', {'on-top': this.state.focused === 'date'})}>
            <div className="form-drop-toggle options_form-drop-toggle w-dropdown-toggle-modified"
                 onClick={() => this.popupState('date')}>
              <div className={cx('datepicket-text', { 'grey-p': !departureDate })}>
                {departureDate ? moment(departureDate).format('DD.MM.YYYY') : 'Когда'}
                {departureDate && arrivalDate ? ' - ' : ''}
                {arrivalDate && !this.state.oneWay
                  ? moment(arrivalDate).format('DD.MM.YYYY') : ''}
              </div>
              {!departureDate ? (
                <img src="/public/images/calendar-black.svg"
                     className="form-icon"/>
              ) : (
                <img src="/public/images/close-red.svg"
                     onClick={(e) => {
                       e.preventDefault();
                       e.stopPropagation();
                       this.setState({ focused: '', focusedInput: START_DATE, pristine: true });
                       this.props.selectDate('from', null);
                       this.props.selectDate('to', null);
                     }}
                     style={{
                       background: '#fff',
                       opacity: 1,
                       transform: 'scale(0.7)',
                       paddingLeft: 10,
                     }}
                     className="form-icon"/>
              )}
            </div>
            <nav className={
              cx('form-drop-list w-date-picker w-dropdown-list',
                {open: this.state.focused === 'date'},
                s.drop,
                s.searchDatePicker)} onClick={(e) => {
              e.preventDefault();
              return false;
            }}>
              <a href="#" onClick={() => this.popupState('')}
                 className="close_drop-list w-hidden-main w-hidden-medium w-inline-block">
                <img src="/public/images/close-red.svg" />
              </a>
              <div className="options w-clearfix">
                <a href="#" onClick={() => this.setState({oneWay: false, pristine: false, focused: 'date'})}
                   className={cx('link left-link', {
                     current_link: !this.state.oneWay,
                     inactive_link: this.state.oneWay,
                   })}>Туда — Обратно</a>
                <a href="#" onClick={() => {
                  this.setState({oneWay: true, pristine: false, focused: 'date', focusedInput: START_DATE});
                  this.props.selectDate('to', null);
                }}
                   className={cx('link left-link', {
                     current_link: this.state.oneWay,
                     inactive_link: !this.state.oneWay,
                   })}>Только туда</a>
              </div>
              <div className={cx('calendar-container', s['calendar-container'])}>
                {!this.state.oneWay ? (
                  <DayPickerRangeController
                    isOutsideRange={this.getOutsideDateRange}
                    startDate={departureDate ? moment(departureDate) : null}
                    endDate={arrivalDate ? moment(arrivalDate) : null}
                    onDatesChange={this.selectDate}
                    focusedInput={this.state.focusedInput}
                    onFocusChange={(focusedInput) => this.setState({ focusedInput })}
                    enableOutsideDays={true}
                    numberOfMonths={1}
                    minimumNights={0}
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
                ) : (
                  <DayPickerSingleDateController
                    date={departureDate ? moment(departureDate) : null}
                    onDateChange={(date) => {
                      this.props.selectDate('from', date);
                      this.popupState('');
                      this.setState({ focused: '', pristine: false });
                    }}
                    isOutsideRange={this.getOutsideDateRange}
                    focused={true}
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
                )}
              </div>
            </nav>
          </div>
          <PropertySelector
            focused={this.state.focused === 'property'}
            focusHandler={this.handleFocusChange}
            withClassSelector={true} passengers={this.props.passengers}/>
          <button value=""
                 disabled={this.state.requestSent}
                 onClick={this.validateSearch}
                 className="submit-button_main w-button">
            { this.state.requestSent ? (
              <img src="/public/images/spinner-red.svg"
                   className={`spinner search-spinner ${spinStyle['inline-spinner-ring']}`} />
            ) : (
              <span>Найти</span>
            ) }
          </button>
        </form>
      </div>
    );
  }
}
