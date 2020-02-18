import * as React from 'react';
import { connect } from 'react-redux';
import {
  AccommodationKind, IMultiSelectItem,
  ISearchFilters, ServicesCriterion, StarsCriterion, TicketPriceSortingCriterion,
} from '../../../models/search/ISearchFilters';
import { DropdownSelect } from '../Input/DropdownSelect';
import { SearchActions } from '../../../redux/modules/search/actions';
import { getFilters } from '../../../redux/modules/search/selectors';
import { IStore } from '../../../redux/IStore';
import { ISearchState } from '../../../redux/modules/search/state';
import { SearchType } from '../../../models/search/SearchType';
import { getSearchResults } from '../../../redux/modules/search/service';
import { SearchFiltersAvia } from './SearchFiltersAvia';

export interface ISearchFiltersHotelsProps {
  search?: ISearchState;
  filters?: ISearchFilters;
  numberToDisplay: number;
  selectFilter?: any;
  getSearchResults?: any;
}
@(connect(
  (state: IStore) => ({
    search: state.get('search'),
    filters: getFilters(state),
  }),
  (dispatch) => ({
    selectFilter: (param: string, value: any) =>
      dispatch(SearchActions.selectFilter(param, value)),
    getSearchResults: (responseId: any, type: SearchType,
                       params: {offset?: number, limit?: number, filters?: ISearchFilters}) =>
      dispatch(getSearchResults(responseId, type, params)),
  }),
) as any)
export class SearchFiltersHotels extends React.Component<ISearchFiltersHotelsProps, any> {
  constructor(props) {
    super(props);
    this.onSelectProp = this.onSelectProp.bind(this);
  }

  private onSelectProp(prop: string, value: any) {
    this.props.selectFilter(prop, value);
  }

  private isSelected(type: string, value: any) {
    return this.props.filters.get(type) === value;
  }

  private isSelectedMultiple(type: string, value: any) {
    return this.props.filters.get(type).indexOf(value) > -1;
  }
  private generateFiltersSingle(type: any, keyValueMap: any): IMultiSelectItem[] {
    return Object.keys(keyValueMap).map((key) => {
      return {
        value: key,
        text: keyValueMap[key],
        selected: this.isSelected(type, key),
      };
    });
  }
  private generateFiltersMultiple(type: any, keyValueMap: any): IMultiSelectItem[] {
    return Object.keys(keyValueMap).map((key) => {
      return {
        value: key,
        text: keyValueMap[key],
        selected: this.isSelectedMultiple(type, key),
      };
    });
  }

