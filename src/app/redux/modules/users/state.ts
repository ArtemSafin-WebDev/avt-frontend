import { Map } from 'immutable';
import { IUser } from '../../../models/users';

export interface IUserState extends Map<string, any> {
  userData: IUser;
  isAuthenticated: boolean;
  token: string;

  // Request data
  isFetching?: boolean;
  error?: boolean;
  message?: any;
}

export const UserStateRecord = Map<string, any>({
  userData: null,
  isAuthenticated: false,
  token: null,
  isFetching: true,
  error: false,
  message: {},
});
