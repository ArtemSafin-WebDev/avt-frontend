import * as React from 'react';
import * as moment from 'moment';
import * as cx from 'classnames';
import { connect } from 'react-redux';
import { IStore } from '../../redux/IStore';
import { getBasket } from '../../redux/modules/purchasing/selectors';
import { IPurchasingState } from '../../redux/modules/purchasing/state';
import { IDirection, IProduct, ProductType } from '../../models/purchasing/IProduct';
import { PurchasingActions } from '../../redux/modules/purchasing/actions';
import { Iterable } from 'immutable';
import { Link } from 'react-router';
import { getAuthStatus } from '../../redux/modules/users/selectors';
import { getPassengersOfType } from '../../redux/modules/search/selectors';
import { IPassengersInfo } from '../../models/search/IPassengersInfo';
import { push } from 'react-router-redux';

export interface IBasketProps {
  isAuthenticated?: boolean;
  additionalClasses?: string;
  purchasing?: IPurchasingState;
  passengers?: IPassengersInfo;
  basket?: any;
  forcedBasket?: IProduct[];
  placement: string;
  initBasket?: (products: IProduct[]) => any;
  removeFromBasket?: any;
  redirect?: (route: string) => any;
}
export interface IBasketState {
}

const types = {
  [ProductType.HOTEL_RESERVATION]: 'Отель',
  [ProductType.TICKET_AVIA]: 'Авиабилеты',
  [ProductType.TICKET_RAILWAY]: 'ЖД билеты',
  [ProductType.EXTRA_ITEM]: '',
};

@(connect(
  (state: IStore) => ({
    purchasing: state.get('purchasing'),
    passengers: getPassengersOfType(state.getIn(['search', 'currentType']))(state),
    isAuthenticated: getAuthStatus(state),
    basket: getBasket(state),
  }),
  (dispatch) => ({
    initBasket: (products: IProduct[]) => dispatch(PurchasingActions.initBasket(products)),
    removeFromBasket: (id: number) => dispatch(PurchasingActions.removeFromBasket(id)),
    redirect: (route: string) => dispatch(push(route)),
  }),
) as any)
export class Basket extends React.Component<IBasketProps, IBasketState> {
  public readonly state: IBasketState = {
  };

  constructor(props) {
    super(props);
  }

  private typeToText = (type: ProductType, name: string) => {
    return (types[type]) ? types[type] : name;
  }

  /**
   * @param num: length of decimal
   * @param n: length of decimal
   * @param x: length of sections
   */
  public static format = (num: number, n: number, x: number) => {
    const re = '\\d(?=(\\d{' + (x || 3) + '})+' + (n > 0 ? '\\.' : '$') + ')';
    // tslint:disable-next-line
    return num.toFixed(Math.max(0, ~~n)).replace(new RegExp(re, 'g'), '$& ');
  }

  private interval = null;
  public componentDidMount() {
    this.interval = setInterval(() => {
      const basket = JSON.parse(localStorage.getItem('basket'));
      if (basket && basket instanceof Array) {
        if (basket.length !== this.props.basket.length) {
          this.props.initBasket(basket || []);
        }
        basket.forEach((product: IProduct, i) => {
          if (!this.props.basket[i] || this.props.basket[i].id !== product.id) {
            this.props.initBasket(basket || []);
          }
        });
      }
    }, 10000);
  }
  public componentWillUnmount() {
    clearInterval(this.interval);
  }

