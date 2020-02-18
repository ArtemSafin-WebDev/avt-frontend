import * as React from 'react';
import { IStore } from 'redux/IStore';
import { Helmet } from 'react-helmet';
import * as serialize from 'serialize-javascript';

interface IHtmlProps {
  manifest?: any;
  markup?: string;
  store?: Redux.Store<IStore>;
}

class Html extends React.Component<IHtmlProps, {}> {
  private resolve(files) {
    return files.map((src) => {
      if (!this.props.manifest[src]) { return; }
      return '/public/' + this.props.manifest[src];
    }).filter((file) => file !== undefined);
  }

  public render() {
    const head = Helmet.rewind();
    const { markup, store } = this.props;

    const styles = this.resolve(['vendor.css', 'app.css']);
    const renderStyles = styles.map((src, i) =>
      <link key={i} rel="stylesheet" type="text/css" href={src} />,
    );

    const scripts = this.resolve(['vendor.js', 'app.js', 'avt.js']);
    const renderScripts = scripts.map((src, i) =>
      <script src={src} key={i} />,
    );
    // tslint:disable:next-line max-line-length no-string-literal
    const initialState = (
      <script dangerouslySetInnerHTML={{ __html: `window.__INITIAL_STATE__=${serialize(store.getState(), { isJSON: true })};` }}
              charSet="UTF-8" />
    );
    // tslint:disable:next-line max-line-length no-string-literal
    const browserFix = (
      <script dangerouslySetInnerHTML={{ __html: `var yaBrowserUpdater = new ya.browserUpdater.init({"lang":"ru","browsers":{"yabrowser":"16.12","chrome":"62","ie":"10","opera":"49","safari":"9.1","fx":"57","iron":"35","flock":"Infinity","palemoon":"25","camino":"Infinity","maxthon":"4.5","seamonkey":"2.3"},"theme":"red"});` }} />
    );
    // tslint:disable-next-line:max-line-length
    // const shim = `<!-- [if lt IE 9]><script src="https://cdnjs.cloudflare.com/ajax/libs/html5shiv/3.7.3/html5shiv.min.js" type="text/javascript"></script><![endif] -->`;
    const touchFix = `!function(o,c){var n=c.documentElement,t=" w-mod-";n.className+=t+"js",("ontouchstart"in o||o.DocumentTouch&&c instanceof DocumentTouch)&&(n.className+=t+"touch")}(window,document);`;
    return (
      <html data-wf-site={head['data-wf-site']}>
        <head>
          {head.base.toComponent()}
          {head.title.toComponent()}
          {head.meta.toComponent()}
          {head.link.toComponent()}
          {head.script.toComponent()}
          <script src="https://cdn.ravenjs.com/3.10.0/raven.min.js" crossOrigin="anonymous"/>
          {renderStyles}
          <script dangerouslySetInnerHTML={{__html: touchFix}} />
          <link rel="stylesheet" href="/public/css/normalize.css?v=1.12" />
          <link rel="stylesheet" href="/public/css/elements.css?v=1.12" />
          <link rel="stylesheet" href="/public/css/avt.css?v=1.12" />
          <link rel="stylesheet" href="/public/css/components.css?v=1.13" />
          <link rel="shortcut icon" href="/public/favicon.ico" />
        </head>
        <body>
          <div id="app" dangerouslySetInnerHTML={{ __html: markup }} />
          {initialState}
          {renderScripts}
          <script src="https://yastatic.net/browser-updater/v1/script.js" charSet="utf-8"/>
          {browserFix}
        </body>
      </html>
    );
  }
}

export { Html }
