import * as React from 'react';
import { AutocompleteInput } from '../Input/AutocompleteInput';
import { IDestination } from '../../../models/search/IDestination';
import * as cx from 'classnames';
import { DayPickerRangeController, DayPickerSingleDateController } from 'react-dates';
import { END_DATE, START_DATE } from 'react-dates/lib/constants';
import * as moment from 'moment';
import { PropertySelector } from './PropertySelector';
import { connect } from 'react-redux';
import { SearchActions } from '../../../redux/modules/search/actions';
import { IStore } from '../../../redux/IStore';
import { getDestinationHints } from '../../../redux/modules/search/service';
import { ISearchState } from '../../../redux/modules/search/state';
import { getPassengersOfType, getPropertiesOfType } from '../../../redux/modules/search/selectors';
import { ISearchProperties } from '../../../models/search/ISearchProperties';
import { IPassengersInfo } from '../../../models/search/IPassengersInfo';
const s = require('../Input/styles.css');

export interface ISearchBoxTrainProps {
  selectDestination?: any;
  searchDestinations?: any;
  selectDate?: any;
  search?: ISearchState;
  properties?: ISearchProperties;
  passengers?: IPassengersInfo;
}
export interface ISearchBoxTrainState {
  focusedInput: string;
  isDateOpen: boolean;
  oneWay: boolean;
  focused: string;
}

@(connect(
  (store: IStore) => ({
    search: store.get('search'),
    properties: getPropertiesOfType('train')(store),
    passengers: getPassengersOfType('train')(store),
  }),
  (dispatch) => ({
    searchDestinations: (targetInput: string, partialQuery: string, token: string) =>
      dispatch(getDestinationHints(targetInput, partialQuery, token)),
    selectDestination: (targetInput: string, destination: IDestination) =>
      dispatch(SearchActions.selectDestination(targetInput, destination)),
    selectDate: (targetInput: string, date: Date) =>
      dispatch(SearchActions.selectDate(targetInput, date)),
  }),
) as any)
export class SearchBoxTrain extends React.Component<ISearchBoxTrainProps, ISearchBoxTrainState> {
  public readonly state = {
    isDateOpen: false,
    focusedInput: START_DATE,
    oneWay: false,
    focused: '',
  };
  private yesterday = moment(new Date()).subtract(1, 'days');
  private nextYear = moment(new Date()).add(1, 'year');
  constructor(props) {
    super(props);
    this.onTypeExtended = this.onTypeExtended.bind(this);
    this.getOutsideDateRange = this.getOutsideDateRange.bind(this);
    this.handleFocusChange = this.handleFocusChange.bind(this);
    this.popupState = this.popupState.bind(this);
    this.clickHandler = this.clickHandler.bind(this);
  }
  private onTypeExtended(targetInput: string, currentValue: string, currentDestination?: IDestination) {
    if (currentDestination) {
      return this.props.selectDestination(targetInput, currentDestination);
    } else {
      return this.props.searchDestinations(targetInput, currentValue, localStorage.getItem('avt_token'));
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
    if (typeof ($) !== 'undefined') {
      setTimeout(() => {
        $('body').on('click', this.clickHandler);
      }, 1000);
    }
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

  private handleFocusChange(name: string, focused: boolean) {
    this.popupState((focused) ? name : '');
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
                             onType={this.onTypeExtended}
                             type="search"
                             autoComplete="off"
                             className="form-drop-input w-input"
                             dataName="from_train"
                             focusHandler={this.handleFocusChange}
                             focused={this.state.focused === 'from_train'}
                             maxLength={100} name="from"
                             placeholder="Откуда" required={true}/>
          <AutocompleteInput suggestions={this.props.properties.get('arrival_point_hints')}
                             onType={this.onTypeExtended}
                             dataName="to_train"
                             focusHandler={this.handleFocusChange}
                             focused={this.state.focused === 'to_train'}
                             type="search"
                             autoComplete="off"
                             className="right_form-drop-input form-drop-input w-input"
                             maxLength={100} name="to"
                             placeholder="Куда" required={true}/>

          <div data-delay="200" className={cx('form-drop w-dropdown', {'on-top': this.state.focused === 'date'})}>
            <div className="form-drop-toggle options_form-drop-toggle w-dropdown-toggle-modified"
                 onClick={() => this.popupState((this.state.focused !== 'date') ? 'date' : '')}>
              <div className={cx({ 'grey-p': !departureDate })}>
                {departureDate ? moment(departureDate).format('DD.MM.YYYY') : 'Когда'}
                {departureDate && !this.state.oneWay ? ' - ' : ''}
                {arrivalDate && !this.state.oneWay
                  ? moment(arrivalDate).format('DD.MM.YYYY') : ''}
              </div>
              <img src="/public/images/calendar-black.svg"
                   className="form-icon"/>
            </div>
            <nav className={
              cx('form-drop-list options_form-drop-list w-date-picker w-dropdown-list',
                {'w--open': this.state.focused === 'date'},
                s.drop, s.searchDatePicker)} onClick={(e) => {
              e.preventDefault();
              return false;
            }}>
              <a href="#" onClick={() => this.popupState('')}
                 className="close_drop-list dash w-hidden-main w-hidden-medium w-inline-block"/>
              <div className="options w-clearfix">
                <a href="#" onClick={() => this.setState({oneWay: false})}
                   className={cx('link left-link', {
                     current_link: !this.state.oneWay,
                     inactive_link: this.state.oneWay,
                   })}>Туда — Обратно</a>
                <a href="#" onClick={() => this.setState({oneWay: true})}
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
                    onDatesChange={({ startDate, endDate }) => {
                      const focusedInput = !endDate ? END_DATE : START_DATE;
                      this.setState({focusedInput});
                      this.props.selectDate('from', startDate);
                      this.props.selectDate('to', endDate);
                    }}
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
                ) : (
                  <DayPickerSingleDateController
                    isOutsideRange={this.getOutsideDateRange}
                    date={departureDate ? moment(departureDate) : null}
                    onDateChange={(date) => {
                      this.props.selectDate('from', date);
                      this.popupState('');
                    }}
                    focused={this.state.focusedInput === START_DATE}
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
                )}
              </div>
            </nav>
          </div>
          <PropertySelector
            focused={this.state.focused === 'property_avia'} // Avia is the same
            focusHandler={this.handleFocusChange}
            withClassSelector={false} passengers={this.props.passengers}/>
          <input type="submit" value="Найти" data-wait="Поиск..."
                 className="submit-button_main w-button"/>
        </form>
      </div>
    );
  }
}
