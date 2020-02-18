import * as React from 'react';
import {
  IAmenity, ICancellationInfo, IHotel, IImage,
  IImageList, IPaymentType, IPolicy, IPrice, IRate, IRoom, MealRates,
  PaymentTypes,
} from '../../../models/search/ISearchEntryHotel';
import moment = require('moment');
import { IProduct, IProductValue, ProductType } from '../../../models/purchasing/IProduct';
import { Loader } from '../Loader/Loader';
import { IPassengersInfo } from '../../../models/search/IPassengersInfo';
import { PropertySelectorHotel } from '../SearchBox/PropertySelectorHotel';
import { App } from '../../../containers/App';
const config = require('../../../../../config/main');

export interface IHotelDetailsProps {
  hotel: IHotel;
  price: IPrice;
  checkin: Date;
  checkout: Date;
  basket: IProduct[];
  passengers: IPassengersInfo;
  addToBasket: (basket: IProduct[], type: ProductType, value: any, note?: string) => any;
}
export interface IHotelDetailsState {
}
export class HotelDetails extends React.Component<IHotelDetailsProps, IHotelDetailsState> {
  constructor(props) {
    super(props);
    this.renderRooms = this.renderRooms.bind(this);
    this.renderDescription = this.renderDescription.bind(this);
    this.renderPayment = this.renderPayment.bind(this);
  }
  public componentDidMount() {
    if (typeof ($) !== 'undefined') {
      $('.toggle-description').on('click', (e) => {
        const toggle = $(e.target).closest('.toggle-description');
        toggle.hide();
        toggle.next('.full-description').show();
      });
      $('.result-more').on('click', (e) => {
        $(e.target).closest('.result-row').find('.additional-info').show();
      });
    }
  }
  private renderStars() {
    const res = [];
    for (let i = 0; i < this.props.hotel.star_rating / 10; i++) {
      res.push(<img src="/public/images/star-yellow.svg" key={this.props.hotel.id + i} className="hotelstar-icon"/>);
    }
    return res;
  }
  private renderDescription(description: string) {
    if (description && description.length > 140) {
      description = description.replace('&nbsp;', '');
      return (
        <div>
          {description.slice(0, 140)}
          <span className="p toggle-description">... <span className="p red-p">Показать полностью</span></span>
          <span className="full-description">{description.slice(141)}</span>
        </div>
      );
    } else {
      return description;
    }
  }

  private renderCancellation(cancellation: ICancellationInfo) {
    let max = 0;
    let message = '';
    cancellation.policies.forEach((policy: IPolicy) => {
      const num = Number(policy.penalty.amount);
      if (num > max) {
        max = num;
        // tslint:disable-next-line
        message = `В случае отмены бронирования, вы потеряете ${policy.penalty.amount} ${policy.penalty.currency_code} (${policy.penalty.percent}%) от суммы бронирования`
      }
    });
    const penaltyMessage = (cancellation.free_cancellation_before)
        ? (`Бесплатная отмена до ${moment(cancellation.free_cancellation_before).format('LL')}`)
        : message;
    return (
      <div className="hotelroom-detail w-clearfix">
        <img src="/public/images/refund-red.svg" className="hotelroom-icon"/>
        <div className="tech-text red-tech-text">
          {penaltyMessage}
        </div>
      </div>
    );
  }
  private typeHelper(type: string, by: string) {
    return PaymentTypes[type] + (by === 'credit_card' && type !== 'hotel' ? ' картой' : '');
  }
  private renderPayment(paymentTypes: IPaymentType[]) {
    if (paymentTypes.length === 1) {
      return this.typeHelper(paymentTypes[0].type, paymentTypes[0].by);
    } else {
      let accumulator = this.typeHelper(paymentTypes[0].type, paymentTypes[0].by);
      for (let i = 1; i < paymentTypes.length; i++) {
        accumulator += `или ${this.typeHelper(paymentTypes[i].type, paymentTypes[i].by).replace('Оплата', '')}`;
      }
      return accumulator;
    }
  }

  private getNecessaryInfo(hotel: IHotel, rate: IRate): IProductValue {
    return {
      id: 'hotel',
      hotel_id: hotel.id,
      book_hash: rate.book_hash,
      name: hotel.name,
      departure_date: this.props.checkin,
      arrival_date: this.props.checkout,
      expiration: moment().add(config.productExpiration.hotel, 'minutes').toDate(),
      link: location.pathname + location.search,
      price: Number(rate.rate_price.split('.')[0]),
      passengers: this.props.passengers.toJS(),
      room_name: rate.room_name,
    };
  }

