import * as React from 'react';
import * as cx from 'classnames';
import { Link } from 'react-router';

export interface IImagedCardProps {
  title: string;
  description: string;
  imageURL: string;
  actionURL: string;
  actionText: string;
  actionIconURL?: string;
  size?: string;
  starsCount?: number;
  onClick?: () => void;
  target?: string;
}
export class ImagedCard extends React.Component<IImagedCardProps> {
  private renderStars() {
    const res = [];
    if (this.props.starsCount > 0) {
      for (let i = 0; i < this.props.starsCount; i++) {
        res.push(<img src="/public/images/star-yellow.svg" key={this.props.title + i} className="hotelstar-icon"/>);
      }
      return res;
    } else {
      return null;
    }
  }
  public static stripTags(text: string) {
    const div = document.createElement('div');
    div.innerHTML = text;
    return div.textContent || div.innerText || '';
  }
  public render() {
    const { title, description, actionText, imageURL } = this.props;
    // Todo #intercom #addToCart
    let actionURL = '';
    if (!this.props.actionURL.startsWith('#')) {
      actionURL = this.props.actionURL;
      if (!actionURL.startsWith('/') && !actionURL.startsWith('htt') && !actionURL.startsWith('/page')) {
          actionURL = '/page/' + actionURL;
      }
    }
    return (
      <div className="card-block">
        <Link to={actionURL} target={this.props.target || '_self'} className={cx('card w-inline-block', {
                  'no-hover-card': !this.props.actionURL,
                  'open-lead-modal': this.props.actionURL === '#lead',
              })}
              onClick={(e) => {
                if (this.props.onClick) {
                  this.props.onClick();
                } else if (this.props.actionURL === '#lead') {
                  $('.open-lead-modal.active').removeClass('active');
                  $(e.target).closest('.open-lead-modal').addClass('active');
                } else if (actionURL.includes('page') && this.props.actionURL) {
                  if (typeof ($) !== 'undefined') {
                    $('html,body').animate({ scrollTop: 0 }, 'slow');
                  }
                }
              }}>
          <div className="card-cover">
            <div data-w-id="61e48f1e-f0cd-c84a-be9e-09ec80e8c180" className="card-imgblock _1">
              <img src={imageURL} className="card-img" />
              {this.props.starsCount ? (
                <div className="hotelstars absolute-hotelstars">
                  {this.renderStars()}
                </div>
              ) : (<div/>)}
            </div>
            <div data-w-id="c2018408-eb2e-2fa2-4664-c1fd529443e8" className="card-imgblock _2">
              <img src={imageURL} className="card-img" />
            </div>
          </div>
          <div className="card-info">
            <div className="card-infotop">
              <h3 className="h3">{title}</h3>
              <div className="p margin-bottom-p">{ImagedCard.stripTags(description)}</div>
            </div>
            {actionText && (
              <div className="card-infobottom w-clearfix">
                <div className="link">{actionText || 'Подробнее'}</div>
                {this.props.actionIconURL !== 'empty' && (
                  (this.props.actionIconURL) ? (
                    <img src={this.props.actionIconURL}/>
                  ) : (
                    <img src="/public/images/arrow-red.svg"/>
                  )
                )}
              </div>
            )}
          </div>
        </Link>
      </div>
    );
  }
}
