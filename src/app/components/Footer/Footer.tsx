import * as React from 'react';
import * as cx from 'classnames';
import {Link} from 'react-router';

export class Footer extends React.Component<{ aviaOneWay?: boolean, isOnePort?: boolean }, any> {
  public componentDidMount() {
    if (typeof ($) !== 'undefined') {
      $('footer [href*="/page/"]').on('click', () => {
        $('html,body').animate({scrollTop: 0}, 'slow');
      });
    }
  }

  public render() {
    return (
      <footer className={cx({'footer': true, 'oneport-footer': this.props.isOnePort})}>
        <div className="container">
          <div className="footer-block">
            <div className="row w-row">
              <div className="column w-col w-col-3">
                <div className="p footer-p">ООО «АВИТ» © 2018</div>
                <div className="p footer-p">Все права защищены</div>
                <div className="p footer-p">Казань, Хади Такташа, 2</div>
                <div className="p footer-p">
                  <a href="tel:+78002001222" className="footer-phone">
                    +7 800 200 12 22
                  </a>
                </div>
                <div className="footer-logos w-clearfix">
                  <img src="/public/images/iata-logo.svg" width="39" className="footer-logo"/>
                  <img src="/public/images/tcp-logo.svg" width="46" className="footer-logo"/>
                </div>
              </div>
              <div className="column w-clearfix w-col w-col-3">
                <Link to="/page/about/" className="link footer_link">О компании</Link>
                <Link to="/page/services/" className="link footer_link">Услуги</Link>
                {/*<Link to="/profile/" className="link footer_link">Личный кабинет</Link>*/}
                <Link to="/page/oneport" className="link footer_link">OnePort</Link>
              </div>
              <div className="column w-clearfix w-col w-col-3">
                <a href="/public/documents/Document-Agreement.pdf" target="_blank"
                   className="link footer_link">Публичная оферта</a>
                <div className="p footer-p margin">Почта для вопросов:</div>
                <a href="mailto:corporate@avt.travel" className="link footer_link">corporate@avt.travel</a>
              </div>
              <div className="column w-clearfix w-col w-col-3">
                <div className="footer-social w-clearfix">
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
                <a href="https://stride.one/" target="_blank" className="stride-link w-inline-block w-clearfix">
                  <img src="/public/images/stride-logo.svg" className="image-2"/>
                  <div className="p stride-text-p">Сделано в Студии Stride</div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    );
  }
}
