import * as React from 'react';
export interface IInputProps {
  id?: number;
  type?: string;
  placeholder?: string;
  required?: boolean;
  autofocus?: boolean;
  className?: any;
  maxLength?: number;
  autoComplete?: string;
  dataId?: string;
  name: string;
  dataName?: string;
  value?: string;
  onKeyPress?: (e) => void;
  onChange?: (e) => void;
  disabled?: boolean;
  onFocus?: (e) => void;
  onBlur?: (e) => void;
}
export class Input extends React.Component<IInputProps, any> {
  public render() {
    const id = this.props.id || 1000;
    const type = this.props.type || 'text';
    const disabled = this.props.disabled || false;
    const autofocus = this.props.autofocus;
    const autoComplete = this.props.autoComplete || 'nope';
    const className = this.props.className || 'input w-input';
    const maxLength = this.props.maxLength || 256;
    const dataName = this.props.dataName || `${this.props.name}_${id}`;
    const required = this.props.required || false;
    return (
      <input type={type}
             autoComplete={autoComplete}
             autoFocus={autofocus}
             className={className}
             maxLength={maxLength}
             name={this.props.name}
             value={this.props.value}
             onKeyDown={(e) => this.props.onKeyPress ? this.props.onKeyPress(e) : null}
             onFocus={(e) => this.props.onFocus ? this.props.onFocus(e) : null}
             onChange={(e) => this.props.onChange ? this.props.onChange(e) : null}
             placeholder={this.props.placeholder}
             onBlur={(e) => this.props.onBlur ? this.props.onBlur(e) : null}
             data-name={dataName}
             disabled={disabled}
             id={dataName}
             required={required}/>
    );
  }
}
