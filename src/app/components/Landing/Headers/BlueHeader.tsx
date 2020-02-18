import * as React from 'react';
import {Header} from '../../Header';

export interface IBlueHeader {
  title: string;
  description: string;
}

export class BlueHeader extends React.Component<IBlueHeader> {

  public componentDidMount() {
    if (typeof ($) !== 'undefined') {
      $('.open-lead-modal').on('click', () => {
        $('.modal-lead.modal-oneport').fadeTo( 'fast' , 1);
      });
      $('.modal-oneport-close').on('click', () => {
        $('.modal-lead.modal-oneport').fadeOut( 'fast' );
      });
      $('.modal-flex').on('click', (e) => {
        if ($(e.target).is('.modal-flex')) {
          $('.modal-lead').fadeOut( 'fast' );
        }
      });
    }
  }
  public render() {
    const {title, description} = this.props;
    return (
      <main className="main oneport-main">
        <Header isOnePort={true} hideNav={true}/>
        <img src="/public/images/oneport-el1.svg" className="oneport-el2"/>
        <img src="/public/images/oneport-el2.svg" className="oneport-el1"/>
        <div className="container landing-container">
          <div className="row w-row">
            <div className="column w-clearfix w-col w-col-8">
              <div className="h1">{title}</div>
              <div className="p-big margin-p-big">{description}</div>
              <a href="#agents" className="button margin-right-button oneport-button w-button">Агентам</a>
              <a href="#companies" className="button border-button w-hidden-small w-hidden-tiny w-button">Компаниям</a>
            </div>
            <div className="column w-col w-col-4">
              <img src="/public/images/oneport-pic-hor.svg"/>
            </div>
          </div>
        </div>
      </main>

    );
  }
}
