import * as React from 'react';
import { Header } from '../../Header';

export interface IMainHeaderIframedProps {
  isAuthenticated?: boolean;
}
export class MainHeaderIframed extends React.Component<IMainHeaderIframedProps> {
  // private iframeLoaded() {
  //   const iFrameID = document.getElementById('17ff5bcdd1') as any;
  //   if (iFrameID) {
  //     iFrameID.setAttribute('height', '');
  //     iFrameID.setAttribute('height', iFrameID.contentWindow.document.body.scrollHeight + 'px');
  //   }
  // }
  public componentDidMount() {
    /*tslint:disable-next-line*/
    (function(){var c=function(a){if("object"==typeof a&&"https://crm.etm-system.com"==a.origin&&a.data&&a.data.fid&&a.data.height&&"number"==typeof a.data.height){var b=document.getElementById(a.data.fid);b&&1==b.nodeType&&(b.style.height=a.data.height+"px",a.data.scroll&&"number"==typeof a.data.scroll&&window.scrollTo(0,a.data.scroll+b.offsetTop))}};window.addEventListener?window.addEventListener("message",c,!1):window.attachEvent("onmessage",c)})();
  }
  public render() {
    return (
      <main className="main service-main">
        <Header isAuthenticated={this.props.isAuthenticated}/>
        <div>
          <div className="container main-container">
            <div className="main-tabs w-clearfix">
              <iframe scrolling="no" id="17ff5bcdd1" height="5000" width="1200"
                      frameBorder={0} marginHeight={0} marginWidth={0}
                      src="https://crm.etm-system.com/frame/main?fid=17ff5bcdd1"
                      name={`@${location.protocol}//${location.host}`}/>
            </div>
          </div>
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
        </div>
      </main>

    );
  }
}
