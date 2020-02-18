import * as React from 'react';
import * as cx from 'classnames';
import { Link } from 'react-router';

export interface IButtonProps {
  className?: string;
  withoutDefaultClassName?: boolean; // убрать название класса по умолчанию
  children: any;
  onClick?: () => void;
  type?: string;
  value?: string;
  disabled?: boolean;
  link?: boolean;
  to?: string;
}

export default class Button extends React.PureComponent<IButtonProps> {
  public render() {
    const { link, className, withoutDefaultClassName, ...props } = this.props;
    let componentName = 'button';
    if (link) {
      componentName = Link.name;
      // props.value.to = this.props.href;
    }
    return React.createElement(componentName, {
      className: cx(!withoutDefaultClassName ? 'btn w-button' : '', className),
      ...props,
    });
  }
}
