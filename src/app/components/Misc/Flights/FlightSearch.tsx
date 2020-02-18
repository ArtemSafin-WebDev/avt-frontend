import * as React from 'react';
import * as cx from 'classnames';
import { Link } from 'react-router';
import { IFlight, IFlightsInfo, ITicket } from '../../../models/search/ISearchEntryAvia';
import { logosX25 } from '../../../redux/modules/search/service';

export interface IFlightSearchProps {
  properties: string;
  ticket: ITicket;
  onClick?: (ticket: ITicket) => void;
  hotelResponseId?: string;
}
export interface IFlightSearchState {
  tooltip: string;
}

export class FlightSearch extends React.Component<IFlightSearchProps, IFlightSearchState> {
  constructor(props) {
    super(props);
    this.state = {
      tooltip: '',
    };
  }
  private renderBaggage(baggage: string) {
    if (baggage === 'NO') {
      return `Без багажа`;
    }
    if (baggage.indexOf('Kg') > -1) {
      return baggage.replace('Kg', ' кг. багажа');
    }
    if (baggage.indexOf('PC') > -1) {
      const pcs = Number(baggage.replace('PC', ''));
      if (pcs === 0) {
        return 'Без багажа';
      } else if (pcs === 1) {
        return '1 место для багажа';
      } else { return `${pcs} места для багажа`; }
    }
    return baggage;
  }
  private renderCost(last = false) {
    return (
      <div className="w-col w-col-2 w-col-small-small-stack">
        <div className={cx('result-price', {'w-hidden-small w-hidden-tiny': !last,
          'w-hidden-main w-hidden-medium': last})}>
          <div className="p red-p height-1-p">
            {this.props.ticket.price} ₽
          </div>
          <div className="tech-text red-tech-text opacity-tech-text">
            {this.renderBaggage(this.props.ticket.firstDirection.baggage)}
            </div>
        </div>
      </div>
    );
  }
  private legToString(legs: IFlightsInfo[]) {
    let postfix = '';
    legs.forEach((airport, i) => {
      if (i !== 0 && airport.departure_airport !== legs[i - 1].arrival_airport) {
        postfix += ', смена аэропорта';
      }
    });
    switch ((legs.length - 1) % 10) {
      case 0: return 'Без пересадок';
      case 1: return `1 пересадка${postfix}`;
      case 2: case 3: case 4: return `${legs.length - 1} пересадки${postfix}`;
      default: return `${legs.length || 'Без'} пересадок${postfix}`;
    }
  }
  private avialinesNames(legs: IFlightsInfo[]) {
    // Returns comma separated list of airlines
    return legs.map((current: IFlightsInfo) => current.operating_airline_name)
      .filter((item: string, pos, obj) => {
        return obj.indexOf(item) === pos;
      }).map((airline) => airline.toLowerCase()).join(', ');
  }
  private avialinesIcons(legs: IFlightsInfo[]) {
    return legs.map((leg, i) => {
      // Render the first and all non-repeating logos
      if (i === 0 || (i > 0 && leg.operating_airline_name !== legs[i - 1].operating_airline_name)) {
        const src = (logosX25.indexOf(leg.operating_airline_code) > -1)
          ? `/public/images/airlines/25px/${leg.operating_airline_code}.png`
          : leg.operating_airline_logo;
        return (
          <img key={leg.operating_airline_name + '_' + i}
               src={src}
               className={cx({'avia-icon': true, 'second': i !== 0})} />
        );
      }
    });
  }
  private renderTooltips(legs: IFlightsInfo[]) {
    const tooltips = [];
    for (let i = 0; i < legs.length - 1; i++) {
      const airport = legs[i];
      const next = legs[i + 1];
      let str = `Пересадка в г. ${airport.arrival_city}, `
            + `${airport.arrival_airport}  ${airport.stop_time}, `
            + `${airport.arrival_local_time}-`
            + `${next.departure_local_time}`;
      if (airport.arrival_airport !== next.departure_airport) {
        str += `, смена аэропорта на ${next.departure_airport}`;
      }
      tooltips.push({id: airport.flight_number, str});
    }
    return tooltips.map((tooltip, i) => (
      <div className={cx({'time-pop w-hidden-small w-hidden-tiny': true,
        'w--open': tooltip.id === this.state.tooltip,
        ['tooltip-' + i]: true})} key={tooltip.id + i} id={tooltip.id}>
        <div className="text_fly-time">{tooltip.str}</div>
        <div className="pop-corner"/>
      </div>
    ));
  }

