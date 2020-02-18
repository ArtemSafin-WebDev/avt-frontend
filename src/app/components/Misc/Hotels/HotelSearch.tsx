import * as React from 'react';
import { Link } from 'react-router';
import { IHotel, IRate } from '../../../models/search/ISearchEntryHotel';
import { ISearchProperties } from '../../../models/search/ISearchProperties';
import { ImagedCard } from '../../Landing/Card/ImagedCard';
import { ISearchProps } from '../../../containers/Search/SearchHotel';
import { queryParams } from '../../../helpers/HttpHelpers';
import { currencies } from '../../../redux/modules/search/service';

export interface IHotelSearchProps {
  hotel: IHotel;
  properties: ISearchProperties;
  URLProps: ISearchProps;
  onClick?: (hotel: IHotel) => void;
}
export interface IHotelSearchState {
}

export class HotelSearch extends React.Component<IHotelSearchProps, IHotelSearchState> {
  public readonly state: IHotelSearchState = {};

  constructor(props) {
    super(props);
  }
  private renderStars() {
    const res = [];
    for (let i = 0; i < this.props.hotel.stars / 10; i++) {
      res.push(<img src="/public/images/star-yellow.svg" key={this.props.hotel.id + i} className="hotelstar-icon"/>);
    }
    return res;
  }

  private getLinkToHotel(hotel: IHotel) {
    return `/book-hotel/${this.props.URLProps.city}/${hotel.id}?${queryParams(this.props.URLProps)}`;
  }

  public render() {
    const { hotel } = this.props;
    let minPrice = Infinity;
    let minPriceCur = 'RUB';
    hotel.rates.forEach((rate: IRate) => {
      const price = Number(rate.rate_price);
      if (price < minPrice) {
        minPrice = price;
        minPriceCur = rate.rate_currency;
      }
    });
    return (
      <Link to={this.getLinkToHotel(hotel)}
            target="_blank"
            className="result hotel-ticjetinfo-block w-inline-block"
            onClick={() => this.props.onClick(hotel)}>
        <div className="w-row">
          <div className="w-col w-col-4">
            <div className="result-hotelpreview">
              <img src={hotel.images && hotel.images[0] ? hotel.images[0].url : hotel.thumbnail}
                   className="hotelpreview-img"/>
            </div>
          </div>
          <div className="w-col w-col-6">
            <div className="result-info">
              <div className="p height-1-p">{hotel.name}</div>
              <div className="tech-text margin-bottom-tech-text">{ImagedCard.stripTags(hotel.description_short)}</div>
              <div className="hotelstars">{this.renderStars()}</div>
            </div>
          </div>
          <div className="w-col w-col-2">
            <div className="result-price">
              <div className="p red-p height-1-p">
                от {minPrice.toFixed()} {currencies[minPriceCur]}
              </div>
              <div className="tech-text red-tech-text opacity-tech-text">
                {hotel.amenities && hotel.amenities.length > 0 && hotel.amenities[0].amenities.slice(0, 3)
                  .map((am) => <div className="nowrap" key={hotel.name + am}>{am}</div>)}
              </div>
            </div>
          </div>
        </div>
      </Link>
    );
  }
}
