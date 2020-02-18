import { UserActions } from './actions';
import { IUserState, UserStateRecord } from './state';
import { IUserAction } from '../../../models/users';
import { fromJS } from 'immutable';

export const initialState: IUserState = UserStateRecord as IUserState;

export function userReducer(state: IUserState = initialState, action: IUserAction): IUserState {
  state = fromJS(state) as IUserState;
  const type = (action.payload && action.payload.passport)
              ? (action.payload.passport.type) ? 'documents' : 'bonus_cards' : '';
  switch (action.type) {
    /**
     * User request actions
     */
    case UserActions.AUTHORIZE_REQUEST:
    case UserActions.LOGIN_REQUEST:
    case UserActions.LOGOUT_REQUEST:
    case UserActions.REGISTER_REQUEST:
    case UserActions.GET_USER_DATA_REQUEST:
      return state.merge({
        isFetching: true,
      }) as IUserState;

    /**
     * User authentication actions
     */
    case UserActions.GET_USER_DATA_SUCCESS:
    case UserActions.AUTHORIZE_SUCCESS:
      return state.merge({
        isFetching: false,
      }) as IUserState;

    case UserActions.LOGIN_SUCCESS:
      return state.merge({
        isFetching: false,
        isAuthenticated: true,
        userData: action.payload.user,
        token: action.payload.token,
      }) as IUserState;

    case UserActions.LOGOUT_SUCCESS:
      return initialState.merge({
        isFetching: false,
      }) as IUserState;

    case UserActions.ADD_NEW_DOCUMENT_SUCCESS:
      return (!state.get('userData'))
        ? state
        : state.merge({
          userData: state.get('userData').update(type,
            (documents) => documents.push(fromJS(action.payload.passport))),
        }) as IUserState;

    case UserActions.EDIT_DOCUMENT_SUCCESS:
      return (!state.get('userData'))
        ? state
        : state.merge({
          userData: state.get('userData').update(type,
            (document) => (document.get('id') === action.payload.passport.id)
              ? fromJS(action.payload.passport)
              : document),
        }) as IUserState;

    case UserActions.REMOVE_DOCUMENT_SUCCESS:
      return (!state.get('userData'))
        ? state
        : state.merge({
          userData: state.get('userData').update(type,
            (document) => (document.get('id') !== action.payload.passport.id)),
        }) as IUserState;

    /**
     * User request failure
     */
    case UserActions.AUTHORIZE_FAILURE:
      return state.merge({
        isFetching: false,
        isAuthenticated: false,
      }) as IUserState;

    case UserActions.GET_USER_DATA_FAILURE:
    case UserActions.LOGIN_FAILURE:
    case UserActions.REGISTER_FAILURE:
    case UserActions.LOGOUT_FAILURE:
      return state.merge({
        isAuthenticated: false,
        token: null,
        userData: null,
        isFetching: false,
        message: action.payload.message,
        error: true,
      }) as IUserState;

    case UserActions.ADD_NEW_DOCUMENT_FAILURE:
    case UserActions.REMOVE_DOCUMENT_FAILURE:
      return state.merge({
        isFetching: false,
        message: action.payload.message,
        error: true,
      }) as IUserState;

    default:
      return state;
  }
}
