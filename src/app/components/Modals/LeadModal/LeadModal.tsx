import * as React from 'react';
import { Input } from '../../Misc/Input/Input';
import Cleave = require('cleave.js/react');
import * as classNames from 'classnames';
import { connect } from 'react-redux';
import { IStore } from '../../../redux/IStore';
import { getUserData } from '../../../redux/modules/users/selectors';
import { leadRequest } from '../../../redux/modules/pages/service';
import { Loader } from '../../Misc/Loader/Loader';
import { IProduct } from '../../../models/purchasing/IProduct';
import { IUser } from '../../../models/users';
import { createOrder } from '../../../redux/modules/purchasing/service';

export interface ILeadModalProps {
  basket?: IProduct[];
  isCart?: boolean;
  leadRequest?: (data) => any;
  createOrder?: (basket: IProduct[], passengers: IUser[], token: string) => any;
}
export interface ILeadModalState {
  first_last_name: string;
  first_name?: string;
  second_name?: string;
  last_name?: string;
  comment?: string;
  isPhoneValid: boolean;
  phone_number: string;
  company_name: string;
  email: string;
  success: boolean;
  submitted: boolean;
  preloader: boolean;
  showErrors: boolean;
}
const defaultState = {
  first_last_name: '',
  isPhoneValid: true,
  phone_number: '',
  company_name: '',
  comment: '',
  email: '',
  success: false,
  showErrors: false,
  preloader: false,
  submitted: false,
};
@(connect(
  (state: IStore) => ({
    user: getUserData(state),
  }),
  (dispatch) => ({
    leadRequest: (data) => dispatch(leadRequest(data)),
    createOrder: (basket: IProduct[], passengers: IUser[], token: string) =>
      dispatch((createOrder(basket, passengers, [], token))),
  }),
) as any)
export class LeadModal extends React.Component<ILeadModalProps, ILeadModalState> {
  public readonly state: ILeadModalState = defaultState;
  constructor(props) {
    super(props);
    this.handleSubmition = this.handleSubmition.bind(this);
  }
  private validatePhone(e) {
    this.setState({phone_number: e.target.rawValue });
    this.setState({
      isPhoneValid: e.target.rawValue.replace('+7', '').length === 10,
    });
  }

  private getValidationErrors() {
    const errors = [];
    const codes = {
      first_last_name: 'Введите фамилию и имя',
      phone_number: 'Введите номер телефона',
      company_name: 'Введите название компании',
      email: 'Введите адрес электронной почты',
    };
    for (const prop in codes) {
      if (!this.state[prop].trim()) {
        errors.push(codes[prop]);
      }
    }
    return errors;
  }

  private handleSubmition(e) {
    e.preventDefault();
    if (this.getValidationErrors().length === 0) {
      this.setState({preloader: true});
      if (this.props.isCart) {
        this.props.createOrder(
          this.props.basket,
          [],
          localStorage.getItem('avt_token'));
      } else {
        this.props.leadRequest(this.state).then((res) => {
          this.setState({submitted: true, success: res, preloader: false});
          setTimeout(() => {
            $('.modal-lead').fadeOut( 'fast' );
            this.setState(defaultState);
          }, 4000);
        });
      }
    } else {
      this.setState({showErrors: true});
    }
  }
  public render() {
    const errors = this.getValidationErrors();
    const inputClass = classNames({
      'phonenumber7 modal-input input w-input': true,
      'w-input--error': !this.state.isPhoneValid,
    });
    return (
      <div className={classNames(`modal-lead`,
        {'cart-modal': this.props.isCart, 'modal-lead-red': !this.props.isCart})}>
        <div className="modal-flex">
          <div className="modal-window">
            <a href="#" className="modal-close w-inline-block">
              <img src="/public/images/close-black.svg"/>
            </a>
            <div className="modal-block">
              <div className="input-block-modal w-form">
                {!this.state.preloader ? (
                  (!this.state.submitted) ? (
                    <form id="wf-form-Modal" name="wf-form-Modal"
                          onSubmit={(e) => this.handleSubmition(e)}
                          data-name="Oneport Modal" className="form w-clearfix">
                      <h3 className="h3 margin-bottom-h3 center-h3">
                        {this.props.isCart
                          ? 'Для завершения покупки, вам необходимо указать данные для связи'
                          : 'Оставьте ваши контакты и мы свяжемся с вами в ближайшее время'}
                      </h3>
                      <div className="form-inputs">
                        <Input autoComplete="name"
                               maxLength={60}
                               name="first_last_name"
                               value={this.state.first_last_name}
                               onChange={(e) => this.setState({first_last_name: e.target.value})}
                               placeholder="Имя и фамилия"
                               className={classNames({
                                 'modal-input w-input input': true,
                                 'w-input--error': this.state.first_last_name.split(' ').length < 2,
                               })}
                               data-name="Имя"
                               required={true}/>
                        <Input autoComplete="email"
                               maxLength={60}
                               name="email"
                               type="email"
                               className="modal-input w-input input"
                               value={this.state.email}
                               onChange={(e) => this.setState({email: e.target.value})}
                               placeholder="Email"
                               data-name="Email"
                               required={true}/>
                        <Cleave options={{blocks: [2, 3, 3, 2, 2], prefix: '+7', delimiter: ' ', numericOnly: true}}
                                type="text" maxLength={18}
                                name="Phone" autoComplete="tel-national"
                                value={this.state.phone_number}
                                className={inputClass} onChange={(e) => this.validatePhone(e)}
                                data-name="Phone" placeholder="Мобильный телефон" id="Phone-5" required={true}/>
                        <input type="text" maxLength={256}
                               name="Company-Name" data-name="Company Name" autoComplete="organization"
                               value={this.state.company_name}
                               className="modal-input w-input input"
                               onChange={(e) => this.setState({company_name: e.target.value})}
                               placeholder="Название компании" id="Company-Name"/>
                        <textarea id="Message-Field"
                                  value={this.state.comment}
                                  placeholder="Комментарий к заявке (необязательно)"
                                  data-name="Message Field"
                                  onChange={(e) => this.setState({comment: e.target.value})}
                                  className="textarea mb-5 modal-input input message-field w-input"/>
                        {this.state.showErrors && errors.length > 0 && (
                          <ol className="validation-errors">
                            <p>Исправьте ошибки в контактной информации</p>
                            {errors.map((e) => <li key={e}>{e}</li>)}
                          </ol>
                        )}
                        <input type="submit" value="Отправить"
                               className="modal-button sign-button w-button"/>
                        <div className="label">Нажимая на кнопку, я подтверждаю, что ознакомлен(на) и согласен(на) с
                          <a className="span-link" target="_blank"
                             href="/public/documents/Document-Agreement.pdf"> публичной офертой</a> и
                          даю согласие на обработку персональных данных.
                        </div>
                      </div>
                    </form>
                  ) : (
                    this.state.success ? (
                      <div className="success-message-2 w-form-done" style={{display: 'block'}}>
                        <div className="h3 center-h3">
                          Спасибо!<br/>
                          {this.props.isCart
                          ? 'Мы вам перезвоним в ближайшее время'
                          : 'Спасибо! Ваша заявка отправлена.'}
                        </div>
                      </div>
                    ) : (
                      <div className="w-form-fail" style={{display: 'block'}}>
                        <div>Что-то пошло не так во время заполнения формы.</div>
                      </div>
                    )
                  )
                ) : (
                  <Loader />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
