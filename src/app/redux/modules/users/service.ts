import * as moment from 'moment';
import { UserActions } from './actions';
import { IBonusCard, IPassport, IUserBase } from '../../../models/users';
import { getHeaders, handleErrors } from '../../../helpers/HttpHelpers';
import { getAllCompanies, getMyCompany } from '../companies/service';
import { sendNotification } from '../../../helpers/Notifications';
const config = require('../../../../../config/main');

export const userLogin = (username: string, verificationCode: string) => {
  return (dispatch) => {
    dispatch(UserActions.userLogin(username, verificationCode));
    return fetch(
      `${config.apiEndpoint}/auth/login/`, {
        method: 'post',
        headers: getHeaders(),
        body: JSON.stringify({
          username,
          password: verificationCode,
        }),
      }).then((res) => {
      if (res.ok) {
        return res.json()
          .then((res) => {
            if (res.user && res.token) {
              dispatch(UserActions.userLoginSuccess(res.token, res.user));
              localStorage.setItem('avt_token', res.token);
              localStorage.setItem('avt_user_id', res.user.id);
              dispatch(getMyCompany(res.user.company_id, res.token));
              if (res.user.is_admin) {
                dispatch(getAllCompanies(res.token));
              }
            } else {
              dispatch(UserActions.userLoginFailure(res[Object.keys(res)[0]]));
            }
            return res;
          });
      } else {
        return res.json().then((res) => {
          dispatch(UserActions.userLoginFailure(res[Object.keys(res)[0]]));
          handleErrors(res, dispatch);
          return res;
        });
      }
    }).catch((e) => console.warn(e));
  };
};

export const userRegister = (userData: any) => {
  return (dispatch) => {
    userData.phone_number = userData.phone_number.replace('+7', '');
    dispatch(UserActions.userRegister(userData));
    return fetch(
      `${config.apiEndpoint}/request/access/`, {
        method: 'post',
        headers: getHeaders(),
        body: JSON.stringify({
          user: userData,
          company: userData.companyData,
        }),
      }).then((res) => {
      if (res.ok) {
        return res.json()
          .then((res) => {
            if (res) {
              dispatch(UserActions.userRegisterSuccess());
            } else {
              dispatch(UserActions.userRegisterFailure('Could not register ' + JSON.stringify(res)));
            }
            return res;
          });
      } else {
        return res.json().then((res) => {
          dispatch(UserActions.userRegisterFailure(JSON.stringify(res)));
          handleErrors(res, dispatch);
          return res;
        }).catch((res) => dispatch(UserActions.userRegisterFailure(JSON.stringify(res))));
      }
    });
  };
};

export const sendVerificationCode = (phoneNumber: string) => {
  return (dispatch) => {
    dispatch(UserActions.sendVerificationCodeRequest());
    return fetch(
      `${config.apiEndpoint}/sign_in/request_sms`, {
        method: 'post',
        headers: getHeaders(),
        body: JSON.stringify({
          phone_number: phoneNumber,
        }),
      }).then((res) => {
      if (res.ok) {
        dispatch(UserActions.sendVerificationCodeSuccess());
        dispatch(sendNotification('Код для входа в ЛК', 'Успешно отправлен', 'info'));
      } else {
        return res.json().then((res) => {
          dispatch(UserActions.sendVerificationCodeFailure());
          dispatch(sendNotification('Код для входа в ЛК',
            'Произошла ошибка при отправки, свяжитесь с менеджером или попробуйте позднее!'));
          return res;
        }).catch(() => dispatch(UserActions.sendVerificationCodeFailure()));
      }
    });
  };
};

