import 'react-dates/initialize';
import * as React from 'react';
import * as moment from 'moment';
import 'moment/locale/ru';
import * as cx from 'classnames';
import DropButton from '../Common/Buttons/DropButton';
import { DayPickerSingleDateController } from 'react-dates';
const s = require('./styles.css');

export interface IDateFilterProps {
  date?: Date;
  name: string;
  onChange?: any;
  forbidBeforeDay?: any;
}
export interface IDateFilterState {
  date?: Date;
  buttonFilter?: string;
  focusedInput?: string;
  isOpen?: boolean;
}

export class DateFilter extends React.PureComponent<IDateFilterProps, IDateFilterState> {
  public readonly state: IDateFilterState = {
    date: this.props.date,
    buttonFilter: 'all',
    isOpen: false,
    focusedInput: null,
  };
  public render() {
    const { isOpen, date } = this.state;
    const getOutsideDateRange = this.props.forbidBeforeDay
      ? (day) => moment(day).isBefore(this.props.forbidBeforeDay)
      : () => false;
    return (
      <div style={{position: 'relative'}}>
        <DropButton onClick={() => this.setState({isOpen: !isOpen})}>
          {this.state.date ? (
            moment(this.state.date).format('LL')
          ) : (
            'Выберете дату'
          )}
        </DropButton>
        <nav className={cx('drop-bg w-date-picker date-filter w-dropdown-list',
            s.drop, { 'w--open': isOpen })} data-ix="dropdown">
          <input
            type="text"
            className={cx('date-input icn-input hidden', s.hidden)}
            placeholder="ДД.ММ.ГГ"
            value={date ? moment(date).format('DD.MM.YYYY') : ''}
          />
          <div className="calendar-container">
            <DayPickerSingleDateController
              date={this.state.date}
              onDateChange={(date) => {
                this.props.onChange(this.props.name, date);
                this.setState({ date, isOpen: false });
              }}
              focused={this.state.focusedInput}
              onFocusChange={({ focusedInput }) => this.setState({ focusedInput })}
              enableOutsideDays={true}
              isOutsideRange={getOutsideDateRange}
              numberOfMonths={1}
              transitionDuration={0}
              navPrev={(
                <a href="#" className="calendar-nav w-inline-block">
                  <img src="/public/images/left-red.svg" />
                </a>
              )}
              navNext={(
                <a href="#" className="calendar-nav w-inline-block">
                  <img src="/public/images/right-red.svg" />
                </a>
              )}
          />
          </div>
        </nav>
      </div>
    );
  }
}
