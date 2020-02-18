import * as React from 'react';
import { Link } from 'react-router';
import { browserHistory } from 'react-router';
import { Header } from '../../Header';

export interface IHeroProps {
  title: string;
  description: string;
  name: string;
  backgroundImageURL: string;
  actionButtonText: string;
  actionButtonURL: string;
}
export class Hero extends React.Component<IHeroProps> {
  public componentDidMount() {
    if (typeof ($) !== 'undefined') {
      $('.open-lead-modal').on('click', () => {
        $('.modal-lead-red').fadeTo( 'fast' , 1);
      });
      $('.modal-close').on('click', () => {
        $('.modal-lead-red').fadeOut( 'fast' );
      });
      $('.modal-flex').on('click', (e) => {
        if ($(e.target).is('.modal-flex')) {
          $('.modal-lead').fadeOut( 'fast' );
        }
      });
    }
  }
  public render() {
    const { name, title, description, backgroundImageURL, actionButtonText, actionButtonURL } = this.props;
    const bgImageURL = (backgroundImageURL && backgroundImageURL.startsWith('images/'))
      ? '/public/' + backgroundImageURL : backgroundImageURL;
    return (backgroundImageURL && title) ? (
      <main className="main service-main mice-hero" style={{backgroundImage: `url("${bgImageURL}")`}}>
        <Header/>
        <div className="container landing-container">
          <div className="row w-row">
            <div className="column w-clearfix w-col w-col-8">
              <div className="h1">{title}</div>
              <div className="p-big margin-p-big">{description}</div>
              {actionButtonText && (
                <Link to={actionButtonURL}
                      className="button margin-right-button w-button open-lead-modal">{actionButtonText}</Link>
              )}
              <a href={`#${this.props.name}`} className="button border-button w-hidden-small w-hidden-tiny w-button">
                Подробнее
              </a>
            </div>
            {name === 'mice' && (
              <div className="column w-col w-col-4">
                <div className="service-main-block">
                  <div className="mice-info w-clearfix">
                    <img src="/public/images/meeting-gradient.svg" className="service-main-icon"/>
                    <div className="service-main-info">
                      <div className="p height-1-p">Meetings</div>
                      <div className="tech-text">Корпоративные встречи</div>
                    </div>
                  </div>
                  <div className="mice-info w-clearfix">
                    <img src="/public/images/tour-gradient.svg" className="service-main-icon"/>
                    <div className="result-info">
                      <div className="p height-1-p">Incentives</div>
                      <div className="tech-text">Поощрительные туры</div>
                    </div>
                  </div>
                  <div className="mice-info w-clearfix">
                    <img src="/public/images/board-gradient.svg" className="service-main-icon"/>
                    <div className="result-info">
                      <div className="p height-1-p">Conferences</div>
                      <div className="tech-text">Конференции</div>
                    </div>
                  </div>
                  <div className="mice-info w-clearfix">
                    <img src="/public/images/podium-gradient.svg" className="service-main-icon"/>
                    <div className="result-info">
                      <div className="p height-1-p">Exhibitions</div>
                      <div className="tech-text">Мероприятия</div>
                    </div>
                  </div>
                  <a className="button margins-button w-button open-lead-modal">
                    Заказать <span className="p-uc">MICE</span>
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    ) : (
      <div className="hero-short">
        <main className="header" data-ix="fixed-nav">
          <Header/>
        </main>
        <div className="section">
          <div className="container cart-container">
            <div className="ticket-bar w-clearfix">
              <a className="link-block left-link-block w-inline-block w-clearfix"
                 data-ix="link-icon" onClick={() => browserHistory.goBack()}>
                <img src="/public/images/arrow-left-red.svg" width="30" className="link-icon"/>
                <div className="w-hidden-tiny">Назад</div>
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