  private renderAvialines(legs: IFlightsInfo[]) {
    if (legs instanceof Array) {
      return (
        <div className="result-info" key={Math.random()}>
          <div className="result-ac w-clearfix">
            {this.avialinesIcons(legs)}
            <div className="p height-1-p" style={{ textTransform: 'capitalize' }}>
              {this.avialinesNames(legs)}
            </div>
          </div>
          <div className="tech-text">{this.legToString(legs)}</div>
        </div>
      );
    }
  }

  private renderPath(legs: IFlightsInfo[], duration: string) {
    return (
      <div className="w-col w-col-5 w-col-small-small-stack">
        <div className="time" data-ix="fly-time-tooltip">
          <div className="time-column time-column-left">
            <div className="p height-1-p">{legs[0].departure_local_time}</div>
            <div className="tech-uc">{legs[0].departure_airport}</div>
          </div>
          <div className="time-column time-column-center">
            <div className={cx({'time-directory': true, ['legs-' + legs.length]: true})}>
              {legs.map((el, i) => (el && i !== legs.length - 1)
                ? (
                  <div className="time-circle"
                       key={el.flight_number + i}
                       onMouseEnter={() => this.setState({tooltip: el.flight_number})}
                       onMouseLeave={() => this.setState({tooltip: ''})}/>
                ) : null)}
              <div className="time-line"/>
            </div>
            <div className="tech-text center-tech-text">{duration}</div>
          </div>
          <div className="time-column servicetime-column-right">
            <div className="p height-1-p">{legs[legs.length - 1].arrival_local_time}</div>
            <div className="tech-uc">{legs[legs.length - 1].arrival_airport}</div>
          </div>
          <div className={cx({tooltips: true, ['tooltips-' + legs.length]: true})}>
            {this.renderTooltips(legs)}
          </div>
        </div>
      </div>
    );
  }

  private renderDirection(flight: IFlight, duration: string, last = false) {
    return (
      <div className={cx('result-row w-row', {'result-row-last': last})} key={flight.segment_id}>
        <div className="w-col w-col-5 w-col-small-small-stack">
          {this.renderAvialines(flight.flights_info)}
        </div>
        {this.renderPath(flight.flights_info, duration)}
        {this.renderCost(last)}
      </div>
    );
  }

  private getRoute = (ticket: ITicket) => {
    let suffix = '?';
    if (this.props.hotelResponseId) {
      suffix += `hotelResponseId=${this.props.hotelResponseId}`;
    }
    return `/avia-ticket/${this.props.properties}/${ticket.id}${suffix}`;
  }

  public render() {
    const { ticket, onClick } = this.props;
    return (
      <Link to={this.getRoute(ticket)} target="_blank"
            key={ticket.id}
            className={cx('result w-inline-block', {'one-way': !ticket.secondDirection})}
            onClick={() => (onClick) ? onClick(ticket) : null}>
        {ticket.label && (
          <div className="result-tag">
            <div>{ticket.label}</div>
          </div>
        )}
        {this.renderDirection(
          ticket.firstDirection,
          ticket.firstDirection.duration_formated,
          // If there is no second ticket - show price after first direction
          !ticket.secondDirection)}

        {ticket.secondDirection && this.renderDirection(
                                      ticket.secondDirection,
                                      ticket.secondDirection.duration_formated, true)}
      </Link>
    );
  }
}
