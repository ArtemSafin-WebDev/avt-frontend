import * as React from 'react';
import * as cx from 'classnames';
import { connect } from 'react-redux';
import {
  IMultiSelectItem,
  ISearchFilters,
  TicketChangesCriterion,
  TicketPriceSortingCriterion, TimeCriterion,
} from '../../../models/search/ISearchFilters';
import { DropdownSelect } from '../Input/DropdownSelect';
import { SearchActions } from '../../../redux/modules/search/actions';
import { getFilters } from '../../../redux/modules/search/selectors';
import { IStore } from '../../../redux/IStore';
import { ISearchState } from '../../../redux/modules/search/state';
import { DropdownMultiColumn } from '../Input/DropdownMultiColumn';

export interface ISearchFiltersAviaProps {
  search?: ISearchState;
  filters?: ISearchFilters;
  selectFilter?: any;
}
@(connect(
  (state: IStore) => ({
    search: state.get('search'),
    filters: getFilters(state),
  }),
  (dispatch) => ({
    selectFilter: (param: string, value: string) =>
      dispatch(SearchActions.selectFilter(param, value)),
  }),
) as any)
export class SearchFiltersAvia extends React.Component<ISearchFiltersAviaProps, any> {
  constructor(props) {
    super(props);
    this.onSelectProp = this.onSelectProp.bind(this);
    this.onSelectMultiSelect = this.onSelectMultiSelect.bind(this);
  }

  private onSelectProp(prop: string, value: any) {
    this.props.selectFilter(prop, value);
  }

  private onSelectMultiSelect(prop: string, value: any[]) {
    // Turns selection on for `el.value === value`
    this.props.selectFilter(prop, this.props.filters.get(prop).map((el: IMultiSelectItem) => {
      el.selected = value.indexOf(el.value) > -1;
      return el;
    }));
  }

  private isSelected(type: string, value: any) {
    return this.props.filters.get(type) === value;
  }

  public static renderMobileFilters(
              type: string,
              items: IMultiSelectItem[],
              onClick: (prop: string, value: any) => any,
              multiple = false) {
    return (
      <div className="options w-clearfix">
        {items.map((el) => {
          return (
            <a href="#" key={el.value} onClick={(e) => {
              e.preventDefault();
              $('.mobile-filter .form-drop-list')
                .addClass('force-open')
                .addClass('w--open');
              if (multiple) {
                const alreadySelected = items.find((cur) => (cur.value === el.value)).selected;
                if (!alreadySelected) {
                  onClick(type, [...items
                                      .filter((el) => el && el.selected)
                                      .map((el) => el.value),
                                 el.value]);
                } else if (alreadySelected) {
                  onClick(type, items
                                  .filter((cur) => cur && cur.selected && cur.value !== el.value)
                                  .map((cur) => cur.value));
                }
              } else {
                onClick(type, el.value);
              }
              return false;
            }}
               className={cx('link left-link', {
                 current_link: el.selected,
                 inactive_link: !el.selected,
                 multiple,
               })}>
              {multiple ? (
                <div>
                  <input type="checkbox" id={el.value} name={el.value}
                         className="checkbox-thing w-checkbox-input" />
                  <div className={cx('checkbox-icon', {inactive: !el.selected, active: el.selected})}>
                    <img src="/public/images/check-red.svg" />
                  </div>
                  <label htmlFor={el.value} className="checkbox-text w-form-label">{el.text}</label>
                </div>
              ) : el.text}
            </a>
          );
        })}
      </div>
    );
  }

