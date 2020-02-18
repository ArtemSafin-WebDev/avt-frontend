import * as React from 'react';
import * as moment from 'moment';
import { App } from '../../containers/App';
import { Loader } from '../Misc/Loader/Loader';
import { IOrder } from '../../models/purchasing/IOrder';
import { IDirection, IProduct, ProductType } from '../../models/purchasing/IProduct';
import { IUser } from '../../models/users';
import { Basket } from './Basket';
import { ILegalEntity } from '../../models/legalEntities';
import { List } from 'immutable';

export interface IOrderProfileProps {
  order: IOrder;
  legalEntities: List<ILegalEntity>;
  users: List<IUser>;
}

export interface IOrderProfileState {
}

export class OrderProfile extends React.Component<IOrderProfileProps, IOrderProfileState> {
  constructor(props) {
    super(props);
  }

  public static getProductTitle(product: IProduct) {
    const { name } = product.value;
    switch (product.type) {
      case ProductType.EXTRA_ITEM:
      case ProductType.HOTEL_RESERVATION:
      default:
        return name;
      case ProductType.TICKET_RAILWAY:
      case ProductType.TICKET_AVIA:
        return product.value.directions.map((dir: IDirection) =>
          (dir.titleExtended) ? dir.titleExtended : dir.title).join(', ');
    }
  }
  public static getProductIcon(product: IProduct) {
    switch (product.type) {
      case ProductType.HOTEL_RESERVATION: return 'hotel-red';
      case ProductType.TICKET_RAILWAY: return 'plane-red';
      case ProductType.TICKET_AVIA: return 'plane-red';
      case ProductType.EXTRA_ITEM:
      default: return 'other-red_1';
    }
  }

  private renderHeaderNodes(products: IProduct[]) {
    return products.map((product: IProduct) =>  (
        <div className="order-drop-info w-clearfix" key={product.id}>
          <img src={`/public/images/${OrderProfile.getProductIcon(product)}.svg`} className="oder-drop-icon"/>
          <div className="p red-p height-1-p left-p white-space-normal">
            {OrderProfile.getProductTitle(product)}
          </div>
        </div>
    ));
  }

  public render() {
    const { order } = this.props;
    App.resetWebflow();
    let dates = '';
    order.cart.items.forEach((product: IProduct) => {
      if (product.value.departure_date) {
        dates = moment(product.value.departure_date).format('D MMMM')
          + ' — ' +  moment(product.value.arrival_date).format('D MMMM');
      }
    });
    const user = this.props.users && this.props.users
      .find((user: IUser) => user.get('id') === order.user_id);
    let legalEntity;
    if (user) {
      legalEntity = this.props.legalEntities.find((entity: ILegalEntity) =>
        entity.get('id') === user.getIn(['legal_entities', '0']));
    }
    return (order) ? (
      <div data-delay="200" className="order-drop w-dropdown">
        <div className="order-drop-toggle _w-space-normal w-dropdown-toggle">
          <div className="order-drop-top w-clearfix">
            {this.renderHeaderNodes(order.cart.items)}
          </div>
          <div className="order-drop-bottom">
            <div className="w-row">
              {dates && (
                <div className="w-col w-col-5">
                  <div className="result-info">
                    <div className="p height-1-p">{dates}</div>
                    <div className="tech-text">Даты</div>
                  </div>
                </div>
              )}
              {user && (
                <div className="w-col w-col-5">
                  <div className="result-info">
                    <div className="p height-1-p">
                      {user.get('last_name')} {user.get('first_name')}
                      </div>
                    <div className="tech-text">Заказал</div>
                  </div>
                </div>
              )}
              <div className="w-col w-col-2">
                <div className="result-price">
                  <div className="p red-p height-1-p">{order.amount} ₽</div>
                  <div className="tech-text red-tech-text opacity-tech-text">
                    {order.status ? order.status : ''}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <nav className="order-drop-list w-dropdown-list" data-ix="order-droplist">
          <div className="order-details" data-ix="form-drop-list">
            <div className="result-header w-clearfix">
              <h3 className="h3 left-h3 margin-bottom-h3">Детали заказа</h3>
              <div className="p left-p">{order.cart.passengers.length} человек(а)</div>
              {legalEntity && (<div className="p left-p">{legalEntity.get('title')}</div>)}
            </div>
            <div className="order-details-block last w-clearfix">
              {order.cart.passengers.map((user: IUser, i: number) => (
                <a key={'' + order.id + user.id + i} className="link left-link">
                  {user.last_name} {user.first_name}
                </a>
              ))}
            </div>
          </div>
          <Basket placement={'order'}
                  forcedBasket={order.cart.items}/>
          <div className="order-details paddings-order-details w-clearfix">
            <div className="tech-text right-tech-text margin-top-tech-text">
              Поможем уточнить любую информацию по вашему заказу
            </div>
          </div>
        </nav>
      </div>
    ) : (
      <Loader/>
    );
  }
}
