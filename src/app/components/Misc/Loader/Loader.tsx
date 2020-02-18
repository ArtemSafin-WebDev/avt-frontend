import * as React from 'react';
const styles = require('./styles.css');
export interface ILoaderProps {
  hasOverLay?: boolean;
  customOverlayStyle?: any;
  customSpinnerStyle?: any;
}
export class Loader extends React.Component<ILoaderProps, any> {
  public render() {
    return (
      <div style={{minHeight: 250, position: 'relative', zIndex: 9999}}>
        <div className={styles.spinner} style={this.props.customSpinnerStyle}/>
        {this.props.hasOverLay && (
          <div className={styles.overlay} style={this.props.customOverlayStyle}/>
        )}
      </div>
    );
  }
}
