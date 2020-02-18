import * as React from 'react';
import * as cx from 'classnames';
const styles = require('./styles.css');
export interface IInlineLoaderProps {
  dotUpdating?: boolean;
  customBlockStyle?: any;
  customSpinnerStyle?: any;
  customTextStyle?: any;
  text: string;
}
export interface IInlineLoaderState {
  dots: number;
}
export class InlineLoader extends React.Component<IInlineLoaderProps, IInlineLoaderState> {
  public readonly state: IInlineLoaderState = {
    dots: 1,
  };
  private interval = null;
  public componentDidMount() {
    this.interval = setInterval(() => {
      this.setState({dots: (this.state.dots + 1) % 4});
    }, 500);
  }
  public render() {
    return (
      <div className={cx('w-clearfix', styles['inline-spinner'])} style={this.props.customBlockStyle}>
        <img src="/public/images/spinner-red.svg" className={`spinner ${styles['inline-spinner-ring']}`}
             style={this.props.customSpinnerStyle} />
        <h3 className="h3 h3-left" style={this.props.customTextStyle}>
          {this.props.text}
          {(this.props.dotUpdating) ? '.'.repeat(this.state.dots) : ''}
        </h3>
      </div>
    );
  }
  public componentWillUnmount() {
    clearInterval(this.interval);
  }
}
