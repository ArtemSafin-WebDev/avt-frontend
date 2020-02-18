import * as React from 'react';
import * as cx from 'classnames';
import { IMultiSelectItem } from '../../../models/search/ISearchFilters';
const s = require('./styles.css');

export interface IDropdownSelectProps {
  customClass?: string;
  selectable: boolean;
  selectLimit?: number;
  listSelected?: boolean;
  values: IMultiSelectItem[];
  onSelect: (prop: string, value: any) => void;
  placeholder: string;
  name: string;
  disabled?: boolean;
}
export interface IDropdownSelectState {
  isOpen: boolean;
  edited: boolean;
}
export class DropdownSelect extends React.Component<IDropdownSelectProps, IDropdownSelectState> {
  public readonly state: IDropdownSelectState;

  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      edited: false,
    };
  }
  private getSelected() {
    return this.props.values.filter((el) => el && el.selected);
  }
  private selectedToString() {
    const selected = this.getSelected();
    if (selected.length > 0) {
      return (this.props.listSelected)
        ? selected.map((el) => el.text).join(', ')
        : (this.props.selectLimit === 1)
          ? selected[0].text
          : this.props.placeholder;
    }
    return this.props.placeholder;
  }
  private selectNode(val: string) {
    const count = this.getSelected().length;
    if (this.props.selectLimit === 1) {
      this.setState({isOpen: false, edited: true});
      this.props.onSelect(this.props.name, val);
      $('.select .filter-select-list.w--open, .select .w-dropdown-toggle.w--open')
        .removeClass('w--open');

    } else {
      const alreadySelected = this.getSelected().findIndex((el) => (el.value === val)) > -1;
      this.setState({isOpen: true, edited: true});
      if (!alreadySelected && count < this.props.selectLimit) {
        this.props.onSelect(this.props.name, [...this.getSelected().map((el) => el.value), val]);
      } else if (alreadySelected) {
        this.props.onSelect(this.props.name,
          this.getSelected().filter((el) => el.value !== val).map((el) => el.value));
      } else {
        $('.select .filter-select-list.w--open, .select .w-dropdown-toggle.w--open')
          .removeClass('w--open');
      }
    }
  }

  private renderNodes() {
    if (this.props.selectable) {
      return this.props.values.map((el) => {
        const id = this.props.name + el.value;
        return (
          <a href="#" key={id} onClick={() => this.selectNode(el.value)}
             className={cx('select-link w-dropdown-link', {current: el.selected})}>
            <div className="checkbox w-checkbox">
              <input type="checkbox" id={id} name={id} data-name={id}
                     className="checkbox-thing w-checkbox-input" />
                <div className={cx('checkbox-icon', {inactive: !el.selected, active: el.selected})}>
                  <img src="/public/images/check-red.svg" />
                </div>
              <label htmlFor={id} className="checkbox-text w-form-label">{el.text}</label>
            </div>
          </a>
        );
      });
    } else {
      return this.props.values.map((el) => {
        const id = this.props.name + el.value;
        return (
            <a href="#" key={id} onClick={() => this.selectNode(el.value)}
               className={cx('select-link w-dropdown-link', {current: el.selected})}>
              {el.text}
            </a>
        );
      });
    }
  }

  public render() {
    return (
      <div data-ix="select-arrow"
           className={cx('select filter-select w-dropdown',
             this.props.customClass,
             {'on-top': this.state.isOpen, 'edited': this.state.edited, 'disabled': this.props.disabled})}>
        <div className={cx('select-toggle no-border-select-toggle w-clearfix w-dropdown-toggle')}
             onClick={() => $(`.${s['on-top']}`).removeClass(s['on-top']).removeClass('w--open')}>
          <div className="select-text left-select-text">{this.selectedToString()}</div>
          <img src="/public/images/down-red.svg" className="select-icon" />
        </div>
        <nav className={cx('nav-drop-list filter-select-list w-dropdown-list')}>
          {this.renderNodes()}
        </nav>
      </div>
    );
  }
}
