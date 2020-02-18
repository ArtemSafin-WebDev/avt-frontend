import * as React from 'react';
import * as moment from 'moment';
import 'moment/locale/ru';
import Cleave = require('cleave.js/react');
import { ChangeEvent, FormEvent } from 'react';
import { ILegalEntity } from '../../../models/legalEntities';
import { connect } from '../../../redux/connect';
import { ActionCreator } from 'redux';
import { ICompanyAction } from '../../../models/companies';
import {
  deleteLegalEntity,
  editLegalEnitityData,
  partialUpdateLegalEnitity,
} from '../../../redux/modules/companies/service';
import * as classNames from 'classnames';
import { Map } from 'immutable';
import { CellForm } from '../../Misc/Input/CellForm';
import { CellFormCleave } from '../../Misc/Input/CellFormCleave';
const style = require('./styles.css');

moment.locale('ru');
const Dadata = require('dadata-suggestions');
const dadata = new Dadata('9e525921c4c3bc5228125508b652d23cb52e6fde');

export interface ILegalEntityProps {
  id: number;
  error?: boolean;
  message?: Map<string, any>;
  legalEntity: ILegalEntity;
  partialUpdate?: ActionCreator<ICompanyAction>;
  changeLegalEntityData?: ActionCreator<ICompanyAction>;
  deleteLegalEntity?: ActionCreator<ICompanyAction>;
}
export interface ILegalEntityState {
  legalEntityData: ILegalEntity;
}
@(connect(
  (state) => ({
    message: state.get('company').get('message'),
    error: state.get('company').get('error'),
  }),
  (dispatch) => ({
    partialUpdate: (companyId: number, entityId: number, values: any) =>
      dispatch(partialUpdateLegalEnitity(companyId, entityId, values)),
    changeLegalEntityData: (companyId: number, entityId: number, param: string, data: any) =>
      dispatch(editLegalEnitityData(companyId, entityId, param, data)),
    deleteLegalEntity: (companyId: number, entityId: number) =>
      dispatch(deleteLegalEntity(companyId, entityId)),
  }),
) as any)
export class LegalEntity extends React.Component<ILegalEntityProps, ILegalEntityState> {
  public readonly state: ILegalEntityState = {
    legalEntityData: {
      ...this.props.legalEntity.toJS(),
      contact_phone: '+7' + this.props.legalEntity.get('contact_phone'),
    },
  };

  constructor(props) {
    super(props);
    this._onChange = this._onChange.bind(this);
    this.validateCleave = this.validateCleave.bind(this);
    this.changeValue = this.changeValue.bind(this);
    this.changeINN = this.changeINN.bind(this);
    this.updateValue = this.updateValue.bind(this);
    this._deleteLegalEntity = this._deleteLegalEntity.bind(this);
  }

  private changeValue(e: FormEvent<HTMLInputElement>) {
    const type = e.currentTarget.name;
    const value = this.state.legalEntityData[type];
    this.updateValue(type, value);
  }
  private updateValue(type: string, value: any) {
    if (value !== this.props.legalEntity.get(type)) {
      if (type === 'contact_phone' && value.replace('+7', '')
        !== this.props.legalEntity.get('contact_phone').replace('+7', '')) {
        value = value.replace('+7', '');
      }
      this.props.changeLegalEntityData(
        this.props.legalEntity.get('company_id'),
        this.props.legalEntity.get('id'), type, value,
      );
    }
  }
  private changeINN(e: FormEvent<HTMLInputElement>) {
    const type = e.currentTarget.name;
    const value = this.state.legalEntityData[type];
    if (value.length > 9) {
      dadata.party({ query: value })
        .then((data) => {
          if (data.suggestions && data.suggestions.length > 0) {
            const company = data.suggestions[0].data;
            const fio = (company.management.name)
              ? company.management.name.split(' ')
              : ['', '', ''];
            let postal = '';
            let address = '';
            if (company.address && company.address.value) {
              address = company.address.value;

              if (company.address.data && company.address.data.postal_code) {
                postal = company.address.value;
              }
            }
            const updates: object = {
              title: this.state.legalEntityData.title || company.name.full_with_opf || company.name.full,
              legal_address: this.state.legalEntityData.legal_address ||  address,
              postal_address: this.state.legalEntityData.postal_address ||  postal,
              tax_identification_number: this.state.legalEntityData.tax_identification_number,
              statement_reason_code: this.state.legalEntityData.statement_reason_code || company.kpp,
              main_state_registration_number: this.state.legalEntityData.main_state_registration_number || company.ogrn,
              director_first_name: this.state.legalEntityData.director_first_name || fio[1],
              director_middle_name: this.state.legalEntityData.director_middle_name || fio[2],
              director_last_name: this.state.legalEntityData.director_last_name || fio[0],
            };
            this.props.partialUpdate(
              this.props.legalEntity.get('company_id'),
              this.props.legalEntity.get('id'), updates);
            this.setState({ legalEntityData: {
              ...this.props.legalEntity.toJS(),
              ...updates,
            }});
          }
        })
        .catch(console.error);
    }
  }

