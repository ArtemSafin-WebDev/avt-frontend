import * as React from 'react';
import * as cx from 'classnames';
import { connect } from 'react-redux';
import { SearchActions } from '../../../redux/modules/search/actions';
import { IPassengersInfo } from '../../../models/search/IPassengersInfo';
import { sendNotification } from '../../../helpers/Notifications';

export interface IPropertySelectorProps {
  withClassSelector: boolean;
  passengers: IPassengersInfo;
  selectPassengerProperty?: any;
  sendNotification?: any;
  focused: boolean;
  focusHandler: (name: string, focused: boolean) => void;
}
@(connect(
  () => ({
  }),
  (dispatch) => ({
    selectPassengerProperty: (property: string, value: any) =>
      dispatch(SearchActions.selectPassengerProperty(property, value)),
    sendNotification: (title: string, message?: string, type?: string) =>
      dispatch(sendNotification(title, message, type)),
  }),
) as any)
export class PropertySelector extends React.Component<IPropertySelectorProps, any> {
  public static renderAdults(passengers: IPassengersInfo) {
    // 1 взрослый, 2 взрослых
    const adults = passengers.get('adults');
    return (adults > 0)
      ? (adults === 1)
        ? adults + ' взрослый'
        : adults + ' взрослых'
      : null;
  }
  public static renderChildren(year: number, passengers: IPassengersInfo) {
    // 1 взрослый - 2 взрослых
    const children = year === 12
      ? passengers.get('children')
      : passengers.get('children_without_seats');
    return (children > 0)
      ? children + ` до ${year} лет`
      : null;
  }
  private changeCount(amount: number, type: string) {
    const total = PropertySelector.getTotal(this.props.passengers);
    const current = this.props.passengers.get(type);
    const newCount = current + amount;
    if (total + amount > 0 && newCount >= 0 && total + amount < 10) {
      this.props.selectPassengerProperty(type, newCount);
    } else {
      if (total === 9) {
        return this.props.sendNotification('Лимит мест превышен', 'Максимальное количество пассажиров - 9!');
      }
      this.props.sendNotification('Невозможное действие', 'Количество пассажиров должно быть неотрицательно!');
    }
  }
  public static getTotal(passengers: IPassengersInfo) {
    return passengers.get('adults')
      + passengers.get('children')
      + passengers.get('children_without_seats');
  }

  public static renderString(passengers: IPassengersInfo) {
    // Generates string whole text to be displayed in dropdown list
    const arr = [
      this.renderAdults(passengers),
      this.renderChildren(12, passengers),
      this.renderChildren(2, passengers),
    ];
    let count = 0;
    for (const el of arr) {
      count += el ? 1 : 0;
    }
    let result = '';
    if (count > 1) {
      const total = this.getTotal(passengers);
      result += total;
      switch (total % 10) {
        case 1: result += ' пассажир'; break;
        case 2:
        case 3:
        case 4: result += ' пассажира'; break;
        default: result += ' пассажиров'; break;
      }
    } else {
      result = arr.filter((x) => x !== null).join(', ');
    }
    return result;
  }
  public render() {
    return (
      <div data-delay="200" className={cx('form-drop w-dropdown', {'on-top': this.props.focused})}>
        <div className={cx('form-drop-toggle options_form-drop-toggle w-dropdown-toggle-modified',
              {'w--open': this.props.focused})}
              onClick={() => this.props.focusHandler('property', true)}>
          <div>
            {PropertySelector.renderString(this.props.passengers)}
            {this.props.withClassSelector && (
              <span>,
                <span className="grey-p">
                {this.props.passengers.get('businessClass') ? ' бизнес' : ' эконом'}
                </span>
              </span>
            )}
          </div>
        </div>
        <nav className={cx('form-drop-list options_form-drop-list w-clearfix w-dropdown-list',
          {'w--open': this.props.focused})}>
          <a href="#" onClick={() => this.props.focusHandler('property', false)}
             className="close_drop-list w-hidden-main w-hidden-medium w-inline-block">
            <img src="/public/images/close-red.svg"/></a>
          {this.props.withClassSelector && (
            <div className="options w-clearfix">
              <a href="#" onClick={() => this.props.selectPassengerProperty('businessClass', false)}
                 className={cx('link left-link', {
                  current_link: !this.props.passengers.get('businessClass'),
                  inactive_link: this.props.passengers.get('businessClass'),
                })}>Эконом</a>
              <a href="#" onClick={() => this.props.selectPassengerProperty('businessClass', true)}
                 className={cx('link left-link', {
                  current_link: this.props.passengers.get('businessClass'),
                  inactive_link: !this.props.passengers.get('businessClass'),
                })}>Бизнес</a>
            </div>
          )}
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
            <div className="p">До 12 лет</div>
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
          <div className="options-row last_options-row">
            <div className="p">До 2 лет</div>
            <div className="options-buttons">
              <div className="options-button" onClick={() => this.changeCount(-1, 'children_without_seats')}>
                <img src="/public/images/minus-red.svg"/>
              </div>
              <div className="p">{this.props.passengers.get('children_without_seats')}</div>
              <div className="options-button" onClick={() => this.changeCount(1, 'children_without_seats')}>
                <img src="/public/images/plus-red.svg"/>
              </div>
            </div>
          </div>
        </nav>
      </div>
    );
  }
}
