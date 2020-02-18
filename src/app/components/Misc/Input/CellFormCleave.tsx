import * as React from 'react';
import { ICellFormProps } from './CellForm';
import Cleave = require('cleave.js/react');
export interface ICellFormCleaveProps extends ICellFormProps {
  options: any;
}
export class CellFormCleave extends React.Component<ICellFormCleaveProps, any> {
  public render() {
    const type = this.props.type || 'text';
    const autoComplete = this.props.autoComplete || 'nope';
    const className = this.props.className || 'input w-input';
    const maxLength = this.props.maxLength || 256;
    const onBlur = this.props.onBlur || (() => null);
    const dataName = this.props.dataName || `${this.props.name}_${this.props.id}`;
    const required = this.props.required || false;
    return (
      <div className="cell-form">
        <label htmlFor={this.props.dataName} className="label">{this.props.label}</label>
        <Cleave options={this.props.options}
                type={type}
                autoComplete={autoComplete}
                className={className}
                maxLength={maxLength}
                name={this.props.name}
                value={this.props.value}
                disabled={this.props.disabled}
                onChange={(e) => this.props.onChange(e)}
                placeholder={this.props.placeholder}
                onBlur={onBlur}
                data-name={dataName}
                id={dataName}
                required={required}/>
      </div>
    );
  }
}
