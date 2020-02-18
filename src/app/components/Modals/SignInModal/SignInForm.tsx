import * as React from 'react';
import * as classNames from 'classnames';
import { IStore } from '../../../redux/IStore';
import { connect } from 'react-redux';
import { sendVerificationCode, userLogin } from '../../../redux/modules/users/service';

import Cleave = require('cleave.js/react');
import { App } from '../../../containers/App';
require('cleave.js/dist/addons/cleave-phone.ru');
const style = require('./styles.css');

export interface ISignInProps {
  current: boolean;
  selectOther: () => any;
  sendVerificationCode?: (phoneNumber: string) => any;
  login?: (phone: string, verificationCode: string) => any;
}
export interface ISignInState {
  step: number;
  phone: string;
  timer: any;
  time: { minutes: number, seconds: number };
  countDown: number;
  verificationCode: string;
  availableForSending: boolean;
  isPhoneValid: boolean;
}

@(connect(
  (state: IStore) => ({
    user: state.get('user'),
  }),
  (dispatch) => ({
    sendVerificationCode: (phoneNumber: string) => dispatch(sendVerificationCode(phoneNumber)),
    login: (phone: string, verificationCode: string) =>
      dispatch(userLogin(phone, verificationCode)),
  }),
) as any)
export class SignInForm extends React.Component<ISignInProps, ISignInState> {
  public readonly state: ISignInState = {
    step: 1,
    phone: '',
    timer: 0,
    time: { minutes: 0, seconds: 0 },
    countDown: 120,
    isPhoneValid: true,
    availableForSending: true,
    verificationCode: '',
  };
  private unmounted = false;

  constructor(props) {
    super(props);
    this.validatePhone = this.validatePhone.bind(this);
    this.tryToSend = this.tryToSend.bind(this);
    this.startTimer = this.startTimer.bind(this);
    this.countDown = this.countDown.bind(this);
  }

  private delayActivation() {
    this.setState({ availableForSending: false });
    setTimeout(() => {
      this.setState({ availableForSending: true });
    }, 10000);
  }
  private tryToSend() {
    if (this.state.availableForSending) {
      this.props.sendVerificationCode(this.state.phone.replace('+7', ''));
    }
    this.delayActivation();
    this.startTimer();
  }
  private validatePhone(e) {
    this.setState({phone: e.target.rawValue });
    this.setState({
      isPhoneValid: e.target.rawValue.replace('+7', '').length === 10,
    });
  }

  public nextStep = (e) => {
    e.preventDefault();
    if (this.state.step === 1 && this.state.isPhoneValid && this.state.phone.length === 12) {
      this.setState({ step: (this.state.step + 1) });
      this.tryToSend();
    } else if (this.state.step === 2 && this.state.isPhoneValid) {
      this.props.login(
        this.state.phone.replace('+7', ''),
        this.state.verificationCode);
    }
    return false;
  }

  private secondsToTime(secs: number) {
    const divisorForMinutes = secs % (60 * 60);
    const minutes = Math.floor(divisorForMinutes / 60);

    const divisorForSeconds = divisorForMinutes % 60;
    const seconds = Math.ceil(divisorForSeconds);
    const obj = {
      minutes,
      seconds,
    };
    return obj;
  }
  private startTimer() {
    this.countDown();
    this.setState({
      time: { minutes: 0, seconds: 0 },
      countDown: 120,
      timer: setInterval(this.countDown, 1000),
    });
  }

  private countDown() {
    // Remove one second, set state so a re-render happens.
    const seconds = this.state.countDown - 1;

    // Check if we're at zero.
    if (seconds === 0 || this.unmounted) {
      clearInterval(this.state.timer);
    } else {
      this.setState({
        time: this.secondsToTime(seconds),
        countDown : seconds,
      });
    }

  }

  public componentDidMount() {
    if (typeof App !== 'undefined' && App.resetWebflow) {
      App.resetWebflow();
    }
  }

  public componentWillUnmount() {
    this.unmounted = true;
  }

  public render() {
    const sendAgainClasses = classNames({
      'tech-link absolute-tech-link': true,
      [style.disabled]: !this.state.availableForSending,
    });
    const inputClass = classNames({
      'sign-input phonenumber7 w-input': true,
      [style['w-input--error']]: !this.state.isPhoneValid,
    });
    const formClass = classNames({
      'sign-form': true,
      [style.hidden]: this.state.step === 3,
    });
    const seconds = this.state.time.seconds;
    const secondsFormatted = (seconds < 10) ? '0' + seconds : seconds;
    return (
      <div style={{display: this.props.current ? 'block' : 'none'}} className="sign-in-block">
        <div className="sign-form-block w-form">
          <form id="wf-form-Sign-In" name="wf-form-Sign-In" data-name="Sign In"
                className={formClass} onSubmit={this.nextStep}>
            <h3 className="h3 margin-bottom-h3 center-h3">Вход</h3>
            <div className="sign-form-inputs">
              {/* tslint:disable:jsx-no-lambda */}
              <Cleave options={{blocks: [2, 3, 3, 2, 2], prefix: '+7', delimiter: ' ', numericOnly: true}}
                      type="text" maxLength={18}
                      name="Phone" autoComplete="tel-national"
                      className={inputClass} onChange={(e) => this.validatePhone(e)}
                      data-name="Phone" placeholder="Мобильный телефон" id="Phone-5" required={true}/>
              { this.state.step === 2 ? (
                <span>
                  <div className="sign-divider"/>
                  <input type="text" className="sign-input w-input" maxLength={10}
                         name="Code" data-name="Code" placeholder="Код из смс"
                         value={this.state.verificationCode}
                         onChange={(e) => this.setState({verificationCode: e.target.value})}
                         id="Code-3" required={true}/>
                  <a href="#" className={sendAgainClasses} onClick={this.tryToSend}>
                    {!this.state.availableForSending ?
                    (
                      this.state.time.minutes + ':' + secondsFormatted
                    ) : (
                      'Выслать повторно'
                    )}
                  </a>
                </span>
              ) : null }
            </div>
            <input type="submit" onClick={this.nextStep}
                   value={this.state.step === 1 ? ('Отправить код') : 'Войти'} data-wait="Подождите..."
                   className="sign-button w-button"/>
            {this.props.selectOther && (
              <a onClick={this.props.selectOther} style={{cursor: 'pointer'}} className="link center-link">
                или зарегистрироваться
              </a>
            )}
          </form>
          <div className="w-form-done" style={{display: (this.state.step === 3) ? 'block' : 'none'}}>
            <div>Вы успешно авторизированы!</div>
          </div>
          <div className="w-form-fail">
            <div>Oops! Something went wrong while submitting the form.</div>
          </div>
        </div>
      </div>
    );
  }
}
