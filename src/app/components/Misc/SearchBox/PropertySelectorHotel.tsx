import * as React from 'react';
import * as moment from 'moment';
import { connect } from 'react-redux';
import { getPassengersOfType } from '../../../redux/modules/search/selectors';
import { SearchActions } from '../../../redux/modules/search/actions';
import { IStore } from '../../../redux/IStore';
import { IPassengersInfo } from '../../../models/search/IPassengersInfo';
import { sendNotification } from '../../../helpers/Notifications';
import { ISearchProperties } from '../../../models/search/ISearchProperties';
import { Input } from '../Input/Input';
import * as cx from 'classnames';

export interface IPropertySelectorHotelProps {
  passengers?: IPassengersInfo;
  properties?: ISearchProperties;
  selectPassengerProperty?: any;
  sendNotification?: any;
  focused: boolean;
  focusHandler: (name: string, focused: boolean) => void;
}
@(connect(
  (store: IStore) => ({
    search: store.get('search'),
    passengers: getPassengersOfType('hotel')(store),
  }),
  (dispatch) => ({
    selectPassengerProperty: (property: string, value: any) =>
      dispatch(SearchActions.selectPassengerProperty(property, value)),
    sendNotification: (title: string, message?: string, type?: string) =>
      dispatch(sendNotification(title, message, type)),
  }),
) as any)
export class PropertySelectorHotel extends React.Component<IPropertySelectorHotelProps, any> {
  public static renderAdults(passengers: IPassengersInfo) {
    // 1 взрослый, 2 взрослых
    const adults = passengers.get('adults');
    return (adults > 0)
      ? (adults === 1)
        ? adults + ' взрослый'
        : adults + ' взрослых'
      : null;
  }
  public static renderChildren(passengers: IPassengersInfo) {
    // 1 взрослый - 2 взрослых
    const children = passengers.get('children');
    return (children > 0)
      ? (children === 1)
          ? '1 ребенок'
          : children + ` детей`
      : null;
  }
  private changeCount(amount: number, type: string) {
    const total = PropertySelectorHotel.getTotal(this.props.passengers);
    const current = this.props.passengers.get(type);
    const newCount = current + amount;
    let valid = false;
    switch (type) {
      case 'adults': default: valid = (newCount <= 6); break;
      case 'children': valid = (newCount <= 4); break;
    }
    if (type.startsWith('children_of_year')) {
      const index = Number(type.replace('children_of_year_', ''));
      return (amount > -1 && amount < 18) && this.props.selectPassengerProperty(
            'children_of_year',
            this.props.passengers.get('children_of_year').set(index, amount));
    }
    if (total + amount > 0 && newCount >= 0 && valid) {
      this.props.selectPassengerProperty(type, newCount);
      if (type === 'children') {
        this.props.selectPassengerProperty(
          'children_of_year',
          (newCount > current)
            ? this.props.passengers.get('children_of_year').push(0)
            : this.props.passengers.get('children_of_year').pop(),
        );
      }
    } else {
      if (!valid) {
        return this.props.sendNotification('Невозможное действие', 'Лимит мест превышен!');
      }
      this.props.sendNotification('Невозможное действие', 'Количество пассажиров должно быть неотрицательно!');
    }
  }
  public static getTotal(passengers: IPassengersInfo) {
    return passengers.get('adults')
      + passengers.get('children');
  }

  public static renderString(passengers: IPassengersInfo) {
    // Generates string whole text to be displayed in dropdown list
    const arr = [
      this.renderAdults(passengers),
      this.renderChildren(passengers),
    ];
    return arr.filter((x) => x !== null).join(', ');
  }
  public render() {
    const childrenArr = this.props.passengers.get('children_of_year');
    return (
      <div data-delay="200" className={cx('form-drop w-dropdown property-selector', {'on-top': this.props.focused})}>
        <div className={cx('form-drop-toggle options_form-drop-toggle w-dropdown-toggle-modified',
          {'w--open': this.props.focused})}
             onClick={() => this.props.focusHandler('property', true)}>
          <div>
            {PropertySelectorHotel.renderString(this.props.passengers)}
          </div>
        </div>
        <nav className={cx('form-drop-list options_form-drop-list w-clearfix w-dropdown-list',
          {'w--open': this.props.focused})}>
          <a href="#"
             onClick={() => this.props.focusHandler('property', false)}
             className="close_drop-list w-hidden-main w-hidden-medium w-inline-block">
            <img src="/public/images/close-red.svg"/></a>
          <div className="w-hidden-main w-hidden-medium" style={{height: 50}}/>
          <div className="options-row">
            <div className="p">Взрослые</div>
            <div className="options-buttons">
              <div className="options-button" onClick={() => this.changeCount(-1, 'adults')}>
                <img src="/public/images/minus-red.svg"/>
              </div>
              <div className="p">{this.props.passengers.get('adults')}</div>
              <div className="options-button" onClick={() => this.changeCount(1, 'adults')}>
                <img src="/public/images/plus-red.svg"/>
              </div>
            </div>
          </div>
          <div className="options-row">
            <div className="p">Дети</div>
            <div className="options-buttons">
              <div className="options-button" onClick={() => this.changeCount(-1, 'children')}>
                <img src="/public/images/minus-red.svg"/>
              </div>
              <div className="p">{this.props.passengers.get('children')}</div>
              <div className="options-button" onClick={() => this.changeCount(1, 'children')}>
                <img src="/public/images/plus-red.svg"/>
              </div>
            </div>
          </div>
          {childrenArr.count() > 0 && (
            <div className="options-row hotel_last_options-row last_options-row">
              <div className="p">
                Возраст детей на {this.props.properties.get('departure_date')
                    ? moment(this.props.properties.get('departure_date')).format('D MMMM')
                    : 'момент заселения'}
              </div>
              <div className="children-years row">
                {childrenArr.map((year: number, i) => (
                  <Input type="number" key={i}
                         value={year.toString()} name={`year_${i}`}
                         onChange={(e) => this.changeCount(Number(e.target.value), `children_of_year_${i}`)}
                         className={`input w-input`}/>
                ))}
              </div>
            </div>
          )}
        </nav>
      </div>
    );
  }
}
