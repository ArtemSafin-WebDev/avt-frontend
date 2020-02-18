/*tslint:disable-next-line*/
import * as React from 'react';
import { IndexRoute, Route } from 'react-router';
import { App, Home } from 'containers';
import { Moderation } from '../containers/Moderation';
import { Profile } from '../containers/Profile';
import { NotFound } from '../components/Misc/NotFound/NotFound';
import { SearchAvia } from '../containers/Search/SearchAvia';
import { SearchHotel } from '../containers/Search/SearchHotel';
import { TicketAvia } from '../containers/Avia/TicketAvia';
import { Page } from '../containers/Page/Page';
import { Hotel } from '../containers/Hotel/Hotel';
import { Contacts } from '../containers/Page/Contacts';
import { Offer } from '../containers/Purchasing/Offer';
import { BasketPage } from '../containers/Purchasing/BasketPage';
import { SuccessfulOrder } from '../containers/Purchasing/SuccessfulOrder';
import { FailedOrder } from '../containers/Purchasing/FailedOrder';

export default (
  <Route path="/" component={App}>
    <IndexRoute component={Home} />
    <Route path="moderation" component={Moderation} />
    <Route path="search-avia" component={SearchAvia}>
      <Route path=":destination" />
    </Route>
    <Route path="search-hotel" component={SearchHotel}>
      <Route path=":destination" />
    </Route>
    <Route path="page" component={Page}>
      <Route path=":name" />
    </Route>
    <Route path="payment">
      <Route path="success" component={SuccessfulOrder} />
      <Route path="failed" component={FailedOrder} />
    </Route>
    <Route path="avia-ticket/:destination/:id" component={TicketAvia} />
    <Route path="book-hotel/:city/:id" component={Hotel} />
    <Route path="offer" component={Offer} />
    <Route path="basket" component={BasketPage} />
    <Route path="profile" component={Profile} />
    <Route path="contacts" component={Contacts} />
    <Route path="*" component={NotFound} />
  </Route>
);