  public render() {
    const priceCriteria = this.generateFiltersSingle('price', {
      [ TicketPriceSortingCriterion.RECOMMENDED ]: 'Сначала рекомендуемые',
      [ TicketPriceSortingCriterion.ASC ]: 'Сначала дешёвые',
      [ TicketPriceSortingCriterion.DESC ]: 'Cначала дорогие',
    });
    const servicesCriteria = this.generateFiltersMultiple('services', {
      [ ServicesCriterion.FREE_INTERNET ]: 'Бесплатный интернет',
      [ ServicesCriterion.FREE_BREAKFAST ]: 'Бесплатный завтрак',
      [ ServicesCriterion.PARKING ]: 'Паркинг',
      [ ServicesCriterion.TRANSFER ]: 'Трансфер',
      [ ServicesCriterion.SWIMMING_POOL ]: 'Бассейн',
      [ ServicesCriterion.FITNESS ]: 'Фитнес',
      [ ServicesCriterion.BAR_RESTAURANT ]: 'Бар, ресторан',
      [ ServicesCriterion.BATHROOM ]: 'Ванная в номере',
      [ ServicesCriterion.SPA ]: 'СПА процедуры',
    });
    const accommodationCriteria = this.generateFiltersMultiple('accommodation', {
      [ AccommodationKind.HOTEL ]: 'Отели',
      [ AccommodationKind.HOSTEL ]: 'Хостелы',
      [ AccommodationKind.APARTMENT ]: 'Апартаменты',
      [ AccommodationKind.MINIHOTEL ]: 'Мини-отели',
      [ AccommodationKind.BOUTIQUE ]: 'Бутик-отели',
      [ AccommodationKind.GUEST_HOUSE ]: 'Гостевые дома',
      [ AccommodationKind.VILLAS_AND_BUNGALOWS ]: 'Виллы и бунгало',
      [ AccommodationKind.COTTAGE ]: 'Коттеджи',
      [ AccommodationKind.SANATORIUM ]: 'Санатории',
      [ AccommodationKind.RESORT ]: 'Курорты',
      [ AccommodationKind.BNB ]: 'Bed & Breakfast',
      [ AccommodationKind.CAMPING ]: 'Кемпинги',
    });
    const starsCriteria = this.generateFiltersSingle('stars', {
      [ StarsCriterion.FIVE ]: '5 звезд',
      [ StarsCriterion.FOUR ]: '4 звезды и выше',
      [ StarsCriterion.THREE ]: '3 звезды и выше',
      [ StarsCriterion.TWO ]: '2 звезды и выше',
      [ StarsCriterion.ONE ]: '1 звезда и выше',
    });
    return (
      <div className="filter w-clearfix">
        <DropdownSelect selectable={false} selectLimit={1} values={priceCriteria}
                        customClass="w-hidden-medium w-hidden-small w-hidden-tiny"
                        onSelect={this.onSelectProp} placeholder={'Сначала рекомендуемые'} name={'price'}/>

        {/*<DropdownSelect selectable={true} selectLimit={3} values={
          this.generateFiltersMultiple('payment', {
            [ PaymentCriterion.AT_HOTEL ]: 'Оплата в отеле',
            [ PaymentCriterion.NOW ]: 'Оплата сейчас',
            [ PaymentCriterion.FREE_CANCELLING ]: 'Бесплатная отмена',
          })} onSelect={this.onSelectProp} placeholder={'Условия оплаты'} name={'payment'}/>*/}

        <DropdownSelect selectable={true} selectLimit={8} values={servicesCriteria}
                        customClass="w-hidden-medium w-hidden-small w-hidden-tiny"
                        onSelect={this.onSelectProp} placeholder={'Услуги и удобства'} name={'services'}/>

        <DropdownSelect selectable={true} selectLimit={9} values={accommodationCriteria}
                        customClass="w-hidden-medium w-hidden-small w-hidden-tiny"
                        onSelect={this.onSelectProp} placeholder={'Тип размещения'} name={'accommodation'}/>

        <DropdownSelect selectable={false} selectLimit={1} values={starsCriteria}
                        customClass="w-hidden-medium w-hidden-small w-hidden-tiny"
              onSelect={this.onSelectProp} placeholder={'Звезды'} name={'stars'}/>

        <div data-delay="200" className="mobile-filter w-hidden-main w-dropdown">
          <div className="mobile-filter-modified-toggle w-dropdown-toggle">
            <img src="/public/images/filter-red.svg"
                 className="icon-mobile-filter" />
            <div>Открыть фильтр</div>
          </div>
          <nav className="form-drop-list filter-drop-list w-clearfix w-dropdown-list" data-ix="form-drop-list">
            <a href="#" className="close_drop-list w-hidden-main w-inline-block" data-ix="form-drop-list-close">
              <img src="/public/images/close-red.svg"
                   onClick={() => $('.force-open').removeClass('force-open')} />
            </a>
            <div className="tech-uc black-tech-uc">Цена</div>
            {SearchFiltersAvia.renderMobileFilters('price', priceCriteria, this.onSelectProp)}
            <div className="tech-uc black-tech-uc">Услуги и удобства</div>
            {SearchFiltersAvia.renderMobileFilters('services', servicesCriteria, this.onSelectProp, true)}
            <div className="tech-uc black-tech-uc">Тип размещения</div>
            {SearchFiltersAvia.renderMobileFilters('accommodation', accommodationCriteria, this.onSelectProp, true)}
            <div className="tech-uc black-tech-uc">Звезды</div>
            {SearchFiltersAvia.renderMobileFilters('stars', starsCriteria, this.onSelectProp)}
          </nav>
        </div>
        {!this.props.search.get('isFetching') &&
          (!this.props.search.get('pristine') || !this.props.filters.get('pristine')) && (
          <p className="p red-p notify-p">Выберите необходимые критерии и нажмите кнопку "Найти"</p>
        )}
      </div>
    );
  }
}
