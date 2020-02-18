import * as React from 'react';
import { Link } from 'react-router';
import './style.css';
import { connect } from '../../redux/connect';
import { IStore } from '../../redux/IStore';
import { userLogout } from 'redux/modules/users/service';
import { ActionCreator } from 'redux';
import { IUserAction } from '../../models/users';
import { getPageList } from '../../redux/modules/pages/service';
import { Basket } from '../Purchasing/Basket';

export interface IHeaderProps {
  isAuthenticated?: boolean;
  isOnePort?: boolean;
  hideNav?: boolean;
  getPageList?: any;
  logout?: ActionCreator<IUserAction>;
}
export interface IHeaderState {
  linksList: any[];
}
@(connect(
  (state: IStore) => ({
    isAuthenticated: state.get('user').get('isAuthenticated'),
  }),
  (dispatch) => ({
    getPageList: () => dispatch(getPageList()),
    logout: () => dispatch(userLogout()),
  }),
) as any)
export class Header extends React.Component<IHeaderProps, IHeaderState> {
  public readonly state = {
    linksList: [],
  };

  constructor(props) {
    super(props);
    this.userLogout = this.userLogout.bind(this);
  }
  public componentDidMount() {
    if (typeof ($) !== 'undefined') {
      $('.login-link').on('click', () => {
        $('.modal-sign').fadeTo( 'fast' , 1);
      });
      $('.modal-close').on('click', () => {
        $('.modal-sign').fadeOut( 'fast' );
      });
    }
    if (!this.props.hideNav) {
      this.props.getPageList().then((res) => {
        this.setState({
          linksList: res,
        });
      });
    }
  }
  public userLogout() {
    this.props.logout();
  }

