import * as React from 'react';
import { connect } from 'react-redux';
import { IHotel } from '../../models/search/ISearchEntryHotel';
import { Hotel } from '../../containers/Hotel/Hotel';
import { ImagedCard } from '../Landing/Card/ImagedCard';
import * as moment from 'moment';
import { actualizeRates, currencies, formatHotelSearchRequestURL } from '../../redux/modules/search/service';
import { ISearchProperties } from '../../models/search/ISearchProperties';
import { SearchActions } from '../../redux/modules/search/actions';
import { IPassengersInfo } from '../../models/search/IPassengersInfo';
import { Link } from 'react-router';
import { queryParams } from '../../helpers/HttpHelpers';

export interface ISimilarHotelsProps {
  hotels: IHotel[];
  passengers: IPassengersInfo;
  properties: ISearchProperties;
  currentHotel: number;
  selectCurrentHotel?: any;
  actualizeRates?: any;
  responseId?: any;
  cityName?: string;
}
export interface ISimilarHotelsState {
  similarHotelsIndex: number;
}
@(connect(
  () => ({
  }),
  (dispatch) => ({
    selectCurrentHotel: (ticket: any) =>
      dispatch(SearchActions.selectCurrentSearchEntry(ticket)),
    actualizeRates: (hotelId: string, properties: ISearchProperties, passengers: IPassengersInfo) =>
      dispatch(actualizeRates(hotelId, properties, passengers)),
  }),
) as any)
export class SimilarHotels extends React.Component<ISimilarHotelsProps, ISimilarHotelsState> {
  public readonly state: ISimilarHotelsState = {
    similarHotelsIndex: 0,
  };

  constructor(props) {
    super(props);
  }
  private getLinkToHotel(hotel: IHotel) {
    const parts = {
      city: hotel.city || this.props.cityName,
      checkin: moment(this.props.properties.get('departure_date')).format('DDMM'),
      checkout: moment(this.props.properties.get('arrival_date')).format('DDMM'),
      adults: this.props.passengers.get('adults'),
      children: this.props.passengers.get('children_of_year').join(','),
    };
    return `/book-hotel/${hotel.city || this.props.cityName}/${hotel.id}?${queryParams(parts)}`;
  }

  public render() {
    let previousHotel: IHotel, nextHotel: IHotel, isSimilarHotelsAvailable = false;
    const allHotels = this.props.hotels.filter((hotel: IHotel) => !!hotel.thumbnail);
    const index = this.state.similarHotelsIndex || this.props.currentHotel;
    if (allHotels.length > 1) {
      isSimilarHotelsAvailable = true;
      previousHotel = allHotels[Hotel.mod((index - 1), allHotels.length)];
      nextHotel = allHotels[(index + 1) % allHotels.length];
    }
    return (isSimilarHotelsAvailable) && (
      <div>
        <div className="result-header w-clearfix">
          <h3 className="h3 left-h3 margin-bottom-h3">Отели в г. {this.props.cityName}</h3>
          <Link to={`/search-hotel/${formatHotelSearchRequestURL(this.props.properties,
                                                                 this.props.passengers, this.props.responseId)}`}
                target="_blank"
                onClick={() => { $('html,body').animate({scrollTop: 0}, 'slow'); }}
                className="link">Открыть поиск отелей</Link>
        </div>
        <div className="result-additional similar-hotels">
          <div className="row flex-row w-clearfix">
            <div className="column-50">
              <ImagedCard
                title={previousHotel.name}
                description={previousHotel.description_short.substring(0, 60)}
                imageURL={previousHotel.thumbnail}
                actionIconURL="empty"
                target="_blank"
                starsCount={Math.floor(previousHotel.star_rating / 10)}
                actionURL={this.getLinkToHotel(previousHotel)}
                actionText={`От ${Number(previousHotel.rates[0].rate_price).toFixed()}`
                            + ` ${currencies[previousHotel.rates[0].rate_currency]}`} />
            </div>
            <div className="column-50">
              <ImagedCard
                title={nextHotel.name}
                description={nextHotel.description_short.substring(0, 60)}
                imageURL={nextHotel.thumbnail}
                actionIconURL="empty"
                starsCount={Math.floor(nextHotel.star_rating / 10)}
                target="_blank"
                actionURL={this.getLinkToHotel(nextHotel)}
                actionText={`От ${Number(nextHotel.rates[0].rate_price).toFixed()}`
                         + `${currencies[nextHotel.rates[0].rate_currency]}`} />
            </div>
          </div>
          <a href="#" className="wide-button w-inline-block"
             onClick={() => this.setState({similarHotelsIndex: (index + 2) % allHotels.length})}>
            <img src="/public/images/arrow-white.svg" className="icon-more"/>
            <div>Следующие отели</div>
          </a>
        </div>
      </div>
    );
  }
}