  public render() {
    const priceCriteria = [
      {value: TicketPriceSortingCriterion.RECOMMENDED, text: 'Сначала рекомендуемые',
        selected: this.isSelected('price', TicketPriceSortingCriterion.RECOMMENDED)},
      {value: TicketPriceSortingCriterion.ASC, text: 'Сначала дешёвые',
        selected: this.isSelected('price', TicketPriceSortingCriterion.ASC)},
      {value: TicketPriceSortingCriterion.DESC, text: 'Cначала дорогие',
        selected: this.isSelected('price', TicketPriceSortingCriterion.DESC)},
    ];
    const changeCriteria = [
      {value: TicketChangesCriterion.WITH_CHANGES, text: 'С пересадками',
        selected: this.isSelected('changes', TicketChangesCriterion.WITH_CHANGES)},
      {value: TicketChangesCriterion.WITHOUT_CHANGES, text: 'Без пересадок',
        selected: this.isSelected('changes', TicketChangesCriterion.WITHOUT_CHANGES)},
    ];
    const flightTimeCriteria = [
      {value: TimeCriterion.MORNING, text: 'Утро', type: 'from_time',
        selected: this.isSelected('from_time', TimeCriterion.MORNING)},
      {value: TimeCriterion.DAY, text: 'День', type: 'from_time',
        selected: this.isSelected('from_time', TimeCriterion.DAY)},
      {value: TimeCriterion.EVENING, text: 'Вечер', type: 'from_time',
        selected: this.isSelected('from_time', TimeCriterion.EVENING)},
      {value: TimeCriterion.NIGHT, text: 'Ночь', type: 'from_time',
        selected: this.isSelected('from_time', TimeCriterion.NIGHT)},
      {value: TimeCriterion.ANY, text: 'Любое', type: 'from_time',
        selected: this.isSelected('from_time', TimeCriterion.ANY)},
      {value: TimeCriterion.MORNING, text: 'Утро', type: 'to_time',
        selected: this.isSelected('to_time', TimeCriterion.MORNING)},
      {value: TimeCriterion.DAY, text: 'День', type: 'to_time',
        selected: this.isSelected('to_time', TimeCriterion.DAY)},
      {value: TimeCriterion.EVENING, text: 'Вечер', type: 'to_time',
        selected: this.isSelected('to_time', TimeCriterion.EVENING)},
      {value: TimeCriterion.NIGHT, text: 'Ночь', type: 'to_time',
        selected: this.isSelected('to_time', TimeCriterion.NIGHT)},
      {value: TimeCriterion.ANY, text: 'Любое', type: 'to_time',
        selected: this.isSelected('to_time', TimeCriterion.ANY)},
    ];

    return (
      <div className="filter w-clearfix">
        <DropdownSelect selectable={false} selectLimit={1} values={priceCriteria}
                        customClass="w-hidden-medium w-hidden-small w-hidden-tiny"
                        onSelect={this.onSelectProp} placeholder={'Сначала рекомендуемые'} name={'price'}/>

        <DropdownSelect selectable={false} selectLimit={1} values={changeCriteria}
                        customClass="w-hidden-medium w-hidden-small w-hidden-tiny"
                        onSelect={this.onSelectProp} placeholder={'С пересадками'} name={'changes'}/>

        <DropdownMultiColumn values={flightTimeCriteria} onSelect={this.onSelectProp}
                             placeholder={'Время вылета'} name={'flight_time'}/>

        <DropdownSelect selectable={true} selectLimit={this.props.filters.get('airports').count()}
                        customClass="w-hidden-medium w-hidden-small w-hidden-tiny"
                        values={this.props.filters.get('airports').toArray()}
                        onSelect={this.onSelectMultiSelect} placeholder={'Аэропорты'} name={'airports'}/>

        <DropdownSelect selectable={true} selectLimit={this.props.filters.get('airlines').count()}
                        customClass="w-hidden-medium w-hidden-small w-hidden-tiny"
                        values={this.props.filters.get('airlines').toArray()}
                        onSelect={this.onSelectMultiSelect} placeholder={'Авиакомпании'} name={'airlines'}/>

        <div data-delay="200" className="mobile-filter w-hidden-main w-dropdown">
          <div className="mobile-filter-modified-toggle"
               onClick={(e) => {
                 e.stopPropagation();
                 $('.filter-drop-list, .mobile-filter-modified-toggle').addClass('w--open');
                 return false;
               }}>
            <img src="/public/images/filter-red.svg"
                 className="icon-mobile-filter" />
            <div>Открыть фильтр</div>
          </div>
          <nav className="form-drop-list filter-drop-list w-clearfix w-dropdown-list" data-ix="form-drop-list">
            <a href="#" className="close_drop-list w-hidden-main w-inline-block" data-ix="form-drop-list-close">
              <img src="/public/images/close-red.svg"
                   onClick={() => {
                     $('.force-open').removeClass('force-open');
                     $('.filter-drop-list, .mobile-filter-modified-toggle').removeClass('w--open');
                   }} />
            </a>
            <div className="tech-uc black-tech-uc">Цена</div>
            {SearchFiltersAvia.renderMobileFilters('price', priceCriteria, this.onSelectProp)}
            <div className="tech-uc black-tech-uc">Пересадки</div>
            {SearchFiltersAvia.renderMobileFilters('changes', changeCriteria, this.onSelectProp)}
            <div className="tech-uc black-tech-uc">Вылет туда</div>
            {SearchFiltersAvia.renderMobileFilters(
              'from_time',
              flightTimeCriteria.filter((el: IMultiSelectItem) => el.type === 'from_time'),
              this.onSelectProp,
            )}
            <div className="tech-uc black-tech-uc">Вылет обратно</div>
            {SearchFiltersAvia.renderMobileFilters(
              'to_time',
              flightTimeCriteria.filter((el: IMultiSelectItem) => el.type === 'to_time'),
              this.onSelectProp,
            )}
            <div className="tech-uc black-tech-uc">Аэропорты</div>
            {SearchFiltersAvia.renderMobileFilters(
              'airports',
              this.props.filters.get('airports').toArray(),
              this.onSelectMultiSelect,
              true,
            )}
            <div className="tech-uc black-tech-uc">Авиакомпании</div>
            {SearchFiltersAvia.renderMobileFilters(
              'airlines',
              this.props.filters.get('airlines').toArray(),
              this.onSelectMultiSelect,
              true,
            )}
          </nav>
        </div>
      </div>
    );
  }
}
