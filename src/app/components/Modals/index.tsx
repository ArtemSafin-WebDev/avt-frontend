import * as React from 'react';
import { AuthModal } from './SignInModal/SignInModal';
import { LeadModalBlue } from './LeadModal/LeadModalBlue';
import { LeadModal } from './LeadModal/LeadModal';
import { IProduct } from '../../models/purchasing/IProduct';

export interface IModalsProps {
  basket: IProduct[];
  isAuthenticated: boolean;
}
export class Modals extends React.Component<IModalsProps, {}> {
  public render() {
    return (
      <div>
        {!this.props.isAuthenticated && (<AuthModal />)}
        <LeadModal/>
        <LeadModal isCart={true} basket={this.props.basket}/>
        <LeadModalBlue/>
        <div className="modal-success">
          <div className="modal-flex">
            <div className="modal-window">
              <a href="#" className="modal-close w-inline-block">
                <img src="/public/images/close-black.svg"/>
              </a>
              <div className="modal-block">
                <div className="input-block-modal w-form">
                  <div className="success-message w-form-done" style={{display: 'block'}}>
                    <img src="/public/images/success.svg" className="formmessage-icon"/>
                    <h3 className="h3 center-h3">Заявка отправлена!</h3>
                    <div className="p center-p">Мы получили вашу заявку и позвоним вам в течение 15 минут</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