export const addNewDocument = (passport: IPassport, token: string) => {
  return (dispatch) => {
    dispatch(UserActions.addNewDocumentRequest(passport));
    if (passport.validity === '') {
      delete passport.validity;
    }
    if (passport.user_id < 0) {
      // dispatch(UserActions.addNewDocumentSuccess(passport));
      return Promise.resolve().then(() => passport);
    }
    return fetch(
      `${config.apiEndpoint}/documents/`, {
        method: 'post',
        headers: getHeaders(token),
        body: JSON.stringify(passport),
      }).then((res) => {
      if (res.ok) {
        return res.json()
          .then((res) => {
            if (res) {
              dispatch(UserActions.addNewDocumentSuccess(res));
            }
            return res;
          }).catch((err) => console.warn(err));
      } else {
        return res.json().then((res) => {
          dispatch(UserActions.addNewDocumentFailure(res));
          handleErrors(res, dispatch);
          return res;
        }).catch((err) => console.warn(err));
      }
    });
  };
};

export const editDocument = (passport: IPassport, token: string) => {
  return (dispatch) => {
    dispatch(UserActions.editDocumentRequest(passport));
    if (passport.get('user_id') < 0) {
      // dispatch(UserActions.editDocumentSuccess(passport));
      return Promise.resolve().then(() => passport);
    }
    const validity = passport.get('validity');
    const validityFormated = (validity && validity.indexOf('-') > -1)
      ? moment(validity, 'YYYY-MM-DD')
      : moment(validity, 'DD.MM.YYYY');
    const obj: any = {
      type: passport.get('type'),
      number: passport.get('number'),
    };
    if (validityFormated.isValid() || !validity) {
      if (validity) {
        obj.validity = validityFormated.format('YYYY-MM-DD');
      }
      return fetch(
        `${config.apiEndpoint}/documents/${passport.get('id')}/`, {
          method: 'PATCH',
          headers: getHeaders(token),
          body: JSON.stringify(obj),
        }).then((res) => {
        if (res.ok) {
          return res.json()
            .then((res) => {
              if (res) {
                dispatch(UserActions.editDocumentSuccess(res));
              }
              return res;
            }).catch((err) => console.warn(err));
        } else {
          return res.json().then((res) => {
            dispatch(UserActions.editDocumentFailure('Невозможно обновить документ'));
            handleErrors('Невозможно обновить документ', dispatch);
            return res;
          }).catch((err) => console.warn(err));
        }
      });
    } else {
      handleErrors('Неверный формат даты', dispatch);
    }

  };
};

export const removeDocument = (id: number, token: string) => {
  return (dispatch) => {
    dispatch(UserActions.removeDocumentRequest(id));

    if (!id || id < 0) {
      // dispatch(UserActions.removeDocumentSuccess(id));
      return Promise.resolve().then(() => id);
    }
    return fetch(
      `${config.apiEndpoint}/documents/${id}/`, {
        method: 'delete',
        headers: getHeaders(token),
      }).then((res) => {
      if (res.ok) {
        return res.json()
          .then((res) => {
            if (res) {
              dispatch(UserActions.removeDocumentSuccess(id));
            }
            return res;
          }).catch((err) => console.warn(err));
      } else {
        return res.json().then((res) => {
          dispatch(UserActions.removeDocumentFailure('Невозможно удалить документ'));
          handleErrors('Невозможно удалить документ', dispatch);
          return res;
        });
      }
    });
  };
};
export const addNewBonusCard = (card: IBonusCard, token: string) => {
  return (dispatch) => {
    dispatch(UserActions.addNewDocumentRequest(card));

    if (card.user_id === -1) {
      // dispatch(UserActions.addNewDocumentSuccess(card));
      return Promise.resolve().then(() => card);
    }
    return fetch(
      `${config.apiEndpoint}/bonus_cards/`, {
        method: 'post',
        headers: getHeaders(token),
        body: JSON.stringify(card),
      }).then((res) => {
      if (res.ok) {
        return res.json()
          .then((res) => {
            if (res) {
              dispatch(UserActions.addNewDocumentSuccess(res));
            }
            return res;
          }).catch((err) => console.warn(err));
      } else {
        return res.json().then((res) => {
          dispatch(UserActions.addNewDocumentFailure(res));
          handleErrors(res, dispatch);
          return res;
        }).catch((err) => console.warn(err));
      }
    });
  };
};

