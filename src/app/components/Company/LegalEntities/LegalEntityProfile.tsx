import * as React from 'react';
import * as moment from 'moment';
import 'moment/locale/ru';
import Cleave = require('cleave.js/react');
import { ILegalEntity } from '../../../models/legalEntities';
import { connect } from '../../../redux/connect';
import * as classNames from 'classnames';
import { Map } from 'immutable';
import { CellForm } from '../../Misc/Input/CellForm';
import { CellFormCleave } from '../../Misc/Input/CellFormCleave';
const style = require('./styles.css');
moment.locale('ru');

export interface ILegalEntityProfileProps {
  id: number;
  error?: boolean;
  message?: Map<string, any>;
  legalEntity: ILegalEntity;
}
export interface ILegalEntityProfileState {
  legalEntityData: ILegalEntity;
}
@(connect(
  (state) => ({
    message: state.get('company').get('message'),
    error: state.get('company').get('error'),
  }),
  () => ({}),
) as any)
export class LegalEntityProfile extends React.Component<ILegalEntityProfileProps, ILegalEntityProfileState> {
  public readonly state: ILegalEntityProfileState = {
    legalEntityData: {
      ...this.props.legalEntity.toJS(),
      contact_phone: '+7' + this.props.legalEntity.get('contact_phone'),
    },
  };

  constructor(props) {
    super(props);
  }

  private getClass(name: string) {
    return classNames({
      'input w-input': true,
      [style['w-input--error']]: this.props.error && this.props.message && this.props.message.get(name),
    });
  }

  public render() {
    return (
      <div data-delay="200"
           className="order-drop margin-bottom-order-drop w-dropdown" data-ix="edit-user">
        <div className="order-drop-toggle w-dropdown-toggle">
          <div className="w-row">
            <div className="w-col w-col-9 w-col-small-9 w-col-tiny-9">
              <div className="result-info">
                <div className="div-block-9">
                  {this.state.legalEntityData.title.length > 0 ? (
                    <div className="p height-1-p white-space-normal">{this.state.legalEntityData.title}</div>
                  ) : (
                    <div className="p height-1-p white-space-normal">Юр. лицо №{this.props.id}</div>
                  )}
                  <img src="/public/images/lock-black.svg" className="lock-icon" />
                </div>
                <div className="tech-text white-space-normal">Доп. инфо</div>
              </div>
            </div>
            <div className="w-clearfix w-col w-col-3 w-col-small-3 w-col-tiny-3">
              <div className="edit-icon-block">
                <img src="/public/images/edit-black.svg" />
              </div>
            </div>
          </div>
        </div>
        <nav className="order-drop-list w-dropdown-list" data-ix="order-droplist">
          <div className="order-details">
            <div className="form w-form">
              <form id="email-form-4" name="email-form-4" data-name="Email Form 4">
                <div className="order-drop-block no-border">
                  <div className="tech-uc black-tech-uc margin-bottom-tech-uc">Общая информация</div>
                  <div className="row flex-row w-clearfix">
                    <div className="column-50">
                      <CellForm
                        id={this.props.id}
                        label={'Название'}
                        name={'title'}
                        value={this.state.legalEntityData.title}
                        disabled={true}
                        required={true} />
                    </div>
                    <div className="column-50">
                      <CellFormCleave
                        options={{blocks: [ 11 ], numericOnly: true}}
                        id={this.props.id}
                        label={'ИНН'}
                        name={'tax_identification_number'}
                        value={this.state.legalEntityData.tax_identification_number}
                        className={this.getClass('tax_identification_number')}
                        disabled={true}
                        required={true} />
                    </div>
                  </div>
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
                        disabled={true}
                        required={true} />
                    </div>
                    <div className="column-33">
                      <CellForm
                        id={this.props.id}
                        label={'Имя'}
                        name={'director_first_name'}
                        value={this.state.legalEntityData.director_first_name}
                        disabled={true}
                        required={true} />
                    </div>
                    <div className="column-33">
                      <CellForm
                        id={this.props.id}
                        label={'Отчество'}
                        name={'director_middle_name'}
                        value={this.state.legalEntityData.director_middle_name}
                        disabled={true}
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
                                disabled={true}
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
                        disabled={true}
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
                        disabled={true}
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
                        disabled={true}
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
                        disabled={true}
                        required={true} />
                    </div>
                    <div className="column-50">
                      <CellForm
                        id={this.props.id}
                        label={'Полное название банка'}
                        name={'bank_name'}
                        value={this.state.legalEntityData.bank_name}
                        disabled={true}
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
                        disabled={true}
                        required={true} />
                    </div>
                    <div className="column-50">
                      <CellForm
                        id={this.props.id}
                        label={'Почтовый адрес'}
                        name={'postal_address'}
                        value={this.state.legalEntityData.postal_address}
                        className={this.getClass('postal_address')}
                        disabled={true}
                        required={true} />
                    </div>
                  </div>

                  <div className="row flex-row w-clearfix">
                    <div className="column-33">
                      <CellFormCleave
                        options={{blocks: [ 11 ], numericOnly: true}}
                        id={this.props.id}
                        label={'ИНН'}
                        name={'tax_identification_number'}
                        value={this.state.legalEntityData.tax_identification_number}
                        className={this.getClass('tax_identification_number')}
                        disabled={true}
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
                        disabled={true}
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
                        className={this.getClass('main_state_registration_number')}
                        disabled={true}
                        required={true} />
                    </div>
                  </div>
                </div>
                <div className="order-drop-block">
                  <div className="tech-uc black-tech-uc margin-bottom-tech-uc">Дополнительно</div>
                  <div className="cell-form">
                    <label htmlFor={'Contract-code-' + this.props.id} className="label">Код договора</label>
                    <input type="text"
                           maxLength={256}
                           className={this.getClass('contract_code')}
                           name="contract_code"
                           data-name={'Contract-code-' + this.props.id}
                           id={'Contract-code-' + this.props.id}
                           autoComplete="nope"
                           value={this.state.legalEntityData.contract_code}
                           disabled={true}
                           required={true}/>
                  </div>
                  <div className="cell-form last"><label htmlFor="Contacts" className="label">Контактные лица</label>
                    <div className="grey-input-block w-clearfix">
                      {this.state.legalEntityData.users.map((user) => (
                        <div className="passname" key={user.id}>
                          <div className="tech-text red-tech-text" key={user.id}>
                            {user.last_name} {user.first_name}
                            </div>
                        </div>
                      ))}
                    </div>
                    <div className="tech-text">
                      Для добавления или удаления контактных лиц — 
                      <a className="tech-link"> свяжитесь с нами</a>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </nav>
      </div>
    );
  }
}
