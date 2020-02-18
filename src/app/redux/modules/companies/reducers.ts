import { ICompany, ICompanyAction } from '../../../models/companies';
import { ICompanyState, CompanyStateRecord } from './state';
import { CompanyActions } from './actions';
import { fromJS, List, Map } from 'immutable';
import { IUser } from '../../../models/users';
import { ILegalEntity } from '../../../models/legalEntities';

export const initialState: ICompanyState = CompanyStateRecord as ICompanyState;
export function companyReducer(state: ICompanyState = initialState, action: ICompanyAction): ICompanyState {
  state = fromJS(state) as ICompanyState;
  const payload = action.payload ? action.payload : null;
  const changes = (payload && payload.changes) ? payload.changes : null;
  let updatedCompanies: Map<number, ICompany>;
  let companyId: string;
  let company: ICompany;
  let error: boolean;
  let message: Map<string, any>;
  switch (action.type) {
    /**
     * User request actions
     */
    case CompanyActions.GET_COMPANY_REQUEST:
    case CompanyActions.GET_ALL_COMPANIES_REQUEST:
    case CompanyActions.CHANGE_COMPANY_STATUS_REQUEST:
    case CompanyActions.ADD_NEW_CONTACT_REQUEST:
    case CompanyActions.EDIT_CONTACT_DATA_REQUEST:
    case CompanyActions.DELETE_CONTACT_REQUEST:
    case CompanyActions.ADD_NEW_LEGAL_ENTITY_REQUEST:
    case CompanyActions.EDIT_LEGAL_ENTITY_REQUEST:
    case CompanyActions.DELETE_LEGAL_ENTITY_REQUEST:
      return state.merge({
        isFetching: true,
      }) as ICompanyState;

    case CompanyActions.GET_ALL_COMPANIES_SUCCESS:
      const newCompanies: ICompany[] = payload.companies;
      if (newCompanies && newCompanies.length > 0) {
        return state.merge({
          isFetching: false,
          companyIds: newCompanies.map((c) => c.id),
          companyEntities: newCompanies.reduce((companies: { [id: number]: ICompany }, company: ICompany) => {
            return Object.assign(companies, {
              [company.id]: company,
            });
          }, {}),
        }) as ICompanyState;
      } else {
        return state;
      }

    case CompanyActions.GET_COMPANY_SUCCESS:
      return state.merge({
        isFetching: false,
        userCompany: payload.company,
      }) as ICompanyState;

    case CompanyActions.CHANGE_COMPANY_STATUS_SUCCESS:
      updatedCompanies = state.get('companyEntities')
        .update(changes.companyId.toString(),
          (entry) => entry.set(changes.param, changes.value).set('is_reviewed', true));
      return state.merge({
        isFetching: false,
        companyEntities: updatedCompanies,
      }) as ICompanyState;

    case CompanyActions.ADD_NEW_CONTACT_SUCCESS:
      companyId = payload.contact.get('company_id').toString();
      if (state.get('companyEntities').count() > 0) {
        company = state.get('companyEntities').get(companyId);
        updatedCompanies = state.get('companyEntities').set(
            companyId,
            company.update('legal_entities',
              (entities: List<ILegalEntity>) => entities.map((entity) =>
                (entity.get('id') === payload.contact.get('legal_entities').get('0'))
                  ? entity.update('users', (users: List<IUser>) => users.push(payload.contact))
                  : entity)));
        return state.merge({
          isFetching: false,
          companyEntities: updatedCompanies,
        }) as ICompanyState;
      } else {
        company = state.get('userCompany');
        return state.merge({
          isFetching: false,
          userCompany: company.update('legal_entities',
            (entities: List<ILegalEntity>) => entities.map((entity) =>
              (entity.get('id') === payload.contact.get('legal_entities').get('0'))
                ? entity.update('users', (users: List<IUser>) => users.push(payload.contact))
                : entity)),
        }) as ICompanyState;
      }

    case CompanyActions.EDIT_CONTACT_DATA_SUCCESS:
      companyId = changes.companyId.toString();
      if (state.get('companyEntities').size > 0) {
        company = state.get('companyEntities').get(companyId);
        updatedCompanies = state.get('companyEntities').set(
          companyId,
          company.update('legal_entities',
            (entities: List<ILegalEntity>) => entities.map((entity) =>
              entity.update('users', (users: List<IUser>) => users.map((user) =>
                (user.get('id') === changes.contactId) ? user.set(changes.param, changes.value) : user)))),
            );
        return state.merge({
          isFetching: false,
          companyEntities: updatedCompanies,
        }) as ICompanyState;
      } else {
        company = state.get('userCompany').update('legal_entities',
          (entities: List<ILegalEntity>) => entities.map((entity) =>
            entity.update('users', (users: List<IUser>) => users.map((user) =>
              (user.get('id') === changes.contactId) ? user.set(changes.param, changes.value) : user))));
        return state.merge({
          isFetching: false,
          userCompany: company,
        }) as ICompanyState;
      }

    case CompanyActions.DELETE_CONTACT_SUCCESS:
      companyId = payload.deletes.companyId.toString();
      if (state.get('companyEntities')) {
        company = state.get('companyEntities').get(companyId);
        updatedCompanies = state.get('companyEntities').set(
          companyId,
          company.update('legal_entities',
            (entities: List<ILegalEntity>) => entities.map((entity) =>
              entity.update('users', (users) => users.filter((c) => c.get('id') !== payload.deletes.contactId)))),
        );
        return state.merge({
          isFetching: false,
          companyEntities: updatedCompanies,
        }) as ICompanyState;
      } else {
        company = state.get('userCompany')
          .update('users', (users) => users.filter((c) => c.get('id') !== payload.deletes.contactId));
        return state.merge({
          isFetching: false,
          userCompany: company,
        }) as ICompanyState;
      }

    case CompanyActions.ADD_NEW_LEGAL_ENTITY_SUCCESS:
      companyId = payload.legalEntity.get('company_id').toString();
      company = state.get('companyEntities').get(companyId);
      const newEntities = company.get('legal_entities').unshift(payload.legalEntity);
      return state.merge({
        isFetching: false,
        companyEntities: state.get('companyEntities').set(companyId, company.set('legal_entities', newEntities)),
      }) as ICompanyState;

    case CompanyActions.EDIT_LEGAL_ENTITY_SUCCESS:
      message = state.get('message');
      if (!message || typeof message === 'string') {
        message = Map({});
      }
      message = message.remove(changes.param);
      error = !message.isEmpty();

      companyId = changes.companyId.toString();
      company = state.get('companyEntities').get(companyId);
      updatedCompanies = state.get('companyEntities').set(
        companyId,
        company.update('legal_entities',
          (entities: List<ILegalEntity>) => entities.map((entity) =>
            (entity.get('id') === changes.entityId) ? entity.set(changes.param, changes.value) : entity)));
      return state.merge({
        isFetching: false,
        message,
        error,
        companyEntities: updatedCompanies,
      }) as ICompanyState;

    case CompanyActions.PARTIAL_UPDATE_LEGAL_ENTITY_SUCCESS:
      message = state.get('message');
      if (!message || typeof message === 'string') {
        message = Map({});
      }
      message = message.remove(changes.param);
      error = !message.isEmpty();

      companyId = changes.companyId.toString();
      company = state.get('companyEntities').get(companyId);
      updatedCompanies = state.get('companyEntities').set(
        companyId,
        company.update('legal_entities',
          (entities: List<ILegalEntity>) => entities.map((entity) =>
            (entity.get('id') === changes.entityId)
              ? entity.merge(changes.legalEntity)
              : entity)));
      return state.merge({
        isFetching: false,
        message,
        error,
        companyEntities: updatedCompanies,
      }) as ICompanyState;

    case CompanyActions.DELETE_LEGAL_ENTITY_SUCCESS:
      companyId = payload.deletes.companyId.toString();
      company = state.get('companyEntities').get(companyId);
      const deletedEntities = company.get('legal_entities')
        .filter((entitiy) => entitiy.get('id') !== payload.deletes.entityId);
      return state.set('companyEntities',
        state.get('companyEntities').set(companyId, company.set('legal_entities', deletedEntities))) as ICompanyState;

    case CompanyActions.GET_COMPANY_FAILURE:
    case CompanyActions.GET_ALL_COMPANIES_FAILURE:
    case CompanyActions.CHANGE_COMPANY_STATUS_FAILURE:
    case CompanyActions.ADD_NEW_CONTACT_FAILURE:
    case CompanyActions.EDIT_CONTACT_DATA_FAILURE:
    case CompanyActions.DELETE_CONTACT_FAILURE:
    case CompanyActions.ADD_NEW_LEGAL_ENTITY_FAILURE:
    case CompanyActions.EDIT_LEGAL_ENTITY_FAILURE:
    case CompanyActions.PARTIAL_UPDATE_LEGAL_ENTITY_FAILURE:
    case CompanyActions.DELETE_LEGAL_ENTITY_FAILURE:
      message = state.get('message');
      if (!message || typeof message === 'string') {
        message = Map({});
      }

      if (typeof action.payload.message === 'object') {
        const key = Object.keys(action.payload.message)[0];
        message = message.set(key, action.payload.message[key]);
      }
      return state.merge({
        isFetching: false,
        message,
        error: true,
      }) as ICompanyState;

    default:
      return state;
  }
}
