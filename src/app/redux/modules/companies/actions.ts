import { ICompany, ICompanyAction } from '../../../models/companies';
import { ILegalEntity } from '../../../models/legalEntities';
import { IUser } from '../../../models/users';

/**
 * Classification of company actions
 * Payload: information to proceed when action (event) triggered
 * Type: Class of action
 */
export class CompanyActions {
  public static GET_ALL_COMPANIES_REQUEST: string = 'company/GET_ALL_COMPANIES_REQUEST';
  public static GET_ALL_COMPANIES_SUCCESS: string = 'company/GET_ALL_COMPANIES_SUCCESS';
  public static GET_ALL_COMPANIES_FAILURE: string = 'company/GET_ALL_COMPANIES_FAILURE';

  public static GET_COMPANY_REQUEST: string = 'company/GET_COMPANY_REQUEST';
  public static GET_COMPANY_SUCCESS: string = 'company/GET_COMPANY_SUCCESS';
  public static GET_COMPANY_FAILURE: string = 'company/GET_COMPANY_FAILURE';

  public static CHANGE_COMPANY_STATUS_REQUEST: string = 'company/CHANGE_COMPANY_STATUS_REQUEST';
  public static CHANGE_COMPANY_STATUS_SUCCESS: string = 'company/CHANGE_COMPANY_STATUS_SUCCESS';
  public static CHANGE_COMPANY_STATUS_FAILURE: string = 'company/CHANGE_COMPANY_STATUS_FAILURE';

  public static ADD_NEW_CONTACT_REQUEST: string = 'company/ADD_NEW_CONTACT_REQUEST';
  public static ADD_NEW_CONTACT_SUCCESS: string = 'company/ADD_NEW_CONTACT_SUCCESS';
  public static ADD_NEW_CONTACT_FAILURE: string = 'company/ADD_NEW_CONTACT_FAILURE';

  public static EDIT_CONTACT_DATA_REQUEST: string = 'company/EDIT_CONTACT_DATA_REQUEST';
  public static EDIT_CONTACT_DATA_SUCCESS: string = 'company/EDIT_CONTACT_DATA_SUCCESS';
  public static EDIT_CONTACT_DATA_FAILURE: string = 'company/EDIT_CONTACT_DATA_FAILURE';

  public static DELETE_CONTACT_REQUEST: string = 'company/DELETE_CONTACT_REQUEST';
  public static DELETE_CONTACT_SUCCESS: string = 'company/DELETE_CONTACT_SUCCESS';
  public static DELETE_CONTACT_FAILURE: string = 'company/DELETE_CONTACT_FAILURE';

  public static ADD_NEW_LEGAL_ENTITY_REQUEST: string = 'company/ADD_NEW_LEGAL_ENTITY_REQUEST';
  public static ADD_NEW_LEGAL_ENTITY_SUCCESS: string = 'company/ADD_NEW_LEGAL_ENTITY_SUCCESS';
  public static ADD_NEW_LEGAL_ENTITY_FAILURE: string = 'company/ADD_NEW_LEGAL_ENTITY_FAILURE';

  public static EDIT_LEGAL_ENTITY_REQUEST: string = 'company/EDIT_LEGAL_ENTITY_REQUEST';
  public static EDIT_LEGAL_ENTITY_SUCCESS: string = 'company/EDIT_LEGAL_ENTITY_SUCCESS';
  public static EDIT_LEGAL_ENTITY_FAILURE: string = 'company/EDIT_LEGAL_ENTITY_FAILURE';

  public static PARTIAL_UPDATE_LEGAL_ENTITY_REQUEST: string = 'company/PARTIAL_UPDATE_LEGAL_ENTITY_REQUEST';
  public static PARTIAL_UPDATE_LEGAL_ENTITY_SUCCESS: string = 'company/PARTIAL_UPDATE_LEGAL_ENTITY_SUCCESS';
  public static PARTIAL_UPDATE_LEGAL_ENTITY_FAILURE: string = 'company/PARTIAL_UPDATE_LEGAL_ENTITY_FAILURE';

