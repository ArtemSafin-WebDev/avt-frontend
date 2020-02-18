import * as React from 'react';
import { IUserBase } from '../../models/users';
import Cleave = require('cleave.js/react');
import * as cx from 'classnames';
import { connect } from 'react-redux';
import { userRegister } from '../../redux/modules/users/service';

export interface IContactFormProps {
  onSubmit: (user: IUserBase) => any;
  signUpRequest?: (userData: IUserBase) => any;
}

export interface IContactFormState {
  userData: IUserBase;
  isLegalEntity: boolean;
  isPhoneValid: boolean;
  showErrors: boolean;
  submitted: boolean;
}

const defaultState: IContactFormState = {
  userData: {
    phone_number: '',
    first_name: '',
    last_name: '',
    middle_name: '',
    position: '',
    email: '',
    address: {
      country: 'RU',
      city: 'Kazan',
      additional: '',
      zip: '',
    },
    companyData: {
      title: '',
    },
  } as IUserBase,
  isLegalEntity: false,
  showErrors: false,
  submitted: false,
  isPhoneValid: true,
};
@(connect(
  () => ({
  }),
  (dispatch) => ({
    signUpRequest: (userData: IUserBase) => dispatch(userRegister(userData)),
  }),
) as any)
export class ContactForm extends React.Component<IContactFormProps, IContactFormState> {
  public readonly state: IContactFormState = defaultState;

  constructor(props) {
    super(props);
    this.changePhone = this.changePhone.bind(this);
  }

  private changePhone(e) {
    this.setState({ userData: { ...this.state.userData, phone_number: e.target.rawValue } });
  }
  private selectWhetherLegalEntity(isLegalEntity: boolean) {
    this.setState({ userData: { ...this.state.userData }, isLegalEntity });
  }
  private handleSubmition() {
    if (this.state.isLegalEntity) {
      this.props.signUpRequest({...this.state.userData}).then((res) => {
        if (res && res.status === 'success') {
          $('.modal-success').show().fadeTo('fast', 1);
          $('.modal-success .modal-close').on('click', () => {
            $('.modal-success').fadeTo('fast', 0).hide();
          });
        }
      });
      this.setState({submitted: true});
    } else {
      this.props.onSubmit({...this.state.userData});
    }
  }
  private getValidationErrors() {
    const errors = [];
    const codes = {
      phone_number: 'Введите номер телефона',
      last_name: 'Введите фамилию',
      middle_name: 'Введите отчество',
      first_name: 'Введите имя',
      email: 'Введите адрес электронной почты',
    };
    const addressCodes = {
      country: 'Введите страну латинскими буквами, например RU',
      city: 'Введите название города латинскими буквами Kazan',
      additional: 'Введите адрес проживания латинскими буквами, например ulitsa Baumana 1',
      zip: 'Введите почтовый индекс, например 123456',
    };
    for (const prop in codes) {
      if (!this.state.userData[prop].trim()) {
        errors.push(codes[prop]);
      }
    }
    if (this.state.isLegalEntity && !this.state.userData.companyData.title.trim()) {
      errors.push('Введите название компании');
    }
    for (const prop in addressCodes) {
      if (!this.state.userData.address[prop].trim() || /[а-я]/i.test(this.state.userData.address[prop])) {
        errors.push(addressCodes[prop]);
      }
    }
    return errors;
  }