  private renderProduct = (product: IProduct) => {
    const { name, price, expiration } = product.value;
    return (
      <div className={cx('cart-info', {extra: product.type === ProductType.EXTRA_ITEM})} key={product.id}>
        <div className="cart-row">
          <div className="cart-row-column">
            <div className="p">{this.typeToText(product.type, name)}</div>
          </div>
          <div className="cart-row-column w-clearfix">
            {this.props.placement !== 'order' && (
              <img src="/public/images/trash-red.svg" className="image"
                   onClick={() => this.props.removeFromBasket(product.id)}/>
            )}
            <div className="p red-p right-p">
              {(this.props.placement !== 'order' && expiration && moment(expiration).isBefore(moment()))
                ? (<span/>)
                : (price > 0)
                  ? (<span>{`${Basket.format(price, 0, 3)} ₽`}</span>)
                  : (<span/>)}
              </div>
          </div>
        </div>
        {this.renderSubProduct(product)}
      </div>
    );
  }
  private renderSubProduct = (product: IProduct) => {
    const { name, price, link, expiration } = product.value;
    switch (product.type) {
      case ProductType.HOTEL_RESERVATION:
        return (
          <Link to={link || '#'} className="cart-sub">
            <div className="tech-text black-tech-text">{name}</div>
            <div className="tech-text">
              {moment(product.value.departure_date).format('LL')}
              <span> — </span>
              {moment(product.value.arrival_date).format('LL')}
            </div>

            <div className="tech-text">{product.value.room_name}</div>
            <div className="tech-text" style={{color: '#f67c8a'}}>{product.note}</div>
          </Link>
        );
      case ProductType.TICKET_RAILWAY:
      case ProductType.TICKET_AVIA:
        if (this.props.placement === 'order') {
          return (
            <div data-id={product.id.toString()}
                  className="cart-sub">
              {product.value.directions.map((dir: IDirection, i) => (
                <div key={dir.id + i}>
                  <div className="tech-uc black-tech-uc">{dir.title}</div>
                  <div className="tech-text margin-bottom-tech-text">{dir.dates}</div>
                </div>
              ))}
              {product.value.tariff && (
                <div className="tech-text" style={{ color: '#f93a50' }}>{product.value.tariff}</div>
              )}
              <div className="tech-text" style={{ color: '#f67c8a' }}>{product.note}</div>
            </div>
          );
        } else {
          const disabled =  moment(expiration).isBefore(moment());
          if (!disabled) {
            setTimeout(() => {
              $(`.cart-sub[data-id=${product.id}]`).addClass('disabled');
            }, Math.abs(moment().diff(moment(expiration))));
          }
          return (
            <Link to={product.value.link || '#'} target="_blank" data-id={product.id.toString()}
                  className={cx('cart-sub', { disabled })}>
              {product.value.directions.map((dir: IDirection, i) => (
                <div key={dir.id + i}>
                  <div className="tech-uc black-tech-uc">{dir.title}</div>
                  <div className="tech-text margin-bottom-tech-text">{dir.dates}</div>
                </div>
              ))}
              {product.value.tariff && (
                <div className="tech-text" style={{ color: '#f93a50' }}>{product.value.tariff}</div>
              )}
              <div className="tech-text" style={{ color: '#f67c8a' }}>{product.note}</div>
              <div onClick={() => this.props.removeFromBasket(product.id)}
                   className="button w-button reload-button">Обновить</div>
            </Link>
          );
        }
      case ProductType.EXTRA_ITEM:
      default:
        return (price < 0) ? (
          <div className="cart-sub">
            <div className="tech-text red-tech-text">Цену и детали уточнит менеджер</div>
          </div>
        ) : null;
    }
  }

  public render() {
    let basket = (this.props.forcedBasket) ? this.props.forcedBasket : this.props.basket;
    if (Iterable.isIterable(basket)) {
      basket = basket.toJS();
    }
    let foundLastExtra = false;
    const extra = [];
    basket = basket.filter((el: IProduct) => {
      if (el.type === ProductType.EXTRA_ITEM) {
        extra.push(el);
        return false;
      } else {
        return true;
      }
    });
    basket = basket.concat(extra);
    // Remove unnecessarily banners from extra products
    if (basket.length > 0) {
      for (let i = basket.length - 1; i >= 0; i--) {
        if (basket[i].type === ProductType.EXTRA_ITEM) {
          if (!foundLastExtra) {
            foundLastExtra = true;
          } else {
            basket[i].value.price = 0;
          }
        }
      }
    }
    let intermediatePrice = basket.reduce(
      (accumulator, current: IProduct) => accumulator
        + ((current.value.price > 0) ? current.value.price : 0), 0);
    if (!this.props.isAuthenticated) {
      intermediatePrice *= 1.025;
    }
    return (
      <div className={cx(`cart ${this.props.placement}-cart`,
        {'w-hidden-medium w-hidden-small w-hidden-tiny': this.props.placement === 'rightside'})}
           data-ix={this.props.placement === 'bottom' ? 'cart-scroll' : ''}>
        {this.props.purchasing.get('error') && (
          <div className="cart-error">
            <img src="/public/images/error.svg" className="formmessage-icon"/>
            <h3 className="h3 red-h3 center-h3">Что-то пошло не так!</h3>
            <div className="p center-p">
              Пожалуйста проверьте соединение интернета и попробуйте заново.
              <a className="span-link">Свяжитесь с нами</a>, если будет так же
            </div>
          </div>
        )}
        {basket.length === 0 ? (
          <div className="cart-placeholder">
            <img src="/public/images/empty-black.svg" className="formmessage-icon opacity"/>
            <h3 className="h3 grey-h3 center-h3">Пусто</h3>
            <div className="p grey-p center-p">Воспользуйтесь меню и поиском, чтобы найти подходящие услуги</div>
          </div>
        ) : basket.map((product) => this.renderProduct(product))}
        {/* Костыль ряди верстки */}
        {basket.length > 0 && intermediatePrice > 0 && this.props.placement !== 'order' && (
          <div className="cart-row last">
            <div className="cart-row-column">
              <div className="p red-p" style={{fontSize: 16, lineHeight: `1.5`}}>
                {this.props.isAuthenticated ? (
                  'Промежуточная цена'
                ) : (
                  'Конечная сумма с учетом комиссии эквайринга составит'
                )}

              </div>
            </div>
            <div className="cart-row-column no-shrink">
              <h3 className="h3 red-h3 right-h3 margin-bottom-h3">{Basket.format(intermediatePrice, 0, 3)} ₽</h3>
            </div>
          </div>
        )}

        {basket.length > 0 && this.props.placement !== 'order' && (
          <Link to="/offer"
                onClick={() => $('html,body').animate({scrollTop: 0}, 'slow')}
                className="button-cart w-button">
            Оформить заказ
          </Link>
        )}
      </div>
    );
  }
}
