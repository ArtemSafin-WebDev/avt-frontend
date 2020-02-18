import { Dispatch } from 'react-redux';
import * as Notifications from 'react-notification-system-redux';
import { sendNotification } from './Notifications';

export const getHeaders = (token?: string) => {
  const obj = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  };
  if (token) {
    /* tslint:disable:no-string-literal */
    obj['Authorization'] = 'Token ' + token;
  }
  return obj;
};
export const getCookie = (cname) => {
  if (typeof (document) !== 'undefined') {
    const name = cname + '=';
    const decodedCookie = decodeURIComponent(document.cookie);
    const ca = decodedCookie.split(';');
    /*tslint:disable-next-line*/
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) === 0) {
        return c.substring(name.length, c.length);
      }
    }
    return '';
  }
};

export const handleErrors = (errors: any, dispatch?: Dispatch<Notifications>) => {
  console.error (errors);
  if (dispatch) {
    if (typeof errors === 'object') {
      openPopup(errors, dispatch);
    } else {
      dispatch(sendNotification(JSON.stringify(errors)));
    }
  }
};
export const openPopup = (errors: object, dispatch: Dispatch<Notifications>, title?: string) => {
  Object.keys(errors).forEach((error) => {
    if (Array.isArray(errors[error])) {
      if (typeof errors[error][0] === 'string') {
        dispatch(sendNotification(
          (error.charAt(0).toUpperCase() + error.slice(1)).replace(/_/g, ' '),
          errors[error].join('\n')));
      } else {
        errors[error].forEach((e) => {
          openPopup(e, dispatch);
        });
      }
    } else if (typeof errors[error] === 'object') {
      openPopup(errors[error], dispatch, error);
    } else if (typeof error === 'string' && error.length > 0) {
      dispatch(sendNotification(
        (title || error.charAt(0).toUpperCase() + error.slice(1)).replace(/_/g, ' '),
        errors[error],
      ));
    }
  });
};

export const queryParams = (params) => {
  const esc = encodeURIComponent;
  return Object.keys(params)
    .map((k) => esc(k) + '=' + esc(params[k]))
    .join('&');
};

export const parseQueryParams = (str) => {
  if (str || typeof document !== 'undefined') {
    return (str || document.location.search).slice(1)
      .split('&')
      .map((p) => p.split('='))
      .reduce((obj, pair) => {
        const [key, value] = pair.map(decodeURIComponent);
        return ({ ...obj, [key]: value });
      }, {});
  } else {
    return '';
  }
};
