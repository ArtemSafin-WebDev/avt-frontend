import * as React from 'react';
import { YMInitializer } from 'react-yandex-metrika';
// declare const b24form: (args: any) => any;
/*tslint:disable*/
export class Analytics extends React.Component {
  componentDidMount () {
    const s = document.createElement('script');
    s.async = true;
    s.src = '//code-ya.jivosite.com/widget/rnwIlaLREA';
    const h = document.getElementsByTagName('script')[ 0 ];
    h.parentNode.insertBefore(s, h);

    // (function (w, d, u, b) {
    //   w['Bitrix24FormObject'] = b;
    //   w[b] = w[b] || function () {
    //     arguments[ 0 ].ref = u;
    //     (w[b].forms = w[ b ].forms || []).push(arguments[0]);
    //   };
    //   if (w[b][ 'forms' ]) return;
    //   const s = d.createElement('script');
    //   s.async = true;
    //   s.src = u + '?' + new Date().getTime();
    //   const h = d.getElementsByTagName('script')[0];
    //   h.parentNode.insertBefore(s, h);
    // })(window, document, 'https://avt16.bitrix24.ru/bitrix/js/crm/form_loader.js', 'b24form');
    // if (typeof b24form === 'function') {
    //   b24form({'id':"2","lang":"ru","sec":"t600th","type":"delay","delay": 5});
    // }

  }
  public render() {
    return (
      <div>
        <YMInitializer accounts={[49360177]}  version="2" />
      </div>
    );
  }
}
