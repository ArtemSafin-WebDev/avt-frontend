import * as React from 'react';
// import * as moment from 'moment';
import * as cx from 'classnames';
import { IFlightTariff } from '../../../models/search/IFlightTariff';
import { currencies } from '../../../redux/modules/search/service';

export interface IFlightPlansProps {
  tariffs: IFlightTariff[];
  onSelect: (selected: IFlightTariff) => any;
}

export interface IFlightPlansState {
  currentTab: number;
}

export class FlightPlans extends React.Component<IFlightPlansProps, IFlightPlansState> {
  public readonly state: IFlightPlansState= {
    currentTab: 0,
  };
  public render() {
    const tariffs = this.props.tariffs;
    return tariffs ? (
      <div className="w-form">
        <form className="plan-form">
          <div className="plans w-clearfix">
            <div className="radioembed w-embed"/>
            <div className="result-header w-clearfix">
              <h3 className="h3 left-h3 margin-bottom-h3">Тарифы</h3>
            </div>
            {tariffs.map((tariff: IFlightTariff, index) => (
              <div data-delay="200" key={Math.random()}
                   className={cx(
                     'plan-drop margin-bottom-plan-drop last w-dropdown',
                     {last: index === tariffs.length - 1},
                   )}
                   onClick={() => {
                     this.setState({currentTab: index});
                     this.props.onSelect(tariff);
                   }}>
                <div className={cx(
                  'plan-drop-toggle w-dropdown-toggle-modified',
                  {'w--open': index === this.state.currentTab},
                )}>
                  <div className="w-row">
                    <div className="col">
                      <div className="plan-info">
                        <div className="radio radio-plan w-clearfix w-radio">
                          <input type="radio" id={`tariff_${index}`} name="Radios"
                                 value={index} data-name="Radios" required={true}
                                 className="item-radio w-radio-input"/>
                          <label htmlFor={`tariff_${index}`} className="label-radio mr-15 w-form-label">
                            {tariff.name} ({tariff.route})
                          </label>
                          <div className="p red-p height-1-p left-p">
                            {tariff.price.total_amount} {currencies[tariff.price.price_currency]}
                            </div>
                        </div>
                      </div>
                    </div>
                    {tariff && tariff.services && tariff.services.length > 0 && (
                      <div className="col ml-auto">
                        <div className="plan-icon-block w-clearfix" data-ix="select-arrow">
                          <img src="/public/images/down-red.svg" className="select-icon"/>
                        </div>
                        <div className="tech-text red-tech-text tech-text-plan w-hidden-small w-hidden-tiny">
                          Подробнее
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                {tariff && tariff.services && tariff.services.length > 0 && (
                  <nav className={cx(
                    'order-drop-list w-dropdown-list',
                    {'w--open': index === this.state.currentTab},
                  )}>
                    <div className="order-details">
                      <div className="row w-row">
                        <div className="w-col w-col-4">
                          <div className="plan-block">
                            <div className="p mb-5">Включено</div>
                            {tariff.services.filter((s) => s.status === 'included').map((s) => (
                              <div className="tech-text margin-bottom-tech-text tech-text-pr20">
                                {s.name}
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="w-col w-col-4">
                          <div className="plan-block">
                            <div className="p mb-5">За плату</div>
                            {tariff.services.filter((s) => s.status === 'extra').map((s) => (
                              <div className="tech-text margin-bottom-tech-text tech-text-pr20">
                                {s.name}
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="w-col w-col-4">
                          <div className="plan-block last">
                            <div className="p mb-5">Не включено</div>
                            {tariff.services.filter((s) => s.status === 'locked').map((s) => (
                              <div className="tech-text margin-bottom-tech-text tech-text-pr20">
                                {s.name}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </nav>
                )}
              </div>
            ))}
          </div>
        </form>
      </div>
    ) : <span/>;
  }
}