  public render() {
    const { isAuthenticated } = this.props;
    return (
      <div data-collapse="small" data-animation="default" data-duration={0} className="nav w-nav">
        <div className="container nav-container">
          {this.props.isOnePort ? (
            <div className="onerport-logoblock">
              <Link to="/" className="nav-brand oneport w-nav-brand">
                <img src="/public/images/logo-white.svg"/>
              </Link>
              <img src="/public/images/oneport-logo.svg" className="oneport-logo"/>
            </div>
          ) : (
            <Link to="/" className="nav-brand w-nav-brand">
              <img src="/public/images/logo-white.svg"/>
            </Link>
          )}
          <nav role="navigation" className="nav-menu w-nav-menu">
            <a href="#" className="mobile_burger-close w-hidden-main w-hidden-medium w-inline-block">
              <img src="/public/images/close-white.svg"/>
            </a>
            {!this.props.hideNav ? (
              <div className="column-nav-menu w-clearfix">
                <Link to="/basket/" className="nav-link w-hidden-main w-hidden-tiny w-nav-link">Корзина</Link>
                <Link to="/page/travel/" className="nav-link w-nav-link">Туры</Link>
                <div data-delay={200}
                     className="nav-drop w-hidden-small w-hidden-tiny w-clearfix w-dropdown"
                     data-ix="select-arrow">
                  <div className="nav-drop-toggle w-clearfix w-dropdown-toggle">
                    <div className="nav-dop-text">Услуги</div>
                  </div>
                  <nav className="nav-drop-list menu-list w-dropdown-list" data-ix="form-drop-list">
                    {this.state.linksList && this.state.linksList.map((page) => (
                      <Link to={`/page/${page.url}`} key={page.url}
                             className="select-link w-dropdown-link">{page.title}</Link>))}
                  </nav>
                </div>
                <Link to="/page/about" className="nav-link w-nav-link">О нас</Link>
                <Link to="/contacts" className="nav-link w-nav-link">Контакты</Link>
                <Link to="/page/oneport" className="nav-link w-nav-link">Компаниям</Link>
                { isAuthenticated
                ? (
                  <Link to="/profile/" className="nav-link w-hidden-main w-hidden-medium w-nav-link">
                    Личный кабинет
                  </Link>)
                 : (
                    <a href="#"
                       className="nav-link w-hidden-main w-hidden-medium w-nav-link login-link">Вход для юр. лиц</a>
                  )
                }
              </div>
            ) : <div className="column-nav-menu w-clearfix"/>}
            <div className="column-nav-menu w-clearfix navbar-rightside">
              { isAuthenticated ?
                (
                  !this.props.hideNav ? (
                    <Link to="/profile"
                          className="nav-link_ex last w-hidden-small w-hidden-tiny w-inline-block w-clearfix"
                          style={{ zIndex: 911, position: 'relative' }}
                          data-ix="link-icon">
                      <img src="/public/images/user-white.svg" className="link-icon"/>
                      <div className="nav-link-text hide w-hidden-medium w-hidden-small w-hidden-tiny">
                        Личный кабинет
                      </div>
                    </Link>
                  ) : (
                    <a href="#" className="nav-link_ex last w-hidden-small w-hidden-tiny w-inline-block w-clearfix"
                       onClick={this.userLogout}
                       data-ix="link-icon">
                      <img src="/public/images/exit-white.svg"
                           style={{transition: 'opacity 200ms', opacity: 0.6}}
                           className="link-icon"/>
                      <div className="nav-link-text hide w-hidden-medium w-hidden-small w-hidden-tiny">Выйти</div>
                    </a>
                  )
                ) : (
                  <a href="#"
                     style={{zIndex: 911, position: 'relative'}}
                     className="nav-link_ex last w-hidden-small w-hidden-tiny w-inline-block w-clearfix login-link">
                    <img src="/public/images/enter-white.svg" className="link-icon"/>
                    <div className="nav-link-text hide w-hidden-medium w-hidden-small w-hidden-tiny">
                      Вход для юр. лиц
                    </div>
                  </a>
                )
              }
              {!this.props.hideNav && (
                <div data-delay={200} className="cart-drop w-hidden-small w-hidden-tiny w-dropdown">
                  <div className="cart-drop-toggle w-clearfix w-dropdown-toggle" data-ix="link-icon">
                    <img src="/public/images/cart-white.svg" className="link-icon"/>
                    <div className="cart-drop-text hide w-hidden-medium w-hidden-small w-hidden-tiny">
                      Корзина
                    </div>
                  </div>
                  <nav className="cart-drop-list w-dropdown-list" data-ix="form-drop-list">
                    <Basket placement="header" />
                  </nav>
                </div>
              )}
              <a className="nav-link_ex phone w-hidden-small w-hidden-tiny w-inline-block w-clearfix"
                 data-ix="link-icon" href="tel:+78002001222">
                <img src="/public/images/phone-white.svg" className="link-icon"/>
                <div className="nav-link-text">+7 800 200-12-22</div>
              </a>
              <div className="p footer-p w-hidden-main w-hidden-medium">Казань, Хади Такташа, 2</div>
              <div className="p footer-p w-hidden-main w-hidden-medium">
                <a href="tel:+78002001222" className="footer-phone">+7 800 200 12 22</a>
              </div>
              <div className="p footer-p margin w-hidden-main w-hidden-medium">Почта для вопросов:</div>
              <a href="mailto:corporate@avt.travel" className="link footer_link w-hidden-main w-hidden-medium">
                corporate@avt.travel
              </a>
              <div className="footer-social w-hidden-main w-hidden-medium w-clearfix">
                <a href="https://www.facebook.com/avt.travelagency/" target="_blank"
                   className="social-link w-inline-block">
                  <img src="/public/images/fb-white.svg"/>
                </a>
                <a href="https://www.instagram.com/avt_avia/" target="_blank" className="social-link w-inline-block">
                  <img src="/public/images/instagram-white.svg"/>
                </a>
                <a href="https://www.instagram.com/avt.travel/" target="_blank"
                   className="social-link w-inline-block">
                  <img src="/public/images/instagram-white.svg"/>
                </a>
              </div>
            </div>
          </nav>
          {!this.props.hideNav && (
            <div className="menu-button w-nav-button">
              <img src="/public/images/burger-white.svg"/>
            </div>
          )}
        </div>
      </div>
    );
  }
}
