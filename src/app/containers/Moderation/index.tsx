import * as React from 'react';
import { Header } from '../../components/Header/index';
import { connect } from 'react-redux';
import { getAllCompanies } from '../../redux/modules/companies/service';
import { CompanyList } from '../../components/Company/CompanyList';
import { getFilteredCompanies } from '../../redux/modules/companies/selectors';
import { CompaniesFilter } from '../../models/companies';
import { IStore } from '../../redux/IStore';
import { Loader } from '../../components/Misc/Loader/Loader';
import { SignInForm } from '../../components/Modals/SignInModal/SignInForm';
const style = require('./style.css');

@(connect(
  (state: IStore) => ({
    user: state.get('user'),
    waiting: getFilteredCompanies(CompaniesFilter.Waiting)(state),
    authorized: getFilteredCompanies(CompaniesFilter.Authorized)(state),
    declined: getFilteredCompanies(CompaniesFilter.Declined)(state),
  }),
  (dispatch) => ({
    loadCompanies: (token) => dispatch(getAllCompanies(token)),
  }),
) as any)
export class Moderation extends React.Component<any, any> {
  public componentDidMount() {
    const token = localStorage.getItem('avt_token');
    if (token) {
      this.props.loadCompanies(token);
    }

    document.title = `AVT · Раздел модерации`;
  }
  public render() {
    return (typeof this.props.user !== 'undefined' && !this.props.user.get('isFetching')) ? (
      this.props.user.get('isAuthenticated') ? (
        this.props.user.get('userData').get('is_admin') ? (
          <div className={style.Moderation}>
            <main className="m-header" data-ix="fixed-nav">
              <Header hideNav={true} />
            </main>
            <div className="section profile-section">
              <div className="container cart-container">
                <div className="row ticket-row w-row">
                  <div className="column w-col w-col-8 w-col-stack">
                    <div data-duration-in="300" data-duration-out="100"
                         className="profiletabs w-tabs" style={{zIndex: 800}}>
                      <div className="profiletabs-menu w-tab-menu">
                        <a data-w-tab="Waiting" className="profiletabs-link w-inline-block w-tab-link w--current">
                          <div>Ждут модерации</div>
                        </a>
                        <a data-w-tab="Autorized" className="profiletabs-link w-inline-block w-tab-link">
                          <div>Авторизованные</div>
                        </a>
                        <a data-w-tab="Declined" className="profiletabs-link w-inline-block w-tab-link">
                          <div>Отклонённые</div>
                        </a>
                      </div>
                      <div className="profiletabs-content w-tab-content">
                        <div data-w-tab="Waiting" className="profiletabs-tab w-tab-pane w--tab-active">
                          <CompanyList companies={this.props.waiting} />
                        </div>
                        <div data-w-tab="Autorized" className="profiletabs-tab w-tab-pane">
                          <CompanyList companies={this.props.authorized} />
                        </div>
                        <div data-w-tab="Declined" className="profiletabs-tab w-tab-pane">
                          <CompanyList companies={this.props.declined} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <h1>Permission denied</h1>
        )
      ) : (
        <div style={{maxWidth: '540px', padding: '40px 60px', margin: '10% auto 0'}}>
          <div style={{display: 'none'}}>login plz</div>
          <SignInForm current={true} selectOther={null} />
        </div>
      )
    ) : (<Loader hasOverLay={true} />);
  }
}
