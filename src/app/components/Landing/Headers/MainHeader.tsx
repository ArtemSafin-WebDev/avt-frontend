import * as React from 'react';
import { SearchBox } from '../../Misc/SearchBox/SearchBox';
import { Header } from '../../Header';
import { Link } from 'react-router';

export interface IMainHeaderProps {
  pageName: string;
  title: string;
  imageURL?: string;
  isAuthenticated?: boolean;
}
export class MainHeader extends React.Component<IMainHeaderProps> {
  public render() {
    const bg = this.props.imageURL ? `url(${this.props.imageURL})` : 'url("/public/images/main-bg.jpg")';
    const { title, pageName } = this.props;
    return (
      <main className="main service-main" style={{backgroundImage: bg}}>
        <Header isAuthenticated={this.props.isAuthenticated} />
        <div className="container main-container">
          {pageName !== 'home' && pageName !== 'travel' ? (
            <div className="main-tabs w-clearfix">
              <span className="h1 link-h1 current-h1">{title}</span>
            </div>
          ) : (
            <div className="main-tabs w-clearfix">
              <Link to="/" className="h1 link-h1">Командировка</Link>
              <Link to="/page/travel" className="h1 link-h1">Путешествие</Link>
            </div>
          )}
          <SearchBox showMenu={true} pageName={this.props.pageName} />
        </div>
        {(pageName === 'home' || pageName === 'travel') && (
            <div data-w-id="8b1ef095-0809-e75a-5d40-1d04d0f1839b" className="elements">
              <img src="/public/images/plane-white.svg"
                   data-w-id="ead11719-db05-a9fd-eb60-d0d997bfa40e"
                   className="el-plane-1"/>
              <img src="/public/images/plane-white.svg"
                   data-w-id="e2bb46e3-d5d1-a099-aa14-6a419c3d9dc4"
                   className="el-plane-2"/>
              <img src="/public/images/plane-white.svg"
                   data-w-id="7556920a-fee0-081d-d365-5addbc65ade5"
                   className="el-plane-3"/>
              <img src="/public/images/plane-white.svg"
                   data-w-id="c2a70c54-70cd-1a29-396f-3140267cb69f"
                   className="el-plane-4"/>
              <img src="/public/images/plane-white.svg"
                   data-w-id="a115e6ca-e1bb-215f-01eb-6ccb16e9f58d"
                   className="el-plane-5"/>
            </div>
          )}
      </main>

    );
  }
}
