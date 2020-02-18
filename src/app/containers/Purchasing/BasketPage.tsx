import * as React from 'react';
import { browserHistory } from 'react-router';
import { Header } from '../../components/Header';
import { Basket } from '../../components/Purchasing/Basket';
import { App } from '../App';
export class BasketPage extends React.Component<any, any> {
  public componentDidMount() {
    App.resetWebflow();
  }

  public render() {
    return (
      <div>
        <main className="header" data-ix="fixed-nav">
          <Header />
        </main>
        <div className="section profile-section">
          <div className="container cart-container">
            <div className="ticket-bar w-clearfix">
              <a onClick={() => browserHistory.goBack()}
                 className="link-block left-link-block w-inline-block w-clearfix">
                <img src="/public/images/arrow-left-red.svg" width="30" className="link-icon"/>
                <div className="w-hidden-tiny">Назад</div>
              </a>
            </div>
            <div className="row ticket-row w-row">
              <div className="column w-col w-col-8 w-col-stack">
                <div className="result-header w-clearfix">
                  <h3 className="h3 left-h3 margin-bottom-h3">Корзина</h3>
                </div>
                <Basket placement="bottom"/>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
