import * as React from 'react';
import { Header } from '../../components/Header';
import { App } from '../App';

export class FailedOrder extends React.Component<any, any> {
  public componentDidMount() {
    App.resetWebflow();
  }

  public render() {
    return (
      <div>
        <main className="header" data-ix="fixed-nav">
          <Header/>
        </main>
        <div className="section full-section" style={{marginTop: 80}}>
          <div className="container cart-container">
            <div className="row w-row">
              <div className="column w-clearfix w-col w-col-8">
                <img src="/public/images/404-img.svg" className="message-pic"/>
                <h1 className="h1 red-h1 left-h1">Что-то пошло не так!</h1>
                <div className="p-big left-p-big">
                  В процессе оплаты произошел сбой. Нет причин для волнения.
                  Для уточнения проблем с платежом, с вами свяжется наш менеджер
                </div>
              </div>
              <div className="column w-col w-col-4"/>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
