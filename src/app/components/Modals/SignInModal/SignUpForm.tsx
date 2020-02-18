import * as React from 'react';
import { IUserBase } from '../../../models/users';
import { connect } from 'react-redux';
import { IStore } from '../../../redux/IStore';
import { userRegister } from '../../../redux/modules/users/service';
import Cleave = require('cleave.js/react');

export interface ISignUpProps {
  current: boolean;
  selectOther: () => any;
  signUpRequest?: (userData: IUserBase) => any;
}
export interface ISignUpState {
  userData: IUserBase;
  step: number;
  isPhoneValid: boolean;
}
const defaultSettings: ISignUpState = {
  userData: {
    phone_number: '',
    first_name: '',
    last_name: '',
    middle_name: '',
    email: '',
    companyData: {
      title: '',
    },
  } as IUserBase,
  step: 1,
  isPhoneValid: true,
};
@(connect(
  (state: IStore) => ({
    user: state.get('user'),
  }),
  (dispatch) => ({
    signUpRequest: (userData: IUserBase) => dispatch(userRegister(userData)),
  }),
) as any)
export class SignUpForm extends React.Component<ISignUpProps, ISignUpState> {
  public readonly state: ISignUpState = defaultSettings;
  constructor(props) {
    super(props);
    this.nextStep = this.nextStep.bind(this);
    this.changePhone = this.changePhone.bind(this);
  }
  private changePhone(e) {
    this.setState({ userData: { ...this.state.userData, phone_number: e.target.rawValue } });
  }

  public nextStep = (e) => {
    e.preventDefault();
    if (this.state.step === 1 && this.state.isPhoneValid) {
      this.props.signUpRequest({...this.state.userData})
        .then((res) => {
          if (res && res.status === 'success') {
            setTimeout(() => {
              this.setState(defaultSettings);
              $('.modal-sign').fadeOut('fast');
            }, 5000);
            this.setState({ step: (this.state.step + 1) });
          }
        });
    }
    return false;
  }
  public render() {
    return (
      <div style={{display: this.props.current ? 'block' : 'none'}} className="sign-up-block">
        <div className="sign-form-block w-form">
          { this.state.step === 1 ? (
            <form id="wf-form-Sign-Up" name="wf-form-Sign-Up" onSubmit={this.nextStep}
                  data-name="Sign Up" className="sign-form">
              <h3 className="h3 margin-bottom-h3 center-h3">Заявка на регистрацию</h3>
              <div className="sign-form-inputs">
                <input type="text" className="sign-input w-input" maxLength={256} name="Surname"
                       data-name="Surname" autoComplete="family-name"
                       value={this.state.userData.last_name}
                       onChange={(e) => this.setState(
                         { userData: { ...this.state.userData, last_name: e.target.value } })
                       }
                       placeholder="Фамилия" id="Surname-3" required={true}/>
                <div className="sign-divider"/>
                <input type="text" className="sign-input w-input" maxLength={256}
                       name="Name" data-name="Name" placeholder="Имя"
                       value={this.state.userData.first_name}
                       onChange={(e) => this.setState(
                         { userData: { ...this.state.userData, first_name: e.target.value } })
                       }
                       id="Name-3" autoComplete="given-name"
                       required={true}/>
                <div className="sign-divider"/>
                <input type="text" className="sign-input w-input" maxLength={256}
                       name="Last-Name" data-name="Last Name" autoComplete="additional-name"
                       value={this.state.userData.middle_name}
                       onChange={(e) => this.setState(
                         { userData: { ...this.state.userData, middle_name: e.target.value } })
                       }
                       placeholder="Отчество" id="Last-Name-3" required={true}/>
                <div className="sign-divider"/>
                <input type="text" className="sign-input w-input" maxLength={256}
                       name="Company-Name" data-name="Company Name" autoComplete="organization"
                       value={this.state.userData.companyData.title}
                       onChange={(e) => this.setState(
                         { userData: { ...this.state.userData, companyData: { title: e.target.value } } })
                       }
                       required={true}
                       placeholder="Название компании" id="Company-Name"/>
                <div className="sign-divider"/>
                <input type="email" className="sign-input w-input" maxLength={256}
                       name="Email" data-name="Email" autoComplete="email"
                       value={this.state.userData.email}
                       onChange={(e) => this.setState(
                         { userData: { ...this.state.userData, email: e.target.value } })
                       }
                       placeholder="Email"
                       id="Email-3" required={true}/>
                <div className="sign-divider"/>
                <Cleave options={{blocks: [2, 3, 3, 2, 2], prefix: '+7', delimiter: ' ', numericOnly: true}}
                        type="text" className="sign-input phonenumber7 w-input" maxLength={256}
                        name="Phone" data-name="Phone" autoComplete="tel-national"
                        value={this.state.userData.phone_number}
                        onChange={(e) => this.changePhone(e)}
                        placeholder="Телефон" id="Phone-4" required={true}/>
              </div>
              <input type="submit" value="Отправить" data-wait="Подождите..." className="sign-button w-button"/>
              {this.props.selectOther && (
                <a onClick={this.props.selectOther}
                   style={{cursor: 'pointer'}}
                   className="link center-link">или войти</a>
              )}
            </form>
          ) : (
            <div className="success-message w-form-done" style={{display: 'block'}}>
              <img src="/public/images/success.svg" className="formmessage-icon"/>
              <h3 className="h3 center-h3">Заявка отправлена!</h3>
              <div className="p center-p">Мы получили вашу заявку и позвоним вам в течение 15 минут</div>
            </div>
          )}
          <div className="w-form-fail">
            <div>Oops! Something went wrong while submitting the form.</div>
          </div>
        </div>
      </div>
    );
  }
}