  private changeBIC(e: FormEvent<HTMLInputElement>) {
    const type = e.currentTarget.name;
    const value = this.state.legalEntityData[type];
    if (value.length === 9) {
      dadata.bank({ query: value })
        .then((data) => {
          if (data.suggestions && data.suggestions.length > 0) {
            const bank = data.suggestions[0].data;

            const updates: object = {
              bank_correspondent_account: this.state.legalEntityData.bank_correspondent_account
              ||  bank.correspondent_account,
              bank_identification_code: this.state.legalEntityData.bank_identification_code || bank.bic,
              bank_name: this.state.legalEntityData.bank_name || bank.name.full || bank.value,
            };
            this.props.partialUpdate(
              this.props.legalEntity.get('company_id'),
              this.props.legalEntity.get('id'), updates);
            this.setState({ legalEntityData: {
              ...this.props.legalEntity.toJS(),
              ...updates,
            }});
          }
        })
        .catch(console.error);
    }
  }

  private _deleteLegalEntity() {
    this.props.deleteLegalEntity(
      this.props.legalEntity.get('company_id'),
      this.props.legalEntity.get('id'),
    );
  }

  private _onChange(e: ChangeEvent<HTMLInputElement>) {
    const type = e.target.name;
    this.setState({ legalEntityData: { ...this.state.legalEntityData, [type]: e.target.value } });
  }

  private validateCleave(e) {
    const type = e.target.name;
    this.setState({ legalEntityData: { ...this.state.legalEntityData, [type]: e.target.rawValue } });
  }

  private getClass(name: string) {
    return classNames({
      'input w-input': true,
      [style['w-input--error']]: this.props.error && this.props.message && this.props.message.get(name),
    });
  }

