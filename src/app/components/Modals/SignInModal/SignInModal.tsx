import * as React from 'react';
import { SignUpForm } from './SignUpForm';
import { SignInForm } from './SignInForm';

interface IAuthModalState {
  currentForm: string;
}

export class AuthModal extends React.Component<any, IAuthModalState> {
  public state: IAuthModalState = {
    currentForm: 'login',
  };

  public componentDidMount() {
    if (typeof ($) !== 'undefined') {
      $('.modal-flex').on('click', (e) => {
        if ($(e.target).is('.modal-flex')) {
          $('.modal-sign').fadeOut('fast');
        }
      });
    }
  }

  public render() {
    return (
      <div className="modal-sign">
        <div className="modal-flex">
          <div className="modal-window">
            <a href="#" data-w-id="60b3032d-b02f-6c35-ac6a-2d95111d964b" className="modal-close w-inline-block">
              <img src="/public/images/close-black.svg"/>
            </a>
            <SignInForm current={this.state.currentForm === 'login'}
                        selectOther={() => this.setState({currentForm: 'register'})} />
            <SignUpForm current={this.state.currentForm === 'register'}
                        selectOther={() => this.setState({currentForm: 'login'})} />
          </div>
        </div>
      </div>
    );
  }
}