  public static DELETE_LEGAL_ENTITY_REQUEST: string = 'company/DELETE_LEGAL_ENTITY_REQUEST';
  public static DELETE_LEGAL_ENTITY_SUCCESS: string = 'company/DELETE_LEGAL_ENTITY_SUCCESS';
  public static DELETE_LEGAL_ENTITY_FAILURE: string = 'company/DELETE_LEGAL_ENTITY_FAILURE';

  public static getAllCompaniesRequest(): ICompanyAction {
    return {
      type: CompanyActions.GET_ALL_COMPANIES_REQUEST,
    };
  }

  public static getAllCompaniesSuccess(companies: [ICompany]): ICompanyAction {
    return {
      type: CompanyActions.GET_ALL_COMPANIES_SUCCESS,
      payload: {
        companies,
      },
    };
  }

  public static getAllCompaniesFailure(message: any): ICompanyAction {
    return {
      type: CompanyActions.GET_ALL_COMPANIES_FAILURE,
      payload: {
        message,
      },
    };
  }

  public static getCompanyRequest(companyId: number): ICompanyAction {
    return {
      type: CompanyActions.GET_COMPANY_REQUEST,
      payload: {
        company_id: companyId,
      },
    };
  }

  public static getCompanySuccess(company: ICompany): ICompanyAction {
    return {
      type: CompanyActions.GET_COMPANY_SUCCESS,
      payload: {
        company,
      },
    };
  }

  public static getCompanyFailure(message: any): ICompanyAction {
    return {
      type: CompanyActions.GET_COMPANY_FAILURE,
      payload: {
        message,
      },
    };
  }

  public static changeCompanyStatusRequest(companyId: number, param: string, value: any): ICompanyAction {
    return {
      type: CompanyActions.CHANGE_COMPANY_STATUS_REQUEST,
      payload: {
        changes: {
          companyId,
          param,
          value,
        },
      },
    };
  }

  public static changeCompanyStatusSuccess(companyId: number, param: string, value: any): ICompanyAction {
    return {
      type: CompanyActions.CHANGE_COMPANY_STATUS_SUCCESS,
      payload: {
        changes: {
          companyId,
          param,
          value,
        },
      },
    };
  }

  public static changeCompanyStatusFailure(message: any): ICompanyAction {
    return {
      type: CompanyActions.CHANGE_COMPANY_STATUS_FAILURE,
      payload: {
        message,
      },
    };
  }

  public static addNewContactRequest(contact: IUser): ICompanyAction {
    return {
      type: CompanyActions.ADD_NEW_CONTACT_REQUEST,
      payload: {
        contact,
      },
    };
  }

  public static addNewContactSuccess(contact: IUser): ICompanyAction {
    return {
      type: CompanyActions.ADD_NEW_CONTACT_SUCCESS,
      payload: {
        contact,
      },
    };
  }

  public static addNewContactFailure(message: any): ICompanyAction {
    return {
      type: CompanyActions.ADD_NEW_CONTACT_FAILURE,
      payload: {
        message,
      },
    };
  }

  public static editContactDataRequest(contactId: number, param: string, value: any): ICompanyAction {
    return {
      type: CompanyActions.EDIT_CONTACT_DATA_REQUEST,
      payload: {
        changes: {
          contactId,
          param,
          value,
        },
      },
    };
  }

  public static editContactDataSuccess(companyId: number, contactId: number,
                                       param: string, value: any): ICompanyAction {
    return {
      type: CompanyActions.EDIT_CONTACT_DATA_SUCCESS,
      payload: {
        changes: {
          companyId,
          contactId,
          param,
          value,
        },
      },
    };
  }

  public static editContactDataFailure(message: any): ICompanyAction {
    return {
      type: CompanyActions.EDIT_CONTACT_DATA_FAILURE,
      payload: {
        message,
      },
    };
  }

