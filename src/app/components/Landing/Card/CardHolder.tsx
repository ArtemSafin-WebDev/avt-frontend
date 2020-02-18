import * as React from 'react';
import * as cx from 'classnames';
import { IBlock } from '../../../redux/modules/pages/IBlock';
import { Card } from './Card';
import { Link } from 'react-router';
import { ImagedCard } from './ImagedCard';

export interface ICardHolderProps {
  id: any;
  title: string;
  size?: string;
  description?: string;
  cards: IBlock[];
  pageName: string;
}
export class CardHolder extends React.Component<ICardHolderProps> {
  public componentDidMount() {
    if (typeof ($) !== 'undefined') {
      $('.open-lead-modal').on('click', () => {
        if ($('.main').hasClass('oneport-main')) {
          $('.modal-oneport').fadeTo( 'fast' , 1);
          $('.modal-lead-red').fadeTo( 'fast' , 0);
        } else {
          $('.modal-lead-red').fadeTo( 'fast' , 1);
        }
      });
      if ($('.main').hasClass('oneport-main')) {
        const sections = $('.content-section');
        $(sections[1]).attr('id', 'companies');
        $(sections[2]).attr('id', 'agents');
      }
      $('.card[href="/page/"]').on('click', (e) => {
        e.preventDefault();
      });
      $('.modal-close').on('click', () => {
        $('.modal-lead').fadeOut( 'fast' );
      });
      $('.modal-flex').on('click', (e) => {
        if ($(e.target).is('.modal-flex')) {
          $('.modal-lead').fadeOut( 'fast' );
        }
      });
    }
  }
  private renderCards(cards: IBlock[]) {
    const result = [];
    const cardsBlock = cards.filter((c) => c.type.indexOf('card') > -1);
    result.push((
      <div className="feed-row">
        {cardsBlock.map((card) => {
          if (card.type === 'card') {
            return (
              <Card title={card.title} size={card.size} description={card.description} key={card.id}
                    actionIconURL={card.action_icon_url}
                    actionText={card.action_text} actionURL={card.action_url} iconURL={card.image_url}/>
            );
          } else if (card.type === 'imaged_card') {
            return (
              <div className="feed-column" key={card.id}>
                <ImagedCard title={card.title} size={card.size} description={card.description}
                            actionIconURL={card.action_icon_url}
                            actionText={card.action_text} actionURL={card.action_url} imageURL={card.image_url}/>
              </div>
            );
          }
        })}
      </div>
    ));

    const bannerIndex = cards.findIndex((card) => card.type === 'banner');
    if (bannerIndex > -1) {
      const banner = cards[bannerIndex];
      result.push((
        <div key={banner.id}
          className={cx('featuredcard margin-bottom-featuredcard',
                          {'no-hover-card': !banner.action_url || banner.action_url === '#lead' })}>
          {/*tslint:disable-next-line*/}
          <Link style={{background: `linear-gradient(0deg, rgba(24, 25, 32, .5) -2%, rgba(24, 25, 32, 0) 98%, rgba(24, 25, 32, 0)), url('${banner.image_url}')`}}
                to={banner.action_url !== '#lead' ? banner.action_url : null}
                className="featuredcard-block _2 w-inline-block">
            <div className="card-infobottom">
              <div className="featuredcard-column">
                <h3 className="h3">{banner.title}</h3>
                <div className="p">{banner.description}</div>
              </div>
              {banner.action_url && banner.action_url !== '#lead' && (
                <img src={banner.action_icon_url || '/public/images/arrow-white.svg'} />
              )}
            </div>
          </Link>
        </div>
      ));
    }
    const btnIndex = cards.findIndex(
      (card) => (card.type === 'button_red_block' || card.type === 'button_blue_block'),
    );
    if (cards.length > 0 && (cards[cards.length - 1].type === 'button_red_block'
      || cards[cards.length - 1].type === 'button_blue_block')) {
      const btn = cards[btnIndex];
      const styleClasses = 'wide-button w-inline-block' +
        (cards[cards.length - 1].type === 'button_blue_block' ? ' oneport-wide-button' : '');
      result.push((
        <div className={cx('button-block', {'open-lead-modal': btn.action_url === '#lead'})} key={btn.id}>
          <Link to={btn.action_url !== '#lead' ? btn.action_url : null}
                className={styleClasses}>
            <img src={btn.image_url} className="icon-more" />
            <div>{btn.title}</div>
          </Link>
        </div>
      ));
    }
    if (cards.length > 0 && cards[cards.length - 1].type === 'image') {
      result.push((
        <div className="oneport-logos w-clearfix" key={Math.random()}>
          {cards.filter((card) => card.type === 'image').reverse().map((image) => (
            <img src={image.image_url} width="150" className="oneport-gds" key={image.id}/>
          ))}
        </div>
      ));
    }
    return result;
  }
  public render() {
    const { title, description, cards } = this.props;
    const id = this.props.id;
    return (
      <section className="section content-section" id={this.props.id.toString()}>
        <div className="container">
          {id === 1 && (<div id={this.props.pageName} className="anchor"/>)}
          <div className="row w-row">
            <div className="column w-col w-col-8">
              {title && (<div className="h1 margin-h1">{title}</div>)}
              {description && <div className="p-big margin-p-big">{description}</div>}
            </div>
            <div className="column w-col w-col-4"/>
          </div>
          {this.renderCards(cards)}
        </div>
      </section>
    );
  }
}
