import * as React from 'react';
import * as cx from 'classnames';
import { SearchBoxAvia } from './SearchBoxAvia';
import { connect } from 'react-redux';
// import { SearchBoxTrain } from './SearchBoxTrain';
import { SearchActions } from '../../../redux/modules/search/actions';
import { SearchType } from '../../../models/search/SearchType';
import { IStore } from '../../../redux/IStore';
import { ISearchState } from '../../../redux/modules/search/state';
import { SearchBoxHotels } from './SearchBoxHotels';

export interface ISearchBoxProps {
  searchDestinations?: any;
  aviaOneWay?: boolean;
  changeCurrentType?: any;
  showMenu?: boolean;
  search?: ISearchState;
  pageName?: string;
}

export interface ISearchBoxState {
}

@(connect(
  (store: IStore) => ({
    search: store.get('search'),
  }),
  (dispatch) => ({
    changeCurrentType: (newType: SearchType) =>
      dispatch(SearchActions.changeCurrentType(newType)),
  }),
) as any)
export class SearchBox extends React.Component<ISearchBoxProps, ISearchBoxState> {
  constructor(props) {
    super(props);
    this.getCurrentType(props.search.get('currentType'));
  }

  public componentDidMount() {
    setTimeout(() => {
      if (typeof ($) !== 'undefined') {
        const currentType = this.props.search.get('currentType');
        $('.w-tab-link.w--current').removeClass('w--current');
        $('.w-tab-pane.w--tab-active').removeClass('w--tab-active');
        $(`.w-tab-link[data-type="${currentType}"]`).addClass('w--current');
        $(`.w-tab-pane[data-type="${currentType}"]`).addClass('w--tab-active');
      }
    }, 500);
  }

  private getCurrentType(currentType: SearchType) {
    // hotels = hotel
    if (this.props.pageName && currentType !== this.props.pageName.replace(/[s]$/, '')) {
      switch (this.props.pageName) {
        case 'main':
        case 'avia':
          this.props.changeCurrentType(SearchType.Avia);
          return SearchType.Avia;
        case 'train':
        case 'railway':
          this.props.changeCurrentType(SearchType.Train);
          return SearchType.Train;
        case 'hotels':
        case 'hotel':
          this.props.changeCurrentType(SearchType.Hotel);
          return SearchType.Hotel;
        default:
          return currentType;
      }
    }
    return currentType;
  }

  public render() {
    if (typeof this.props.search === 'object') {
      const currentType = this.props.search.get('currentType');
      return (
        <div className="search-tabs w-tabs">
          {this.props.showMenu && (
            <div className="tabs-menu w-clearfix w-tab-menu">
              <a onClick={() => this.props.changeCurrentType(SearchType.Avia)} className={cx({
                'search-tablink white w-inline-block w-tab-link': true,
                'w--current': currentType === SearchType.Avia,
              })}
              data-type={SearchType.Avia}>
                <img src="/public/images/plane-white.svg" className="tabs-icon"/>
                <div>Авиа</div>
              </a>
              {/*<a data-w-tab="Raliway" onClick={() => this.props.changeCurrentType(SearchType.Train)} className={cx({
                'search-tablink white w-inline-block w-tab-link': true,
                'w--current': currentType === SearchType.Train,
              })}>
                <img src="/public/images/train-white.svg" className="tabs-icon"/>
                <div>ЖД</div>
              </a>*/}
              <a onClick={() => this.props.changeCurrentType(SearchType.Hotel)} className={cx({
                'search-tablink white w-inline-block w-tab-link': true,
                'w--current': currentType === SearchType.Hotel,
              })}
               data-type={SearchType.Hotel}>
                <img src="/public/images/hotel-white.svg" className="tabs-icon"/>
                <div>Отели</div>
              </a>
            </div>
          )}
          <div className="search-tabscontent w-tab-content">
            <div className={cx({
              'w-tab-pane': true,
              'w--tab-active': currentType === SearchType.Avia,
            })}
                 data-type={SearchType.Avia}>
              <SearchBoxAvia oneWay={this.props.aviaOneWay} />
            </div>
            {/*<div data-w-tab="Raliway" className={cx({
              'w-tab-pane': true,
              'w--tab-active': currentType === SearchType.Train,
            })}>
              <SearchBoxTrain />
            </div>*/}
            <div className={cx({
              'w-tab-pane': true,
              'w--tab-active': currentType === SearchType.Hotel,
            })}
                 data-type={SearchType.Hotel}>
              <SearchBoxHotels/>
            </div>
          </div>
        </div>
      );
    } else {
      return (<div/>);
    }
  }
}
