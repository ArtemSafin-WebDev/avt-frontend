import * as React from 'react';
import { IStore } from '../../redux/IStore';
import { connect } from 'react-redux';
import { IPageProps, IPageState, Page } from '../Page/Page';
import { getPage } from '../../redux/modules/pages/service';
import { IUserState } from '../../redux/modules/users/state';
import { ISearchState } from '../../redux/modules/search/state';

export interface IHomeProps extends IPageProps {
  user: IUserState;
  search: ISearchState;
}
@(connect(
  (state: IStore) => ({
    user: state.get('user'),
    search: state.get('search'),
  }),
  (dispatch) => ({
    getPageData: (name) => dispatch(getPage(name)),
  }),
) as any)
export class Home extends React.Component<IHomeProps, IPageState> {
  public readonly state = {
    data: null,
    name: null,
  };

  constructor(props) {
    super(props);
    this.props.getPageData('home').then((data) => {
      this.setState({data});
    });
  }

  public render() {
    return (
      <div>
        <Page name="home" data={this.state.data} />
      </div>
    );
  }
}