  public render() {
    const errors = this.getValidationErrors();
    return (
      <div>
        <div className="result-header w-clearfix">
          <h3 className="h3 left-h3 margin-bottom-h3">Контактная информация</h3>
        </div>
        <div className="passinfo">
          <div className="form w-form">
            <form id="email-form-4" name="email-form-4" data-name="Email Form 4">
              <div className="cell-form">
                <label htmlFor="name-8" className="label">Оплата</label>
                <div className="tumblr w-clearfix">
                  <a href="#"
                     className={cx(
                       'tumblr-button tumblr-button-left w-button',
                       {'tumblr-button-current': this.state.isLegalEntity === true})}
                     onClick={() => this.selectWhetherLegalEntity(true)}>
                    Юридическое лицо
                  </a>
                  <a href="#"
                     className={cx(
                       'tumblr-button tumblr-button-left w-button',
                       {'tumblr-button-current': this.state.isLegalEntity === false})}
                     onClick={() => this.selectWhetherLegalEntity(false)}>
                    Физическое лицо
                  </a>
                </div>
              </div>
              <div className="row flex-row w-clearfix">
                <div className="column-33">
                  <div className="cell-form">
                    <label htmlFor="Name-8" className="label">Фамилия</label>
                    <input type="text" className="input w-input" maxLength={256} name="Surname"
                           data-name="Surname" autoComplete="family-name"
                           value={this.state.userData.last_name}
                           onChange={(e) => this.setState(
                             { userData: { ...this.state.userData, last_name: e.target.value } })
                           }
                           placeholder="Фамилия" id="Surname-3" required={true}/>
                  </div>
                </div>
                <div className="column-33">
                  <div className="cell-form">
                    <label htmlFor="Surname-2" className="label">Имя</label>
                    <input type="text" className="input w-input" maxLength={256}
                           name="Name" data-name="Name" placeholder="Имя"
                           value={this.state.userData.first_name}
                           onChange={(e) => this.setState(
                             { userData: { ...this.state.userData, first_name: e.target.value } })
                           }
                           id="Name-3" autoComplete="given-name"
                           required={true}/>
                  </div>
                </div>
                <div className="column-33">
                  <div className="cell-form">
                    <label htmlFor="Last-Name-3" className="label">Отчество</label>
                    <input type="text" className="input w-input" maxLength={256}
                           name="Last-Name" data-name="Last Name" autoComplete="additional-name"
                           value={this.state.userData.middle_name}
                           onChange={(e) => this.setState(
                             { userData: { ...this.state.userData, middle_name: e.target.value } })
                           }
                           placeholder="Отчество" id="Last-Name-3" required={true}/>
                  </div>
                </div>
              </div>
              <p className="p left-p">
                Введите адрес проживания латинскими буквами
              </p>
              <div className="row flex-row w-clearfix">
                <div className="column-33">
                  <div className="cell-form">
                    <label htmlFor="Name-8" className="label">Страна</label>
                    <input type="text" className="input w-input" maxLength={256} name="country"
                           data-name="country" autoComplete="nope"
                           value={this.state.userData.address.country}
                           onChange={(e) => this.setState(
                             { userData: {
                               ...this.state.userData,
                                 address: { ...this.state.userData.address, country: e.target.value },
                             } })
                           }
                           placeholder="RU" id="country" required={true}/>
                  </div>
                </div>
                <div className="column-33">
                  <div className="cell-form">
                    <label htmlFor="Name-8" className="label">Город</label>
                    <input type="text" className="input w-input" maxLength={256} name="city"
                           data-name="city" autoComplete="nope"
                           value={this.state.userData.address.city}
                           onChange={(e) => this.setState(
                             { userData: {
                               ...this.state.userData,
                                 address: { ...this.state.userData.address, city: e.target.value },
                             } })
                           }
                           placeholder="Kazan" id="city" required={true}/>
                  </div>
                </div>
                <div className="column-33">
                  <div className="cell-form">
                    <label htmlFor="Name-8" className="label">Почтовый индекс</label>
                    <input type="text" className="input w-input" maxLength={256} name="zip"
                           data-name="zip" autoComplete="nope"
                           value={this.state.userData.address.zip}
                           onChange={(e) => this.setState(
                             { userData: {
                               ...this.state.userData,
                                 address: { ...this.state.userData.address, zip: e.target.value },
                             } })
                           }
                           placeholder="123456" id="zip" required={true}/>
                  </div>
                </div>
              </div>
              <div className="row flex-row w-clearfix">
                <div className="column-100">
                  <div className="cell-form">
                    <label htmlFor="Name-8" className="label">Адрес проживания</label>
                    <input type="text" className="input w-input" maxLength={256} name="additional"
                           data-name="additional" autoComplete="nope"
                           value={this.state.userData.address.additional}
                           onChange={(e) => this.setState(
                             { userData: {
                                 ...this.state.userData,
                                 address: { ...this.state.userData.address, additional: e.target.value },
                               } })
                           }
                           placeholder="ulitsa Baumana 1" id="additional" required={true}/>
                  </div>

                </div>
              </div>
              {this.state.isLegalEntity && (
                <div className="row flex-row w-clearfix">
                  <div className="column-50">
                    <div className="cell-form">
                      <label htmlFor="Name-8" className="label">Название компании</label>
                      <input type="text" className="input w-input" maxLength={256}
                             name="Company-Name" data-name="Company Name" autoComplete="organization"
                             value={this.state.userData.companyData.title}
                             onChange={(e) => this.setState(
                               { userData: { ...this.state.userData, companyData: { title: e.target.value } } })
                             }
                             placeholder="Название компании" id="Company-Name"/>
                    </div>
                  </div>
                  <div className="column-50">
                    <div className="cell-form">
                      <label htmlFor="Surname-2" className="label">Должность</label>
                      <input type="text" className="input w-input" maxLength={30}
                             name="Company-Name" data-name="Position" autoComplete="job"
                             value={this.state.userData.position}
                             onChange={(e) => this.setState(
                               { userData: { ...this.state.userData, position: e.target.value } })
                             }
                             placeholder="Название компании" id="Company-Name"/>
                    </div>
                  </div>
                </div>
              )}
              <div className="row flex-row w-clearfix">
                <div className="column-50">
                  <div className="cell-form">
                    <label htmlFor="Name-8" className="label">Телефон</label>
                    <Cleave options={{ blocks: [ 2, 3, 3, 2, 2 ], prefix: '+7', delimiter: ' ', numericOnly: true }}
                            type="text" className="input phonenumber7 w-input" maxLength={256}
                            name="Phone" data-name="Phone" autoComplete="tel-national"
                            value={this.state.userData.phone_number}
                            onChange={(e) => this.changePhone(e)}
                            placeholder="Телефон" id="Phone-4" required={true}/>
                  </div>
                </div>
                <div className="column-50">
                  <div className="cell-form">
                    <label htmlFor="Name-8" className="label">E-mail</label>
                    <input type="email" className="input w-input" maxLength={256}
                           name="Email" data-name="Email" autoComplete="email"
                           value={this.state.userData.email}
                           onChange={(e) => this.setState(
                             { userData: { ...this.state.userData, email: e.target.value } })
                           }
                           placeholder="Email"
                           id="Email-3" required={true}/>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
        <div>
          {this.state.showErrors && errors.length > 0 && (
            <ol className="validation-errors">
              <p>Исправьте ошибки в контактной информации</p>
              {errors.map((e) => <li key={e}>{e}</li>)}
            </ol>
          )}
          <a className={cx('wide-button buy-button w-inline-block')}
             onClick={() => errors.length === 0 ? this.handleSubmition() : this.setState({showErrors: true})}>
            <img src="/public/images/cart-white.svg" className="icon-more"/>
            <div>
              <strong>Оформить заказ</strong><br/>
              <span>
                {this.state.isLegalEntity
                  ? (this.state.submitted)
                    ? `Ваш заказ отправлен на модерацию, дождитесь звонка для продолжения`
                    : `Ваш заказ будет отправлен на модерацию`
                  : `Перейти к заполнению заявки на покупку`}
              </span>
            </div>
          </a>
        </div>
      </div>
    );
  }
}
