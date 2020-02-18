import * as React from 'react';
import { Header } from '../../components/Header';
import { App } from '../App';

export class SuccessfulOrder extends React.Component<any, any> {
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
                <img src="/public/images/success-img.svg" className="message-pic"/>
                <h1 className="h1 red-h1 left-h1">Удачно оплачено!</h1>
                <div className="p-big left-p-big">
                  Ваш заказ оплачен. Для уточнения деталей и оплаты дополнительных услуг, с вами свяжется наш менеджер.
                  Данные о бронировании вы получите на электронную почту.
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
