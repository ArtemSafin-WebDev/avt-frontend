import * as React from 'react';
import * as moment from 'moment';
import * as cx from 'classnames';
import { IFlight, IFlightsInfo, ITicket } from '../../../models/search/ISearchEntryAvia';
import { logosX50 } from '../../../redux/modules/search/service';
// import * as cx from 'classnames';

export interface IFlightDetailsProps {
  ticket: ITicket;
}
export interface IFlightDetailsState {
}
export class FlightDetails extends React.Component<IFlightDetailsProps, IFlightDetailsState> {
  private renderBaggage(baggage: string) {
    if (baggage === 'NO') {
      return `Без багажа`;
    }
    if (baggage.indexOf('Kg') > -1) {
      return `1 место для багажа, до ${baggage.replace('Kg', '')}`;
    }
    if (baggage.indexOf('PC') > -1) {
      const pcs = Number(baggage.replace('PC', ''));
      if (pcs === 0) {
        return 'Без багажа';
      } else if (pcs === 1) {
        return '1 место для багажа';
        // return '1 место для багажа, до 23 кг';
      } else { return `${pcs} места багажа`; }
      // } else { return `${pcs} места багажа, до 23 кг на каждый`; }
    }
    return baggage;
  }
  private renderRow(flight: IFlightsInfo, next: IFlightsInfo, baggage: string) {
    const res = [];
    const src = (logosX50.indexOf(flight.operating_airline_code) > -1)
      ? `/public/images/airlines/50px/${flight.operating_airline_code}.png`
      : flight.operating_airline_logo;
    res.push ((
      <div key={flight.flight_number}
        className={cx('result-row w-row flight-row', {'result-row-last': !next})}>
        <div className="w-col w-col-3 w-col-small-small-stack">
          <div className="result-info w-clearfix">
            <img src={src}
                 alt={flight.operating_airline_name}
                 className="avia-logo"/>
            <div className="p height-1-p" style={{textTransform: 'capitalize'}}>
              {flight.operating_airline_name.toLowerCase()}
            </div>
            <div className="tech-text">{flight.duration_formated} в пути</div>
          </div>
        </div>
        <div className="w-col w-col-5 w-col-small-small-stack">
          <div className="time">
            <div className="time-column time-column-left">
              <div className="p height-1-p">{flight.departure_local_time}</div>
              <div className="tech-text black-tech-text margin-bottom-tech-text">
                {flight.departure_city}
              </div>
              <div className="tech-uc">
                {flight.departure_airport}
                {flight.departure_terminal && (`, ${flight.departure_terminal}`)}
              </div>
            </div>
            <div className="time-column time-column-center">
              <div className="time-directory">
                <div className="time-line"/>
              </div>
            </div>
            <div className="time-column servicetime-column-right">
              <div className="p height-1-p">{flight.arrival_local_time}</div>
              <div className="tech-text black-tech-text margin-bottom-tech-text">
                {flight.arrival_city}
              </div>
              <div className="tech-uc">
                {flight.arrival_airport}
                {flight.arrival_terminal && (`, ${flight.arrival_terminal}`)}
              </div>
            </div>
          </div>
        </div>
        <div className="w-col w-col-4 w-col-small-small-stack">
          <div className="result-side">
            <div className="tech-text margin-bottom-tech-text">
              {flight.flight_number_print} · {flight.airplane_name ? flight.airplane_name : flight.airplane_code}
              </div>
            {/*<div className="tech-text margin-bottom-tech-text">Ручная кладь до 10 кг, 40×20×55 см</div>*/}
            <div className="tech-text margin-bottom-tech-text">Нет информации о ручной клади</div>
            <div className="tech-text">{this.renderBaggage(baggage)}</div>
          </div>
        </div>
      </div>
    ));
    if (next) {
      res.push((
        <div className="result-atransfer" key={flight.departure_local_time + next.departure_local_time}>
          <div className="p height-1-p">
            Пересадка в г. {flight.arrival_city}, {flight.stop_time}
            {flight.arrival_airport !== next.departure_airport
              && (`, смена аэропорта с ${flight.arrival_airport} на ${next.departure_airport}`)}
          </div>
        </div>
      ));
    }
    return res;
  }

  public shouldComponentUpdate(props: IFlightDetailsProps) {
    return (props.ticket && (!this.props.ticket || this.props.ticket.id !== props.ticket.id));
  }

  private renderFlight(flight: IFlight) {
    return (
      <div key={flight.flight_number}>
        <div className="result-header w-clearfix">
          <h3 className="h3 left-h3 margin-bottom-h3">
            {flight.flights_info[0].departure_city} <span> — </span>
            {flight.flights_info[flight.flights_info.length - 1].arrival_city}
          </h3>
          <div className="p left-p">{moment(flight.departure_timestamp * 1000).format('LL')}</div>
          <div className="p left-p">{flight.duration_formated} в пути</div>
        </div>
        <div className="result no-hover-ticketinfo-block flight-block mb-50">
          {flight.flights_info.map((cur: IFlightsInfo, i) => {
            const next = (i + 1 < flight.flights_info.length) ? flight.flights_info[i + 1] : null;
            return this.renderRow(cur, next, flight.baggage);
          })}
        </div>
      </div>
    );
  }

  public render() {
    const ticket = this.props.ticket;
    return (
      <div>
        {this.renderFlight(ticket.firstDirection)}
        {ticket.secondDirection && this.renderFlight(ticket.secondDirection)}
      </div>
    );
  }
}
