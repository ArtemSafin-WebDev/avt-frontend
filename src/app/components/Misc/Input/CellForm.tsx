import * as React from 'react';
import { Input } from './Input';

export interface ICellFormProps {
  key?: number;
  id?: number;
  label: string;
  value: string;
  name: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
  className?: any;
  maxLength?: number;
  autoComplete?: string;
  dataId?: string;
  dataName?: string;
  onKeyPress?: (e) => void;
  onChange?: (e) => void;
  onBlur?: (e) => void;
  disabled?: boolean;
  style?: any;
}
export class CellForm extends React.Component<ICellFormProps, any> {
  public render() {
    const id = this.props.id || 1000;
    const dataName = this.props.dataName || `${this.props.name}_${id}`;
    const onBlur = this.props.onBlur || (() => null);
    return (
      <div className="cell-form" style={this.props.style}>
        <label htmlFor={dataName} className="label">{this.props.label}</label>
        <Input type={this.props.type}
               autoComplete={this.props.autoComplete}
               className={this.props.className}
               maxLength={this.props.maxLength}
               placeholder={this.props.placeholder}
               disabled={this.props.disabled}
               name={this.props.name}
               value={this.props.value}
               onKeyPress={(e) => this.props.onKeyPress ? this.props.onKeyPress(e) : null}
               onChange={(e) => this.props.onChange ? this.props.onChange(e) : null}
               onBlur={onBlur}
               dataName={dataName}
               id={this.props.id}
               required={this.props.required}/>
      </div>
    );
  }
}
