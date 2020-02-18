import * as React from 'react';
import { IMultiSelectItem, TimeCriterion } from '../../../models/search/ISearchFilters';
import * as cx from 'classnames';

export interface IDropdownMultiColumnProps {
  customClass?: string;
  values: IMultiSelectItem[];
  onSelect: (prop: string, value: string) => void;
  placeholder: string;
  name: string;
}
export interface IDropdownMultiColumnState {
  isOpen: boolean;
  edited: boolean;
}

export class DropdownMultiColumn extends React.Component<IDropdownMultiColumnProps, IDropdownMultiColumnState> {
  public readonly state: IDropdownMultiColumnState;

  constructor(props) {
    super(props);
    this.selectNode = this.selectNode.bind(this);
    this.state = {
      isOpen: false,
      edited: false,
    };
  }
  private getSelected() {
    return this.props.values.filter((el) => el.selected);
  }

  private selectedToString() {
    const selected = this.getSelected();
    let result = '';
    selected.forEach((item) => {
      if (item.type === 'from_time' && item.value !== TimeCriterion.ANY) {
        result += `Вылет туда: ${item.text}`;
      } else if (item.value !== TimeCriterion.ANY) {
        result += (result) ? ', ' : 'Вылет ';
        result += `обратно: ${item.text}`;
      }
    });
    return (result) ? result : this.props.placeholder;
  }

  private selectNode(item: IMultiSelectItem) {
    this.setState({
      isOpen: false,
      edited: this.getSelected().filter((el) => el.value !== TimeCriterion.ANY).length > 0,
    });
    this.props.onSelect(item.type, item.value);
  }

  private renderNodes(type: string) {
    return this.props.values.filter((val) => val.type === type).map((el) => {
      return (
        <a href="#" onClick={() => this.selectNode(el)} key={el.value}
           className={cx('link left-link', {inactive_link: !el.selected, current_link: el.selected})}>
          {el.text}
        </a>
      );
    });
  }

  public render() {
    return (
      <div data-delay="200" data-ix="select-arrow"
           className={cx('select filter-select w-hidden-medium w-hidden-small w-hidden-tiny w-dropdown',
             {edited: this.state.edited})}>
        <div className={cx('select-toggle no-border-select-toggle w-clearfix w-dropdown-toggle',
          {'w--open': this.state.isOpen})}>
          <div className="select-text left-select-text">{this.selectedToString()}</div>
          <img src="/public/images/down-red.svg" className="select-icon" />
        </div>
        <nav className={cx('nav-drop-list filter-select-list paddings-select-list w-clearfix w-dropdown-list',
          {'w--open': this.state.isOpen})}>
          <div className="tech-uc black-tech-uc">Вылет туда</div>
          <div className="options w-clearfix">
            {this.renderNodes('from_time')}
          </div>
          <div className="tech-uc black-tech-uc">Вылет обратно</div>
          <div className="options last w-clearfix">
            {this.renderNodes('to_time')}
          </div>
        </nav>
      </div>
    );
  }
}
