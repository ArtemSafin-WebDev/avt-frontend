import { IUser, IUserAction, IUserBase } from '../../../models/users';

/**
 * Classification of user actions
 * Payload: information to proceed when action (event) triggered
 * Type: Class of action
 */
export class UserActions {
  public static GET_USER_DATA_REQUEST: string = 'user/GET_USER_DATA';
  public static GET_USER_DATA_SUCCESS: string = 'user/GET_USER_DATA_SUCCESS';
  public static GET_USER_DATA_FAILURE: string = 'user/GET_USER_DATA_FAILURE';

  public static ADD_NEW_DOCUMENT_REQUEST: string = 'user/ADD_NEW_DOCUMENT_REQUEST';
  public static ADD_NEW_DOCUMENT_SUCCESS: string = 'user/ADD_NEW_DOCUMENT_SUCCESS';
  public static ADD_NEW_DOCUMENT_FAILURE: string = 'user/ADD_NEW_DOCUMENT_FAILURE';

  public static EDIT_DOCUMENT_REQUEST: string = 'user/EDIT_DOCUMENT_REQUEST';
  public static EDIT_DOCUMENT_SUCCESS: string = 'user/EDIT_DOCUMENT_SUCCESS';
  public static EDIT_DOCUMENT_FAILURE: string = 'user/EDIT_DOCUMENT_FAILURE';

  public static REMOVE_DOCUMENT_REQUEST: string = 'user/REMOVE_DOCUMENT_REQUEST';
  public static REMOVE_DOCUMENT_SUCCESS: string = 'user/REMOVE_DOCUMENT_SUCCESS';
  public static REMOVE_DOCUMENT_FAILURE: string = 'user/REMOVE_DOCUMENT_FAILURE';

  public static LOGIN_VERIFICATION_CODE_REQUEST: string = 'user/LOGIN_VERIFICATION_CODE_REQUEST';
  public static LOGIN_VERIFICATION_CODE_SUCCESS: string = 'user/LOGIN_VERIFICATION_CODE_SUCCESS';
  public static LOGIN_VERIFICATION_CODE_FAILURE: string = 'user/LOGIN_VERIFICATION_CODE_FAILURE';

  public static LOGIN_REQUEST: string = 'user/LOGIN_REQUEST';
  public static LOGIN_SUCCESS: string = 'user/LOGIN_SUCCESS';
  public static LOGIN_FAILURE: string = 'user/LOGIN_FAILURE';

  public static AUTHORIZE_REQUEST: string = 'user/AUTHORIZE_REQUEST';
  public static AUTHORIZE_SUCCESS: string = 'user/AUTHORIZE_SUCCESS';
  public static AUTHORIZE_FAILURE: string = 'user/AUTHORIZE_FAILURE';

  public static REGISTER_REQUEST: string = 'user/REGISTER_REQUEST';
  public static REGISTER_SUCCESS: string = 'user/REGISTER_SUCCESS';
  public static REGISTER_FAILURE: string = 'user/REGISTER_FAILURE';

  public static LOGOUT_REQUEST: string = 'user/LOGOUT_REQUEST';
  public static LOGOUT_SUCCESS: string = 'user/LOGOUT_SUCCESS';
  public static LOGOUT_FAILURE: string = 'user/LOGOUT_FAILURE';

  public static userDataRequest(userId: number, token: string): IUserAction {
    return {
      type: UserActions.GET_USER_DATA_REQUEST,
      payload: {
        id: userId,
        token,
      },
    };
  }

  public static userDataRequestSuccess(userData: IUser): IUserAction {
    return {
      type: UserActions.GET_USER_DATA_SUCCESS,
      payload: {
        user: userData,
      },
    };
  }

  public static userDataRequestFailure(message: any): IUserAction {
    return {
      type: UserActions.GET_USER_DATA_FAILURE,
      payload: {
        message,
      },
    };
  }

