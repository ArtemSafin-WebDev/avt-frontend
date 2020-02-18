import * as React from 'react';
import { Link } from 'react-router';
import * as cx from 'classnames';

export interface ICardProps {
  title: string;
  size: string;
  description?: string;
  iconURL?: string;
  actionURL?: string;
  actionText?: string;
  actionIconURL?: string;
  additionalClasses?: string;
  onClick?: () => void;
}
export class Card extends React.Component<ICardProps> {
  public render() {
    const { title, description, actionText, iconURL, size } = this.props;
    // Todo #intercom #addToCart
    let actionURL = '';
    if (!this.props.actionURL.startsWith('#')) {
      actionURL = this.props.actionURL;
      if (!this.props.actionURL.startsWith('htt') && !this.props.actionURL.startsWith('/page')) {
        actionURL = '/page/' + actionURL;
      }
    }
    return (
      <div className={cx('column flex-column w-col', {[size]: true})}>
        <Link to={actionURL}
              onClick={() => this.props.onClick && this.props.onClick()}
              className={cx('card margin_card w-inline-block', {
                'open-lead-modal': this.props.actionURL === '#lead',
                'no-hover-card': !this.props.actionURL,
                [this.props.additionalClasses]: true})}>
          {iconURL && <img src={iconURL} className="landing-icon" />}
          <div className="card-info">
            <div className="card-infotop">
              <h3 className="h3">{title}</h3>
              {description && <div className="p p-ui" dangerouslySetInnerHTML={{__html: description}}/>}
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
