import * as React from 'react';
import * as cx from 'classnames';

export interface IButtonDropdownProps {
  children: [any];
  className: string;
  style: object;
  noAutoClose: boolean;
}
export interface IButtonDropdownState {
  isOpen: boolean;
}
export class ButtonDropdown extends React.Component<IButtonDropdownProps, IButtonDropdownState> {
  constructor(props) {
    super(props);
    this.setState({isOpen: false});
  }
  public componentDidMount() {
    document.addEventListener('click', (e) => this.bodyClick(e), false);
  }
  public componentWillUnmount() {
    document.removeEventListener('click', (e) => this.bodyClick(e), false);
  }
  private node: any;
  private bodyClick(e: Event) {
    if (this.node != null && this.node.contains(e.target)) {
      return;
    }
    if (this.state.isOpen) {
      this.setState({isOpen: false});
    }
  }
  private close() {
    this.setState({isOpen: false});
  }
  public render() {
    const { children, className, style, noAutoClose } = this.props;
    const { isOpen } = this.state;
    return (
      <div className={cx('dropdown-mark w-dropdown', className)} style={style} ref={(ref) => this.node = ref}>
        {React.cloneElement(children[0], {...children[0].props, onClick: () => this.setState({isOpen: !isOpen})})}
        {React.cloneElement(children[1], {
          ...children[1].props,
          isOpen,
          noAutoClose,
          close: () => this.close(),
        })}
      </div>
    );
  }
}