  public static sendVerificationCodeRequest(): IUserAction {
    return {
      type: UserActions.LOGIN_VERIFICATION_CODE_REQUEST,
    };
  }

  public static sendVerificationCodeSuccess(): IUserAction {
    return {
      type: UserActions.LOGIN_VERIFICATION_CODE_SUCCESS,
    };
  }

  public static sendVerificationCodeFailure(): IUserAction {
    return {
      type: UserActions.LOGIN_VERIFICATION_CODE_FAILURE,
    };
  }
  public static addNewDocumentRequest(passport: any): IUserAction {
    return {
      type: UserActions.ADD_NEW_DOCUMENT_REQUEST,
      payload: {
        passport,
      },
    };
  }

  public static addNewDocumentSuccess(passport: any): IUserAction {
    return {
      type: UserActions.ADD_NEW_DOCUMENT_SUCCESS,
      payload: {
        passport,
      },
    };
  }

  public static addNewDocumentFailure(message: any): IUserAction {
    return {
      type: UserActions.ADD_NEW_DOCUMENT_FAILURE,
      payload: {
        message,
      },
    };
  }

  public static editDocumentRequest(passport: any): IUserAction {
    return {
      type: UserActions.EDIT_DOCUMENT_REQUEST,
      payload: {
        passport,
      },
    };
  }

  public static editDocumentSuccess(passport: any): IUserAction {
    return {
      type: UserActions.EDIT_DOCUMENT_SUCCESS,
      payload: {
        passport,
      },
    };
  }

  public static editDocumentFailure(message: any): IUserAction {
    return {
      type: UserActions.EDIT_DOCUMENT_FAILURE,
      payload: {
        message,
      },
    };
  }

  public static removeDocumentRequest(id: number): IUserAction {
    return {
      type: UserActions.REMOVE_DOCUMENT_REQUEST,
      payload: {
        id,
      },
    };
  }

  public static removeDocumentSuccess(id: number): IUserAction {
    return {
      type: UserActions.REMOVE_DOCUMENT_SUCCESS,
      payload: {
        id,
      },
    };
  }

  public static removeDocumentFailure(message: any): IUserAction {
    return {
      type: UserActions.REMOVE_DOCUMENT_FAILURE,
      payload: {
        message,
      },
    };
  }

  public static userLogin(userName: string, verificationCode: string): IUserAction {
    return {
      type: UserActions.LOGIN_REQUEST,
      payload: {
        credentials: {
          username: userName,
          verificationCode,
        },
      },
    };
  }

  public static userLoginSuccess(token: string, userData: IUser): IUserAction {
    return {
      type: UserActions.LOGIN_SUCCESS,
      payload: {
        token,
        user: userData,
      },
    };
  }

  public static userLoginFailure(message: any): IUserAction {
    return {
      type: UserActions.LOGIN_FAILURE,
      payload: {
        message,
      },
    };
  }

  public static userRegister(user: IUserBase): IUserAction {
    return {
      type: UserActions.REGISTER_REQUEST,
      payload: {
        user,
      },
    };
  }

  public static userRegisterSuccess(): IUserAction {
    return {
      type: UserActions.REGISTER_SUCCESS,
    };
  }

  public static userRegisterFailure(message: any): IUserAction {
    return {
      type: UserActions.REGISTER_FAILURE,
      payload: {
        message,
      },
    };
  }

  public static userUnauthorized(): IUserAction {
    return {
      type: UserActions.AUTHORIZE_FAILURE,
    };
  }

  public static userLogout(): IUserAction {
    return {
      type: UserActions.LOGOUT_REQUEST,
    };
  }

  public static userLogoutSuccess(): IUserAction {
    return {
      type: UserActions.LOGOUT_SUCCESS,
    };
  }

  public static userLogoutFailure(message: any): IUserAction {
    return {
      type: UserActions.LOGOUT_FAILURE,
      payload: {
        message,
      },
    };
  }
}