  public static deleteContactRequest(contactId: number): ICompanyAction {
    return {
      type: CompanyActions.DELETE_CONTACT_REQUEST,
      payload: {
        deletes: {
          contactId,
        },
      },
    };
  }

  public static deleteContactSuccess(companyId: number, contactId: number): ICompanyAction {
    return {
      type: CompanyActions.DELETE_CONTACT_SUCCESS,
      payload: {
        deletes: {
          companyId,
          contactId,
        },
      },
    };
  }

  public static deleteContactFailure(message: any): ICompanyAction {
    return {
      type: CompanyActions.DELETE_CONTACT_FAILURE,
      payload: {
        message,
      },
    };
  }

  public static addNewLegalEntityRequest(legalEntity: ILegalEntity): ICompanyAction {
    return {
      type: CompanyActions.ADD_NEW_LEGAL_ENTITY_REQUEST,
      payload: {
        legalEntity,
      },
    };
  }

  public static addNewLegalEntitySuccess(legalEntity: ILegalEntity): ICompanyAction {
    return {
      type: CompanyActions.ADD_NEW_LEGAL_ENTITY_SUCCESS,
      payload: {
        legalEntity,
      },
    };
  }

  public static addNewLegalEntityFailure(message: any): ICompanyAction {
    return {
      type: CompanyActions.ADD_NEW_LEGAL_ENTITY_FAILURE,
      payload: {
        message,
      },
    };
  }

  public static editLegalEntityDataRequest(entityId: number, param: string, value: any): ICompanyAction {
    return {
      type: CompanyActions.EDIT_LEGAL_ENTITY_REQUEST,
      payload: {
        changes: {
          entityId,
          param,
          value,
        },
      },
    };
  }

  public static editLegalEntityDataSuccess(companyId: number, entityId: number,
                                           param: string, value: any): ICompanyAction {
    return {
      type: CompanyActions.EDIT_LEGAL_ENTITY_SUCCESS,
      payload: {
        changes: {
          companyId,
          entityId,
          param,
          value,
        },
      },
    };
  }

  public static editLegalEntityDataFailure(message: any): ICompanyAction {
    return {
      type: CompanyActions.PARTIAL_UPDATE_LEGAL_ENTITY_FAILURE,
      payload: {
        message,
      },
    };
  }
  public static partialUpdateLegalEntityRequest(entityId: number, values: ILegalEntity): ICompanyAction {
    return {
      type: CompanyActions.PARTIAL_UPDATE_LEGAL_ENTITY_REQUEST,
      payload: {
        changes: {
          entityId,
          legalEntity: values,
        },
      },
    };
  }

  public static partialUpdateLegalEntitySuccess(companyId: number, entityId: number,
                                                values: ILegalEntity): ICompanyAction {
    return {
      type: CompanyActions.PARTIAL_UPDATE_LEGAL_ENTITY_SUCCESS,
      payload: {
        changes: {
          companyId,
          entityId,
          legalEntity: values,
        },
      },
    };
  }

  public static partialUpdateLegalEntityFailure(message: any): ICompanyAction {
    return {
      type: CompanyActions.EDIT_LEGAL_ENTITY_FAILURE,
      payload: {
        message,
      },
    };
  }

  public static deleteLegalEntityRequest(companyId: number, entityId: number): ICompanyAction {
    return {
      type: CompanyActions.DELETE_LEGAL_ENTITY_REQUEST,
      payload: {
        deletes: {
          companyId,
          entityId,
        },
      },
    };
  }

  public static deleteLegalEntitySuccess(companyId: number, entityId: number): ICompanyAction {
    return {
      type: CompanyActions.DELETE_LEGAL_ENTITY_SUCCESS,
      payload: {
        deletes: {
          companyId,
          entityId,
        },
      },
    };
  }

  public static deleteLegalEntityFailure(message: any): ICompanyAction {
    return {
      type: CompanyActions.DELETE_LEGAL_ENTITY_FAILURE,
      payload: {
        message,
      },
    };
  }

}
