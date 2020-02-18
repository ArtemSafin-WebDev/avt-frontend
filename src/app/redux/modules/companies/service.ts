import { CompanyActions } from './actions';
import { fromJS } from 'immutable';
import { getHeaders, handleErrors } from '../../../helpers/HttpHelpers';
import { ILegalEntity } from '../../../models/legalEntities';
import { IUser } from '../../../models/users';
import { ICompany } from '../../../models/companies';
const config = require('../../../../../config/main');

export const getAllCompanies = (token) => {
  return (dispatch) => {
    dispatch(CompanyActions.getAllCompaniesRequest());
    return fetch(
      `${config.apiEndpoint}/companies/`, {
        headers: getHeaders(token),
      }).then((res) => {
      if (res.ok) {
        return res.json()
          .then((res) => {
            return (res && res.length >= 0)
              ? dispatch(CompanyActions.getAllCompaniesSuccess(res))
              : dispatch(CompanyActions.getAllCompaniesFailure(res));
          });
      } else {
        return res.json().then((res) => {
          dispatch(CompanyActions.getAllCompaniesFailure(res));
          handleErrors(res, dispatch);
          return res;
        });
      }
    }).catch((e) => console.warn(e));
  };
};

export const getMyCompany = (companyId: number, token) => {
  return (dispatch) => {
    if (companyId) {
      dispatch(CompanyActions.getCompanyRequest(companyId));
      return fetch(
        `${config.apiEndpoint}/companies/${companyId}/`, {
          headers: getHeaders(token),
        }).then((res) => {
        if (res.ok) {
          return res.json()
            .then((res) =>
              (res) ? dispatch(CompanyActions.getCompanySuccess(res))
                : dispatch(CompanyActions.getCompanyFailure(res)));
        } else {
          return res.json().then((res) => {
            dispatch(CompanyActions.getCompanyFailure(res));
            handleErrors(res);
            return res;
          });
        }
      }).catch((e) => console.warn(e));
    } else {
      dispatch(CompanyActions.getCompanyFailure({user: 'User has no company'}));
    }
  };
};

export const changeCompanyData = (company: ICompany, param: string, value: any) => {
  return (dispatch) => {
    const token = localStorage.getItem('avt_token');
    dispatch(CompanyActions.changeCompanyStatusRequest(company.get('id'), param, value));
    return fetch(
      `${config.apiEndpoint}/companies/${company.get('id')}/`, {
        method: 'PATCH',
        headers: getHeaders(token),
        body: JSON.stringify({
          [param]: value,
          is_reviewed: true,
        }),
      }).then((res) => {
      if (res.ok) {
        return res.json()
          .then((res) => {
            return (res && res.id)
              ? dispatch(CompanyActions.changeCompanyStatusSuccess(company.get('id'), param, value))
              : dispatch(CompanyActions.changeCompanyStatusFailure(res));
          });
      } else {
        return res.json().then((res) => {
          dispatch(CompanyActions.changeCompanyStatusFailure(res));
          handleErrors(res);
          return res;
        });
      }
    }).catch((e) => console.warn(e));
  };
};

export const approveCompany = (company: ICompany, status: boolean) => {
  return (dispatch) => {
    const token = localStorage.getItem('avt_token');
    dispatch(CompanyActions.changeCompanyStatusRequest(company.get('id'), 'is_approved', status));
    return fetch(
      `${config.apiEndpoint}/companies/${company.get('id')}/approve/`, {
        method: 'POST',
        headers: getHeaders(token),
        body: JSON.stringify({
          is_approved: status,
        }),
      }).then((res) => {
      if (res.ok) {
        return res.json()
          .then((res) => {
            return (res && res.status === 'success')
              ? dispatch(CompanyActions.changeCompanyStatusSuccess(company.get('id'), 'is_approved', status))
              : dispatch(CompanyActions.changeCompanyStatusFailure(res));
          });
      } else {
        return res.json().then((res) => {
          dispatch(CompanyActions.changeCompanyStatusFailure(res));
          handleErrors(res);
          return res;
        });
      }
    }).catch((e) => console.warn(e));
  };
};

