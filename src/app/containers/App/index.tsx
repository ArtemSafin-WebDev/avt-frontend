import { Modals } from '../../components/Modals/index';
const appConfig = require('../../../../config/main');
import 'react-dates/initialize';
import * as React from 'react';
import { Helmet } from 'react-helmet';
import { connect } from 'react-redux';
import { IUserState } from '../../redux/modules/users/state';
import { IStore } from '../../redux/IStore';
import { authorize } from 'redux/modules/users/service';
import { ActionCreator } from 'redux';
import * as Notifications from 'react-notification-system-redux';
import { IUserAction } from '../../models/users';
import { PurchasingActions } from '../../redux/modules/purchasing/actions';
import { IProduct } from '../../models/purchasing/IProduct';
import { getBasket } from '../../redux/modules/purchasing/selectors';
import { Analytics } from '../../components/Analytics/Analytics';

export interface IAppProps {
  user: IUserState;
  authorize: ActionCreator<IUserAction>;
  notifications: any;
  location: any;
  initBasket?: any;
  basket: IProduct[];
}
@(connect(
  (state: IStore) => {
    return {
      user: state.get('user'),
      basket: getBasket(state),
      notifications: state.get('notifications'),
    };
  },
  (dispatch) => ({
    authorize: (token: string, userId: number) => dispatch(authorize(token, userId)),
    initBasket: (products: IProduct[]) => dispatch(PurchasingActions.initBasket(products)),
  }),
) as any)
export class App extends React.Component<IAppProps> {
  public componentDidMount() {
    const token = localStorage.getItem('avt_token');
    const userId = Number(localStorage.getItem('avt_user_id'));
    this.props.authorize(token, userId);

    if (typeof ($) !== 'undefined') {
      $('a').on('click', () => {
        setTimeout(() => {
          $('nav').removeClass('w--open');
        }, 300);
      });
    }
    this.props.initBasket(JSON.parse(localStorage.getItem('basket')) || []);
  }
  public componentWillUpdate() {
    App.resetWebflow();
  }

  public static resetWebflow() {
    if (typeof Webflow !== 'undefined') {
      setTimeout(() => {
        window.Webflow.ready();
        window.Webflow.require('ix').destroy();
        window.Webflow.require('ix').ready();
      }, 500);
    }
  }

  public componentWillReceiveProps(nextProps) {
    const routeChanged = nextProps.location !== this.props.location;
    this.setState({ showBackButton: routeChanged });
  }

  public render() {

    const style = {
      Wrapper: {
        zIndex: 11000,
        position: 'relative',
      },
      NotificationItem: {
        DefaultStyle: { // Applied to every notification, regardless of the notification level
          margin: '10px 5px 2px 1px',
          zIndex: 11000,
        },
      },
    };
    return (
      <div className="_body">
        <Helmet {...appConfig.app} {...appConfig.app.head}/>
        {this.props.children}
        <Notifications notifications={this.props.notifications} style={style} />
        <Modals basket={this.props.basket}
                isAuthenticated={this.props.user.get('isAuthenticated')} />
        <Analytics/>
      </div>
    );
  }
}
