import * as React from 'react';

export interface IDropButtonProps {
  onClick?: (e) => void;
  children: string;
}

/**
 * Фильтр по дате
 */
export default class DropButton extends React.Component<IDropButtonProps> {
  public render() {
    const { onClick, children } = this.props;
    return (
      <div data-delay="200" className="select w-dropdown" data-ix="select-arrow">
        <div className="period-drop-toggle select-toggle w-clearfix w-dropdown-toggle" onClick={onClick}>
          <div className="select-text">{children}</div>
          <img src="/public/images/down-red.svg" className="select-icon"
               style={{
                 transformStyle: 'preserve-3d',
                 transition: 'transform 200ms',
                 transform: 'rotateX(0deg) rotateY(0deg) rotateZ(0deg)',
               }}/>
        </div>
      </div>
    );
  }
}
