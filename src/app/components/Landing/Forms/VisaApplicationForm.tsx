import * as React from 'react';
import * as cx from 'classnames';
import * as moment from 'moment';
import { CellForm } from '../../Misc/Input/CellForm';
import { CellFormCleave } from '../../Misc/Input/CellFormCleave';
import { DateFilter } from '../../Misc/Input/DateFilter';
import { DropdownSelect } from '../../Misc/Input/DropdownSelect';
import { DropdownFileUploader } from '../../Misc/FileUploader/DropdownFileUploader';
import { visaRequest } from '../../../redux/modules/pages/service';
import { IStore } from '../../../redux/IStore';
import { connect } from 'react-redux';
import { IBlock } from '../../../redux/modules/pages/IBlock';

export interface IVisaApplicationFormProps {
  title: string;
  description?: string;
  visaRequest?: any;
  cards: IBlock[];
}
export interface IVisaApplicationFormState {
  first_last_name: string;
  first_name?: string;
  second_name?: string;
  last_name?: string;
  phone_number: string;
  email: string;
  birthday: string;
  city_of_residence: string;
  citizen: string;
  martial_status: string;
  job_status: string;
  country: string;
  trip_goal: string;
  has_fingerprints: boolean;
  schengen_in_last_three_years: boolean;
  departure_date: any;
  arrival_date: any;
  note: string;
  attachments: any[];
}
@(connect(
  (state: IStore) => ({
    user: state.get('user'),
    search: state.get('search'),
  }),
  (dispatch) => ({
    visaRequest: (data) => dispatch(visaRequest(data)),
  }),
) as any)
export class VisaApplicationForm extends React.Component<IVisaApplicationFormProps, IVisaApplicationFormState> {
  public readonly state: IVisaApplicationFormState = {
    first_last_name: '',
    phone_number: '',
    email: '',
    birthday: '',
    city_of_residence: '',
    citizen: '',
    martial_status: 'married',
    job_status: 'employed',
    country: '',
    trip_goal: 'tourism',
    departure_date: null,
    arrival_date: null,
    schengen_in_last_three_years: false,
    has_fingerprints: false,
    attachments: [],
    note: '',
  };
  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
    this.onFileUpload = this.onFileUpload.bind(this);
    this.onFileRemove = this.onFileRemove.bind(this);
    this.onChangeParam = this.onChangeParam.bind(this);
    this.onChangeCleave = this.onChangeCleave.bind(this);
  }
  private onChange(e) {
    const type = e.target.name;
    this.setState({ [type]: e.target.value });
  }
  private onChangeParam(name, value) {
    this.setState({[name]: value });
  }
  private onFileUpload(files: any[]) {
    this.setState({attachments: {...this.state.attachments, files}});
  }
  private onFileRemove(attachments: any[]) {
    this.setState({attachments});
  }
  private onChangeCleave(e) {
    const type = e.target.name;
    this.setState({ [type]: e.target.rawValue });
  }

  public render() {
    const { title, description } = this.props;
    return (
      <section className="section content-section">
        <div className="container">
          <div id="visa" className="anchor"/>
          <div className="h1 margin-h1">{title}</div>
          {description && (<div className="p-big margin-p-big">{description}</div>)}
          <div className="row ticket-row w-row">
            <div className="column w-col w-col-8">
              <div className="visa-form">
                <div className="form">
                  <div className="form w-form">
                    <form id="email-form-4" name="email-form-4" data-name="Email Form 4" className="w-clearfix">
                      <div className="row flex-row w-clearfix">
                        <div className="column-50">
                          <CellForm
                            id={1}
                            label={'Имя и Фамилия'}
                            name={'first_last_name'}
                            value={this.state.first_last_name}
                            onChange={this.onChange}
                            required={true} />
                        </div>
                        <div className="column-50">
                          <CellFormCleave
                            id={2}
                            options={{
                              blocks: [ 2, 3, 3, 2, 2 ], prefix: '+7',
                              delimiter: ' ', numericOnly: true,
                            }}
                            label={'Телефон'}
                            name={'phone_number'}
                            value={this.state.phone_number}
                            onChange={this.onChangeCleave}
                            required={true} />
                        </div>
                      </div>
                      <div className="row flex-row w-clearfix">
                        <div className="column-50">
                          <CellForm
                            id={3}
                            label={'E-mail'}
                            type={'email'}
                            name={'email'}
                            value={this.state.email}
                            onChange={this.onChange}
                            required={true} />
                        </div>
                        <div className="column-50">
                          <CellFormCleave
                            options={{
                              blocks: [ 2, 2, 4 ],
                              delimiter: '.', numericOnly: true,
                            }}
                            label={'Дата рождения'}
                            name={'birthday'}
                            value={this.state.birthday}
                            onChange={this.onChange}
                            required={true} />
                        </div>
                      </div>
                      <div className="row flex-row w-clearfix">
                        <div className="column-50">
                          <CellForm
                            id={4}
                            label={'Город проживания'}
                            name={'city_of_residence'}
                            value={this.state.city_of_residence}
                            onChange={this.onChange}
                            required={true} />
                        </div>
                        <div className="column-50">
                          <CellForm
                            id={5}
                            label={'Гражданство'}
                            name={'citizen'}
                            value={this.state.citizen}
                            onChange={this.onChange}
                            required={true} />
                        </div>
                      </div>
                      <div className="row flex-row w-clearfix">
                        <div className="column-50">
                          <div className="cell-form">
                            <label htmlFor="martial_status_1" className="label">Семейное положение</label>
                            <DropdownSelect
                              selectable={false} selectLimit={1}
                              values={[
                                {value: 'married', text: 'Женат / Замужем',
                                  selected: this.state.martial_status === 'married'},
                                {value: 'unmarried', text: 'Не женат / Не замужем',
                                  selected: this.state.martial_status === 'unmarried'},
                              ]}
                              onSelect={(name, value) => this.onChangeParam(name, value)}
                              placeholder={'Выберите семейный статус'}
                              name="martial_status"/>
                          </div>
                        </div>
                        <div className="column-50">
                          <div className="cell-form">
                            <label htmlFor="job_status" className="label">Тип заявителя</label>
                            <DropdownSelect
                              selectable={false} selectLimit={1}
                              values={[
                                {value: 'employed', text: 'Работающий',
                                  selected: this.state.job_status === 'employed'},
                                {value: 'unemployed', text: 'Неработающий',
                                  selected: this.state.job_status === 'unemployed'},
                                {value: 'student', text: 'Учащийся',
                                  selected: this.state.job_status === 'student'},
                              ]}
                              onSelect={(name, value) => this.onChangeParam(name, value)}
                              placeholder={'Выберите тип заявителя'}
                              name="job_status"/>
                          </div>
                        </div>
                      </div>
                      <div className="row flex-row w-clearfix">
                        <div className="column-50">
                          <CellForm
                            id={6}
                            label={'Страна'}
                            name={'country'}
                            value={this.state.country}
                            onChange={this.onChange}
                            required={true} />
                        </div>
                        <div className="column-50">
                          <div className="cell-form">
                            <label htmlFor="country" className="label">Цель поездки</label>
                            <DropdownSelect
                              selectable={false} selectLimit={1}
                              values={[
                                {value: 'tourism', text: 'Туризм',
                                  selected: this.state.trip_goal === 'tourism'},
                                {value: 'work', text: 'Работа',
                                  selected: this.state.trip_goal === 'work'},
                              ]}
                              onSelect={(name, value) => this.onChangeParam(name, value)}
                              placeholder={'Выберите цель поездки'}
                              name="trip_goal"/>
                          </div>
                        </div>
                      </div>
                      <div className="row flex-row w-clearfix">
                        <div className="column-50">
                          <div className="cell-form">
                            <label htmlFor="Departure_date" className="label">
                              Предполагаемая дата въезда <br/>в выбранную страну
                            </label>
                            <DateFilter
                              name="departure_date"
                              forbidBeforeDay={moment()}
                              date={this.state.departure_date}
                              onChange={this.onChangeParam}/>
                          </div>
                        </div>
                        <div className="column-50">
                          <div className="cell-form">
                            <label htmlFor="Arrival_date" className="label">
                              Предполагаемая дата выезда <br/>из выбраной страны
                            </label>
                            <DateFilter
                              name="arrival_date"
                              forbidBeforeDay={this.state.departure_date}
                              date={this.state.arrival_date}
                              onChange={this.onChangeParam}/>
                          </div>
                        </div>
                      </div>
                      <div className="visa-preferences">
                        <div className="tech-uc black-tech-uc margin-bottom-tech-uc">Шенгенская виза</div>
                        <div className="row flex-row w-clearfix">
                          <div className="column-50">
                            <div className="cell-form">
                              <label htmlFor="gender" className="label">Вы сдавали отпечатки пальцев для получения
                                Шенгенской визы после введения биометрии в 14.09.2015 году?</label>
                              <div className="tumblr w-clearfix">
                                <a href="#"
                                   className={cx(
                                     'tumblr-button tumblr-button-left w-button',
                                     {'tumblr-button-current': this.state.has_fingerprints === false})}
                                   onClick={() => this.onChangeParam('has_fingerprints', false)}>
                                  Нет
                                </a>
                                <a href="#"
                                   className={cx(
                                     'tumblr-button tumblr-button-right w-button',
                                     {'tumblr-button-current': this.state.has_fingerprints === true})}
                                   onClick={() => this.onChangeParam('has_fingerprints', true)}>
                                  Да
                                </a>
                              </div>
                            </div>
                          </div>
                          <div className="column-50">
                            <div className="cell-form">
                              <label htmlFor="gender" className="label">Получали ли вы Шенгенскую визу
                                <br/>за последние 3 года?</label>
                              <div className="tumblr w-clearfix">
                                <a href="#"
                                   className={cx(
                                     'tumblr-button tumblr-button-left w-button',
                                     {'tumblr-button-current': this.state.schengen_in_last_three_years === false})}
                                   onClick={() => this.onChangeParam('schengen_in_last_three_years', false)}>
                                  Нет
                                </a>
                                <a href="#"
                                   className={cx(
                                     'tumblr-button tumblr-button-right w-button',
                                     {'tumblr-button-current': this.state.schengen_in_last_three_years === true})}
                                   onClick={() => this.onChangeParam('schengen_in_last_three_years', true)}>
                                  Да
                                </a>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="row flex-row w-clearfix">
                          <div className="column-100">
                            <div className="cell-form">
                              <label htmlFor="Message" className="label">Комментарий к заявке (необязательно)
                                <br/>В данном поле вы можете описать вашу ситуацию или задать дополнительные вопросы
                              </label>
                              <textarea id="Message-Field"
                                        value={this.state.note}
                                        name="Message-Field" maxLength={5000}
                                        data-name="Message Field"
                                        onChange={(e) => this.onChangeParam('note', e.target.value)}
                                        className="textarea input message-field w-input"/>
                            </div>
                          </div>
                        </div>
                        <DropdownFileUploader onUpload={this.onFileUpload}
                          onRemove={this.onFileRemove}
                          accept="image/*, .jpeg, .png, .jpg, .pdf"/>
                      </div>
                      <div className="label privacy">
                        Нажимая на кнопку, я подтверждаю, что ознакомлен(на) и согласен(на) с
                        <a className="span-link"> Пользовательским соглашением </a>
                        и даю согласие на обработку персональных данных.
                      </div>
                    </form>
                  </div>
                </div>
                <a href="#" className="button-visa w-button" onClick={() => this.props.visaRequest(this.state)}>
                  Отправить запрос
                </a>
              </div>
            </div>
            {this.props.cards && this.props.cards[ 0 ].image_url ? (
              <div className="column cart-column w-col w-col-4">
                {this.props.cards.map((card) => (
                  <div className="card no-hover-card min-visa-card" key={card.title}>
                    <img src={card.image_url} className="landing-icon"/>
                    <h3 className="h3">{card.title}</h3>
                  </div>
                ))}
              </div>
            ) : (
              <div className="column cart-column w-col w-col-4">
                <div className="card no-hover-card min-visa-card">
                  <img src="/public/images/sky-gradient.svg" className="landing-icon"/>
                  <h3 className="h3">Туристическая виза</h3>
                </div>
                <div className="card no-hover-card min-visa-card">
                  <img src="/public/images/business-gradient.svg" className="landing-icon"/>
                  <h3 className="h3">Рабочая виза</h3>
                </div>
                <div className="card no-hover-card min-visa-card">
                  <img src="/public/images/student-gradient.svg" className="landing-icon"/>
                  <h3 className="h3">Студенческая виза</h3>
                </div>
                <div className="card no-hover-card min-visa-card">
                  <img src="/public/images/board-gradient.svg" className="landing-icon"/>
                  <h3 className="h3">Деловая виза</h3>
                </div>
                <div className="card no-hover-card min-visa-card">
                  <img src="/public/images/tour-gradient.svg" className="landing-icon"/>
                  <h3 className="h3">Транзитная виза</h3>
                </div>
                <div className="card no-hover-card min-visa-card">
                  <img src="/public/images/meeting-gradient.svg" className="landing-icon"/>
                  <h3 className="h3">Гостевая виза</h3>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    );
  }
}