export const addNewContact = (contact: IUser) => {
  return (dispatch) => {
    const token = localStorage.getItem('avt_token');
    dispatch(CompanyActions.addNewContactRequest(contact));
    return fetch(
      `${config.apiEndpoint}/users/`, {
        method: 'POST',
        headers: getHeaders(token),
        body: JSON.stringify(contact),
      }).then((res) => {
      if (res.ok) {
        return res.json()
          .then((res) => {
            dispatch(CompanyActions.addNewContactSuccess(fromJS(res) as IUser));
            return fromJS(res) as IUser;
          });
      } else {
        return res.json().then((res) => {
          dispatch(CompanyActions.addNewContactFailure(res));
          handleErrors(res, dispatch);
          return res;
        });
      }
    }).catch((e) => console.warn(e));
  };
};
export const editContactData = (companyId: number, contactId: number, param: string, value: any) => {
  return (dispatch) => {
    if (contactId < 0) {
      return;
    }
    const token = localStorage.getItem('avt_token');
    dispatch(CompanyActions.editContactDataRequest(contactId, param, value));
    return fetch(
      `${config.apiEndpoint}/users/${contactId}/`, {
        method: 'PATCH',
        headers: getHeaders(token),
        body: JSON.stringify({
          [param]: value,
        }),
      }).then((res) => {
      if (res.ok) {
        return res.json()
          .then((res) => {
            return (res && res.id)
              ? dispatch(CompanyActions.editContactDataSuccess(companyId, contactId, param, value))
              : dispatch(CompanyActions.editContactDataFailure(res));
          });
      } else {
        return res.json().then((res) => {
          dispatch(CompanyActions.editContactDataFailure(res));
          handleErrors(res);
          return res;
        });
      }
    }).catch((e) => console.warn(e));
  };
};

export const deleteContact = (companyId: number, contactId: number) => {
  return (dispatch) => {
    const token = localStorage.getItem('avt_token');
    dispatch(CompanyActions.deleteContactRequest(contactId));
    return fetch(
      `${config.apiEndpoint}/users/${contactId}/`, {
        method: 'DELETE',
        headers: getHeaders(token),
      }).then((res) => {
      if (res.ok) {
        dispatch(CompanyActions.deleteContactSuccess(companyId, contactId));
      } else {
        return res.json().then((res) => {
          dispatch(CompanyActions.deleteContactFailure(res));
          handleErrors(res, dispatch);
          return res;
        });
      }
    }).catch((e) => console.warn(e));
  };
};

export const addNewLegalEntity = (legalEntity: ILegalEntity) => {
  return (dispatch) => {
    const token = localStorage.getItem('avt_token');
    dispatch(CompanyActions.addNewLegalEntityRequest(legalEntity));
    return fetch(
      `${config.apiEndpoint}/legal_entities/`, {
        method: 'POST',
        headers: getHeaders(token),
        body: JSON.stringify(legalEntity),
      }).then((res) => {
      if (res.ok) {
        return res.json()
          .then((res) => {
            dispatch(CompanyActions.addNewLegalEntitySuccess(fromJS(res) as ILegalEntity));
          });
      } else {
        return res.json().then((res) => {
          dispatch(CompanyActions.addNewLegalEntityFailure(res));
          handleErrors(res, dispatch);
          return res;
        });
      }
    }).catch((e) => console.warn(e));
  };
};

export const editLegalEnitityData = (companyId: number, entityId: number, param: string, value: string) => {
  return (dispatch) => {
    const token = localStorage.getItem('avt_token');
    dispatch(CompanyActions.editLegalEntityDataRequest(entityId, param, value));
    return fetch(
      `${config.apiEndpoint}/legal_entities/${entityId}/`, {
        method: 'PATCH',
        headers: getHeaders(token),
        body: JSON.stringify({
          [param]: value,
        }),
      }).then((res) => {
      if (res.ok) {
        dispatch(CompanyActions.editLegalEntityDataSuccess(companyId, entityId, param, value));
      } else {
        return res.json().then((res) => {
          dispatch(CompanyActions.editLegalEntityDataFailure(res));
          handleErrors(res);
          return res;
        });
      }
    }).catch((e) => console.warn(e));
  };
};

export const partialUpdateLegalEnitity = (companyId: number, entityId: number, values: ILegalEntity) => {
  return (dispatch) => {
    const token = localStorage.getItem('avt_token');
    dispatch(CompanyActions.partialUpdateLegalEntityRequest(entityId, values));
    return fetch(
      `${config.apiEndpoint}/legal_entities/${entityId}/`, {
        method: 'PATCH',
        headers: getHeaders(token),
        body: JSON.stringify(values),
      }).then((res) => {
      if (res.ok) {
        dispatch(CompanyActions.partialUpdateLegalEntitySuccess(companyId, entityId, values));
      } else {
        return res.json().then((res) => {
          dispatch(CompanyActions.partialUpdateLegalEntityFailure(res));
          handleErrors(res);
          return res;
        });
      }
    }).catch((e) => console.warn(e));
  };
};

export const deleteLegalEntity = (companyId: number, entityId: number) => {
  return (dispatch) => {
    const token = localStorage.getItem('avt_token');
    dispatch(CompanyActions.deleteLegalEntityRequest(companyId, entityId));
    return fetch(
      `${config.apiEndpoint}/legal_entities/${entityId}/`, {
        method: 'DELETE',
        headers: getHeaders(token),
      }).then((res) => {
      if (res.ok) {
        dispatch(CompanyActions.deleteLegalEntitySuccess(companyId, entityId));
      } else {
        return res.json().then((res) => {
          dispatch(CompanyActions.deleteLegalEntityFailure(res));
          handleErrors(res, dispatch);
          return res;
        });
      }
    }).catch((e) => console.warn(e));
  };
};