  private renderRooms() {
    const roomsMap = {};
    this.props.price.rates.forEach((rate: IRate) => roomsMap[rate.room_group_id] = false);
    this.props.hotel.room_groups.forEach(
      (room: IRoom) => {
        if (roomsMap[room.room_group_id]) {
          roomsMap[room.room_group_id] = room;
        }
      });

    const ratesByGroupId = {};
    this.props.price.rates.forEach((rate: IRate) => {
      if (!ratesByGroupId.hasOwnProperty(rate.room_group_id)) {
        ratesByGroupId[rate.room_group_id] = [];
      }
      ratesByGroupId[rate.room_group_id].push(rate);
    });

    // tslint:disable
    const result = [];
    for (const groupId in ratesByGroupId) {
      const rates: IRate[] = ratesByGroupId[groupId];
      const room = roomsMap[rates[0].room_group_id];
      if (rates.length > 0) {
        result.push((
          <div key={groupId}>
            {room.name && (
              <div className="result-header w-clearfix">
                <h3 className="h3 left-h3" style={{margin: '10px 20px 10px 0'}}>{room.name}</h3>
                <div className="p left-p" style={{lineHeight: '30px', margin: '11px 0 0'}}>
                  {moment(this.props.checkin).format('LL')}
                  <span> — </span>
                  {moment(this.props.checkout).format('LL')}
                </div>
                <div className="p description-hotel">
                  {this.renderDescription(room.description)}
                </div>
              </div>
            )}
            <div className="hotelroom-block slider-block">
              <div data-animation="slide" data-duration="400" data-infinite="1" className="hotelroom-slider w-slider">
                <div className="mask w-slider-mask">
                  {room && room.image_list_tmpl.map((image: IImageList, i) => (
                    <div className="hotelroom-slide w-slide" key={image.src + i}>
                      <a href="#" className="hotelroom-lightbox w-inline-block w-lightbox">
                        <img
                          src={image.src.replace('{size}', '240x240')}
                          className="hotelroom-lightbox-img"/>
                        <script type="application/json" className="w-json" dangerouslySetInnerHTML={{__html: `{"items":[{"type":"image","_id": "${image.src}","fileName":null,"origFileName":"${image.src}","width":"${image.width}","height":"${image.height}","url":"${image.src.replace('{size}', '1080x522')}"}],"group":"${groupId}"}`}}/>
                      </a>
                    </div>
                  ))}
                </div>
                <div className="slider-left-arrow w-slider-arrow-left"><img src="/public/images/left-red.svg"/></div>
                <div className="slider-right-arrow w-slider-arrow-right"><img src="/public/images/right-red.svg"/></div>
                <div className="hotel-slider-nav w-slider-nav w-round"/>
              </div>
            </div>
            {rates.map((rate: IRate, index) => {
              const name = rate.room_name.split(' (');
              const title = name[0];
              let bedding = '';
              if (name.length == 2) {
                bedding = name[1].replace(')', '');
              }
              // 0 - only card, 1 - cash, 2 - card or cash
              let cardNeeded = false;
              rate.payment_options.payment_types.forEach((type: IPaymentType) => {
                cardNeeded = cardNeeded || (type.by === 'credit_card') || (type.is_need_credit_card_data);
              });
              return (
                <div className="hotelroom-block"
                     onClick={() => this.props.addToBasket(
                       this.props.basket,
                       ProductType.HOTEL_RESERVATION,
                       this.getNecessaryInfo(this.props.hotel, rate),
                       PropertySelectorHotel.renderString(this.props.passengers),
                     )}
                     key={rate.room_group_id + index}>
                  {index === 0 && (
                    <div className="result-tag">
                      <div>Самый выгодный</div>
                    </div>
                  )}
                  <div className="result-row w-row">
                    <div className="w-col w-col-10">
                      <div className="result-info">
                        <div className="p height-1-p">{title}</div>
                        <div className="tech-text margin-bottom-tech-text">
                          {bedding}
                        </div>
                      </div>
                    </div>
                    <div className="w-col w-col-2">
                      <div className="result-price">
                        <div className="p red-p height-1-p">{rate.rate_price.split('.')[0]} ₽</div>
                        <div className="tech-text red-tech-text opacity-tech-text">{rate.daily_prices[0].split('.')[0]} ₽ за ночь</div>
                      </div>
                    </div>
                  </div>
                  <div className="result-row result-row-last w-row">
                    <div className="w-col w-col-10">
                      <div className="result-info horizontal">
                        <div className="hotelroom-detail w-clearfix"><img src="/public/images/food-red.svg" className="hotelroom-icon"/>
                          <div className="tech-text red-tech-text" dangerouslySetInnerHTML={{__html: MealRates[rate.meal]}}/>
                        </div>
                        {this.renderCancellation(rate.cancellation_info)}
                        {/*<div className="hotelroom-detail w-clearfix"><img src="/public/images/timer-red.svg" className="hotelroom-icon"/>
                          <div className="tech-text red-tech-text">Зафиксированный курс</div>
                        </div>*/}
                        <div className="hotelroom-detail w-clearfix"><img src="/public/images/wallet-red.svg" className="hotelroom-icon"/>
                          <div className="tech-text red-tech-text">{this.renderPayment(rate.payment_options.payment_types)}</div>
                        </div>
                        <div className="hotelroom-detail last w-clearfix">
                          <img src={`/public/images/${rate ? 'card-red' : 'onlycash-red'}.svg`} className="hotelroom-icon"/>
                          <div className="tech-text red-tech-text">{cardNeeded ? 'Требуется банковская карта для бронирования' : 'Банковская карта не требуется'}</div>
                        </div>
                      </div>
                      {/*<div className="additional-info">

                      </div>*/}
                    </div>
                    <div className="w-col w-col-2">
                      <div className="result-price">
                        <div className="p red-p height-1-p">Выбрать</div>
                      </div>
                      {/*<div className="result-more">
                        <div className="p grey-p height-1-p">Подробнее</div>
                      </div>*/}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        ));
      }
    }
    return result;
  }
  public render() {
    const { hotel } = this.props;
    App.resetWebflow();
    const halfOfAmentities = Math.floor(hotel.amenities.length / 2);
    return (hotel) ? (
      <div>
        <div className="result-header w-clearfix">
          <h3 className="h3 left-h3 margin-bottom-h3">{hotel.name}</h3>
          <div className="hotelstars left-hotelstars">{this.renderStars()}</div>
        </div>
        <div data-animation="slide" data-duration="500" data-infinite="1" className="hotel-slider w-slider">
          <div className="w-slider-mask">
            {hotel.images.map((image: IImage, i) => (
              <div className="hotel-slide w-slide" key={image.url + i}>
                <a href="#" className="hotelroom-lightbox w-inline-block w-lightbox">
                  <img
                    src={image.url.replace('x220', '1080x522')}
                    className="hotelroom-lightbox-img"/>
                  <script type="application/json" className="w-json" dangerouslySetInnerHTML={{__html: `{"items":[{"type":"image","_id": "${image.url}","fileName":null,"origFileName":"${image.orig_url}","width":"${image.orig_width}","height":"${image.orig_height}","url":"${image.url.replace('x220', '1080x522')}"}],"group":"main-slider"}`}}/>
                </a>
              </div>
            ))}
          </div>
          <div className="slider-left-arrow w-slider-arrow-left"><img src="/public/images/left-red.svg"/></div>
          <div className="slider-right-arrow w-slider-arrow-right"><img src="/public/images/right-red.svg"/></div>
          <div className="hotel-slider-nav w-slider-nav w-round"/>
        </div>
        <div className="result no-hover-ticketinfo-block">
          <div className="result-row result-row-last w-row">
            <div className="w-col w-col-6">
              <div className="result-info w-clearfix"><a href="#" className="link height-1-link">{hotel.address}</a>
                {hotel.check_in_time && hotel.check_out_time && (
                  <div className="tech-text margin-bottom-tech-text">
                    <span className="span-black">{hotel.check_in_time.slice(0, 5)}</span> заезд
                    <span className="span-black"> {hotel.check_out_time.slice(0, 5)}</span> выезд
                  </div>
                )}
              </div>
            </div>
            {hotel.rating.exists && (
              <div className="w-col w-col-6">
                <div className="result-info w-clearfix">
                  <div className="ta w-clearfix">
                    <div className="p height-1-p">
                      <span className="span-ta">{hotel.rating.total_verbose}</span>
                    </div>
                  </div>
                  <div className="tech-text margin-bottom-tech-text">{hotel.rating.total} из 10</div>
                </div>
              </div>
            )}
          </div>
        </div>
        {this.renderRooms()}
        <div className="divider"/>
        <div className="result-header w-clearfix">
          <h3 className="h3 left-h3 margin-bottom-h3">Описание</h3>
        </div>
        <div className="result no-hover-ticketinfo-block">
          <div className="p margin-bottom-p" dangerouslySetInnerHTML={{__html: hotel.description}}/>
          <div className="rr-ticket-filter">
            <div className="result-row result-row-last w-row">
              <div className="w-col w-col-6">
                <div className="result-info">
                  {hotel.amenities.slice(0, halfOfAmentities)
                    .map((amenity: IAmenity) => (
                    <div className={`hotel-detail w-clearfix ${amenity.group_slug}`} key={amenity.group_slug}>
                      <div className="tech-text red-tech-text">{amenity.group_name}</div>
                      <div className="tech-text">{amenity.amenities.join(', ')}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="w-col w-col-6">
                <div className="result-info">
                  {hotel.amenities.slice(halfOfAmentities)
                    .map((amenity: IAmenity) => (
                    <div className={`hotel-detail w-clearfix ${amenity.group_slug}`} key={amenity.group_slug}>
                      <div className="tech-text red-tech-text">{amenity.group_name}</div>
                      <div className="tech-text">{amenity.amenities.join(', ')}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    ) : (
      <Loader hasOverLay={true}/>
    )
  }
}