export const editBonusCard = (card: IBonusCard, token: string) => {
  return (dispatch) => {
    dispatch(UserActions.editDocumentRequest(card));

    if (card.user_id === -1) {
      // dispatch(UserActions.editDocumentSuccess(card));
      return Promise.resolve().then(() => card);
    }
    return fetch(
      `${config.apiEndpoint}/bonus_cards/${card.id}/`, {
        method: 'PATCH',
        headers: getHeaders(token),
        body: JSON.stringify(card),
      }).then((res) => {
      if (res.ok) {
        return res.json()
          .then((res) => {
            if (res) {
              dispatch(UserActions.editDocumentSuccess(res));
            }
            return res;
          }).catch((err) => console.warn(err));
      } else {
        return res.json().then((res) => {
          dispatch(UserActions.editDocumentFailure('Невозможно обновить бонусную карту'));
          handleErrors('Невозможно обновить бонусную карту', dispatch);
          return res;
        }).catch((err) => console.warn(err));
      }
    });
  };
};

export const removeBonusCard = (id: number, token: string) => {
  return (dispatch) => {
    dispatch(UserActions.removeDocumentRequest(id));

    if (!id) {
      // dispatch(UserActions.removeDocumentSuccess(id));
      return Promise.resolve().then(() => id);
    }
    return fetch(
      `${config.apiEndpoint}/bonus_cards/${id}/`, {
        method: 'delete',
        headers: getHeaders(token),
      }).then((res) => {
      if (res.ok) {
        return res.json()
          .then((res) => {
            if (res) {
              dispatch(UserActions.removeDocumentSuccess(id));
            }
            return res;
          }).catch((err) => console.warn(err));
      } else {
        return res.json().then((res) => {
          dispatch(UserActions.removeDocumentFailure('Невозможно удалить бонусную карту'));
          handleErrors('Невозможно удалить бонусную карту', dispatch);
          return res;
        });
      }
    });
  };
};

export const authorize = (token: string, userId: number) => {
  return (dispatch) => {
    if (token && userId) {
      dispatch(userGetData(userId, token))
        .then((res) => {
          dispatch(getMyCompany(res.company_id, token));
          fetchCSRFToken();
          if (res) {
            return dispatch(UserActions.userLoginSuccess(token, res));
          } else {
            return dispatch(UserActions.userUnauthorized());
          }
        });
    } else {
      dispatch(UserActions.userUnauthorized());
      fetchCSRFToken();
    }
  };
};

export const fetchCSRFToken = () => {
  fetch(
    `${config.apiEndpoint}/request/ping/`, {
      headers: getHeaders(),
      credentials: 'include',
    });
};

export const userGetData = (userId: number, token: string) => {
  return (dispatch) => {
    dispatch(UserActions.userDataRequest(userId, token));
    const formData  = new FormData();
    formData.append('id', userId.toString());
    return fetch(
      `${config.apiEndpoint}/users/${userId}/`, {
        method: 'GET',
        headers: getHeaders(token),
      }).then((res) => {
      if (res.ok) {
        return res.json()
          .then((res) => {
            if (res as IUserBase) {
              dispatch(UserActions.userDataRequestSuccess(res));
            } else {
              dispatch(UserActions.userDataRequestFailure('User not found'));
            }
            return res;
          });
      } else {
        return res.json().then((res) => {
          dispatch(UserActions.userDataRequestFailure(res[Object.keys(res)[0]]));
          dispatch(userLogout());
          return res;
        });
      }
    }).catch((e) => console.warn(e));
  };
};

export const userLogout = () => {
  return (dispatch) => {
    dispatch(UserActions.userLogout());
    localStorage.removeItem('avt_token');
    localStorage.removeItem('avt_user_id');
    localStorage.removeItem('basket');
    dispatch(UserActions.userLogoutSuccess());
  };
};
