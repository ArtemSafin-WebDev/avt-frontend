import * as React from 'react';
import { Link } from 'react-router';
import { Header } from '../../Header';
export class NotFound extends React.Component<any, any> {
  public render() {
    return (
      <div className="main-flex">
        <main className="header" data-ix="fixed-nav">
          <Header />
        </main>
        <div className="section full-section">
          <div className="container cart-container">
            <div className="row w-row">
              <div className="column w-clearfix w-col w-col-8">
                <img src="/public/images/404-img.svg" className="message-pic"/>
                <h1 className="h1 red-h1 left-h1">Такой страницы нет</h1>
                <div className="p-big left-p-big">
                  Пожалуйста, проверьте адрес или перейдите на
                  <Link to="/" className="span-link-2"> главную страницу</Link>.
                  {/* TODO Intercom */}
                  Если не помогло — <a className="span-link-2">напишите нам</a></div>
              </div>
              <div className="column w-col w-col-4"/>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