  public render() {
    return (
      <div className="bonus-card" style={{position: 'relative', display: 'inline-block', width: '100%'}}>
        <div className="passinfo-header w-clearfix">
          {this.state.legalEntityData.title.length > 0 ? (
            <h3 className="h3 left-h3 margin-bottom-h3">
              {this.state.legalEntityData.title}
            </h3>
          ) : (
            <h3 className="h3 left-h3 margin-bottom-h3">Юр. лицо №{this.props.id}</h3>
          )}
          <a onClick={this._deleteLegalEntity}
             className="link delete-link" style={{cursor: 'pointer'}}>
            Удалить
          </a>
        </div>
        <div className="order-drop-block no-border">
          <div className="tech-uc black-tech-uc margin-bottom-tech-uc">Общая информация</div>
          <CellForm
            id={this.props.id}
            label={'Название'}
            name={'title'}
            value={this.state.legalEntityData.title}
            onChange={(e) => this._onChange(e)}
            onBlur={(e) => this.changeValue(e)}
            required={true} />
        </div>
        <div className="order-drop-block">
          <div className="tech-uc black-tech-uc margin-bottom-tech-uc">Гендиректор</div>
          <div className="row flex-row w-clearfix">
            <div className="column-33">
              <CellForm
                id={this.props.id}
                label={'Фамилия'}
                name={'director_last_name'}
                value={this.state.legalEntityData.director_last_name}
                onChange={(e) => this._onChange(e)}
                onBlur={(e) => this.changeValue(e)}
                required={true} />
            </div>
            <div className="column-33">
              <CellForm
                id={this.props.id}
                label={'Имя'}
                name={'director_first_name'}
                value={this.state.legalEntityData.director_first_name}
                onChange={(e) => this._onChange(e)}
                onBlur={(e) => this.changeValue(e)}
                required={true} />
            </div>
            <div className="column-33">
              <CellForm
                id={this.props.id}
                label={'Отчество'}
                name={'director_middle_name'}
                value={this.state.legalEntityData.director_middle_name}
                onChange={(e) => this._onChange(e)}
                onBlur={(e) => this.changeValue(e)}
                required={true} />
            </div>
          </div>
        </div>
        <div className="order-drop-block">
          <div className="tech-uc black-tech-uc margin-bottom-tech-uc">Контакты компании</div>
          <div className="row flex-row w-clearfix">
            <div className="column-50">
              <div className="cell-form">
                <label htmlFor={'Contact-Phone-' + this.props.id} className="label">Телефон</label>
                <Cleave options={{
                  blocks: [ 2, 3, 3, 2, 2 ], prefix: '+7',
                  delimiter: ' ', numericOnly: true,
                }}
                        type="text"
                        className={this.getClass('contact_phone')}
                        maxLength={256}
                        name="contact_phone"
                        autoComplete="nope"
                        data-name={'Contact-Phone-' + this.props.id}
                        id={'Contact-Phone-' + this.props.id}
                        value={this.state.legalEntityData.contact_phone}
                        onChange={(e) => this.validateCleave(e)}
                        onBlur={(e) => this.changeValue(e)}
                        required={true}/>
              </div>
            </div>
            <div className="column-50">
              <CellForm
                id={this.props.id}
                label={'Email'}
                type="email"
                name={'contact_email'}
                value={this.state.legalEntityData.contact_email}
                onChange={(e) => this._onChange(e)}
                onBlur={(e) => this.changeValue(e)}
                required={true} />
            </div>
          </div>
        </div>
        <div className="order-drop-block">
          <div className="tech-uc black-tech-uc margin-bottom-tech-uc">Банковские реквизиты</div>
          <div className="row flex-row w-clearfix">
            <div className="column-50">
              <CellFormCleave
                options={{blocks: [ 20 ], numericOnly: true}}
                id={this.props.id}
                label={'Расчётный счёт'}
                name={'bank_account'}
                className={this.getClass('bank_account')}
                value={this.state.legalEntityData.bank_account}
                onChange={(e) => this.validateCleave(e)}
                onBlur={(e) => this.changeValue(e)}
                required={true} />
            </div>
            <div className="column-50">
              <CellFormCleave
                options={{blocks: [ 20 ], numericOnly: true}}
                id={this.props.id}
                label={'Корреспондентский счёт банка'}
                name={'bank_correspondent_account'}
                value={this.state.legalEntityData.bank_correspondent_account}
                className={this.getClass('bank_correspondent_account')}
                onChange={(e) => this.validateCleave(e)}
                onBlur={(e) => this.changeValue(e)}
                required={true} />
            </div>
          </div>
          <div className="row flex-row w-clearfix">
            <div className="column-50">
              <CellFormCleave
                options={{blocks: [ 2, 2, 2, 3 ], numericOnly: true}}
                id={this.props.id}
                label={'БИК'}
                name={'bank_identification_code'}
                value={this.state.legalEntityData.bank_identification_code}
                className={this.getClass('bank_identification_code')}
                onChange={(e) => this.validateCleave(e)}
                onBlur={(e) => this.changeBIC(e)}
                required={true} />
            </div>
            <div className="column-50">
              <CellForm
                id={this.props.id}
                label={'Полное название банка'}
                name={'bank_name'}
                value={this.state.legalEntityData.bank_name}
                onChange={(e) => this._onChange(e)}
                onBlur={(e) => this.changeValue(e)}
                required={true} />
            </div>
          </div>
          <div className="row flex-row w-clearfix">
            <div className="column-50">
              <CellForm
                id={this.props.id}
                label={'Юридический адрес'}
                name={'legal_address'}
                value={this.state.legalEntityData.legal_address}
                className={this.getClass('legal_address')}
                onChange={(e) => this._onChange(e)}
                onBlur={(e) => this.changeValue(e)}
                required={true} />
            </div>
            <div className="column-50">
              <CellForm
                id={this.props.id}
                label={'Почтовый адрес'}
                name={'postal_address'}
                value={this.state.legalEntityData.postal_address}
                className={this.getClass('postal_address')}
                onChange={(e) => this._onChange(e)}
                onBlur={(e) => this.changeValue(e)}
                required={true} />
            </div>
          </div>
          <div className="row flex-row w-clearfix">
            <div className="column-33">
              <CellFormCleave
                options={{blocks: [ 12 ], numericOnly: true}}
                id={this.props.id}
                label={'ИНН (автодополнение)'}
                name={'tax_identification_number'}
                value={this.state.legalEntityData.tax_identification_number}
                className={this.getClass('tax_identification_number')}
                onChange={(e) => this.validateCleave(e)}
                onBlur={(e) => this.changeINN(e)}
                required={true} />
            </div>
            <div className="column-33">
              <CellFormCleave
                options={{blocks: [ 9 ], numericOnly: true}}
                id={this.props.id}
                label={'КПП'}
                name={'statement_reason_code'}
                value={this.state.legalEntityData.statement_reason_code}
                className={this.getClass('statement_reason_code')}
                onChange={(e) => this.validateCleave(e)}
                onBlur={(e) => this.changeValue(e)}
                required={true} />
            </div>
            <div className="column-33">
              <CellFormCleave
                options={{blocks: [ 13 ], numericOnly: true}}
                maxLength={13}
                id={this.props.id}
                label={'ОГРН'}
                name={'main_state_registration_number'}
                value={this.state.legalEntityData.main_state_registration_number}
                className={this.getClass('main_state_registratio' +
                  'n_number')}
                onChange={(e) => this.validateCleave(e)}
                onBlur={(e) => this.changeValue(e)}
                required={true} />
            </div>
          </div>
        </div>
        <div className="order-drop-block">
          <div className="tech-uc black-tech-uc margin-bottom-tech-uc">Дополнительно</div>
          <div className="cell-form last">
            <label htmlFor={'Contract-code-' + this.props.id} className="label">Код договора</label>
            <input type="text"
                   maxLength={256}
                   className={this.getClass('contract_code')}
                   name="contract_code"
                   data-name={'Contract-code-' + this.props.id}
                   id={'Contract-code-' + this.props.id}
                   autoComplete="nope"
                   value={this.state.legalEntityData.contract_code}
                   onChange={(e) => this._onChange(e)}
                   onBlur={(e) => this.changeValue(e)}
                   required={true}/>
          </div>
          <div className="cell-form last"/>
        </div>
      </div>
    );
  }
}
