import * as React from 'react';
import { ICompany } from '../../models/companies';
import { IMultiSelectItem } from '../../models/search/ISearchFilters';
import { DropdownSelect } from '../Misc/Input/DropdownSelect';
import { ILegalEntity } from '../../models/legalEntities';
import { IUser } from '../../models/users';
import { PropertySelectorHotel } from '../Misc/SearchBox/PropertySelectorHotel';
import { IPassengersInfo } from '../../models/search/IPassengersInfo';
import { App } from '../../containers/App';

export interface IEmployeeSelectFormProps {
  company: ICompany;
  currentUsers: IUser[];
  onAdd: (users: IUser[]) => void;
  passengers: IPassengersInfo;
  selectLimit: number;
  onLegalEntitiySelect: (legalEntity: ILegalEntity) => any;
}
export interface IEmployeeSelectFormState {
  selectedLegalEntity: ILegalEntity;
  selectedUsersIds: number[];
  selectedUsers: IUser[];
  added: boolean;
}
const defaultState = {
  selectedLegalEntity: null,
  selectedUsersIds: [],
  selectedUsers: [],
  added: false,
};
export class EmployeeSelectForm extends React.Component<IEmployeeSelectFormProps, IEmployeeSelectFormState> {
  public readonly state: IEmployeeSelectFormState = defaultState;

  constructor(props) {
    super(props);
    this.onAdd = this.onAdd.bind(this);
    this.selectLegalEntity = this.selectLegalEntity.bind(this);
  }
  public componentDidMount() {
    App.resetWebflow();
  }
  // public componentWillReceiveProps(nextProps: IEmployeeSelectFormProps) {
  //   const users = this.state.selectedUsers.concat(nextProps.currentUsers);
  //   this.setState({selectedUsers: users});
  // }

  // private onlyUnique = (value, index, self) => {
  //   return self.indexOf(value) === index;
  // }

  public componentWillReceiveProps(props: IEmployeeSelectFormProps) {
    if (this.state.selectedLegalEntity) {
      this.setState({selectedLegalEntity: props.company.get('legal_entities').find((entity: ILegalEntity) =>
          entity.get('id') === this.state.selectedLegalEntity.get('id'))});
    }
  }
  public static getFullName(user: IUser) {
    return user.get('last_name') + ' ' + user.get('first_name') + ' ' + user.get('middle_name');
  }
  private onAdd() {
    this.props.onAdd(this.state.selectedUsers);
    this.props.onLegalEntitiySelect(this.state.selectedLegalEntity);
    this.setState({...defaultState, added: true});
  }
  private selectLegalEntity(id) {
    const entity = this.props.company.get('legal_entities')
      .find((cur) => cur.get('id') === Number(id));
    this.setState({selectedLegalEntity: entity, selectedUsers: [], selectedUsersIds: []});
  }
  // public shouldComponentUpdate(nextProps: IEmployeeSelectFormProps, nextState: IEmployeeSelectFormState) {
  //   return this.props.company !== nextProps.company
  //     || nextProps.currentUsers !== this.props.currentUsers
  //     || nextState.selectedUsers !== this.state.selectedUsers;
  // }
  public componentDidUpdate() {
    App.resetWebflow();
  }
  public render() {
    const values: IMultiSelectItem[] = this.props.company.get('legal_entities').map((entity: ILegalEntity) => {
      return {
        value: entity.get('id'),
        text: entity.get('title'),
        selected: (this.state.selectedLegalEntity)
          ? this.state.selectedLegalEntity.get('id') === entity.get('id')
          : false,
      };
    }).toJS();
    const users: IMultiSelectItem[] = [];
    if (this.state.selectedLegalEntity && typeof this.state.selectedLegalEntity !== 'undefined') {
      this.state.selectedLegalEntity.get('users').forEach((user: IUser) => {
        if (!this.props.currentUsers.find((u) => u.get('id') === user.get('id'))) {
          users.push({
            value: user.get('id'),
            text: EmployeeSelectForm.getFullName(user),
            selected: this.state.selectedUsersIds.indexOf(user.get('id')) > -1,
          });
        }
      });
    }
    return (
      <div>
        <div className="result-header w-clearfix">
          <h3 className="h3 left-h3 margin-bottom-h3">Выберите сотрудников</h3>
          <p className="p" style={{marginBottom: 0}}>
            {PropertySelectorHotel.renderString(this.props.passengers)}
          </p>
        </div>
        <div className="passinfo w-clearfix">
          <div className="form w-form">
            <form id="email-form-4" name="email-form-4" data-name="Email Form 4">
              <div className="cell-form" style={{zIndex: 1000}}>
                <label htmlFor="Name-7" className="label">Юр. лицо</label>
                <DropdownSelect selectable={false} selectLimit={1}
                                onSelect={(_name, value) => this.selectLegalEntity(value)}
                                values={values} placeholder={'Выберите юр. лицо...'} name={'legal_entity'}/>
              </div>
              {this.state.selectedLegalEntity && (
                <div className="cell-form">
                  <label htmlFor="Name-7" className="label">Имена сотрудников</label>
                  <DropdownSelect selectable={true}
                                  disabled={this.props.selectLimit <= this.state.selectedUsersIds.length ||
                                            this.props.selectLimit <= 0}
                                  selectLimit={this.props.selectLimit}
                                  onSelect={(_name, arr) => {
                                    // tslint:disable-next-line
                                    if (typeof arr == 'number') {
                                      arr = [arr];
                                    }
                                    const user = this.state.selectedLegalEntity.get('users')
                                      .filter((cur) => arr.indexOf(cur.get('id')) > -1).toArray();
                                    this.setState({
                                      selectedUsers: user,
                                      selectedUsersIds: arr,
                                    });
                                  }}
                                  values={users} placeholder={'Выберите сотрудников...'} name={'legal_entity'}/>
                  <div className="passes w-clearfix">
                    {this.state.selectedUsers.map((user) => (
                      <div className="passname w-clearfix" key={user.get('id')}>
                        <div className="tech-text red-tech-text left-tech-text">
                          {EmployeeSelectForm.getFullName(user)}
                        </div>
                        <img src="/public/images/trash-red.svg"
                             onClick={() => {
                              const users = this.state.selectedUsers
                                    .filter((cur) => cur.get('id') !== user.get('id'));
                              const usersIds = this.state.selectedUsersIds
                                    .filter((cur) => cur !== user.get('id'));
                              this.setState({selectedUsers: users, selectedUsersIds: usersIds});
                            }} className="delete-icon"/></div>
                    ))}
                  </div>
                </div>
              )}
            </form>
          </div>
          {this.state.selectedUsersIds.length > 0 && (
            <div className="order-details w-clearfix">
              <a href="#" className="link-block left-link-block margin-right-link-block w-inline-block w-clearfix"
                 onClick={() => this.onAdd()}
                 data-ix="link-icon">
                <img src="/public/images/circleCheck-red.svg" className="link-icon"/>
                <div>Заполнить данные выбранных сотрудников
                  ({this.state.selectedUsersIds.length} из {this.props.selectLimit})
                </div>
              </a>
            </div>
          )}
        </div>
      </div>
    );
  }
}
