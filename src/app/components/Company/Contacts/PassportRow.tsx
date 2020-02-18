import * as React from 'react';
import * as moment from 'moment';
import { CellFormCleave } from '../../Misc/Input/CellFormCleave';
import { DropdownSelect } from '../../Misc/Input/DropdownSelect';
import { IPassport, PassportType } from '../../../models/users';
import { ChangeEvent } from 'react';

export interface IPassportRowProps {
  passport: IPassport;
  onEdit: (id: number, param: string, value: any) => void;
  onRemove: (id: number) => void;
}
export class PassportRow extends React.Component<IPassportRowProps, any> {
  public readonly state: IPassport = this.props.passport.toJS();

  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
    this.editDate = this.editDate.bind(this);
  }
  private editDate(e) {
    this.setState({ validity: e.target.rawValue });
  }

  private onChange(e: ChangeEvent<HTMLInputElement>) {
    const type = e.target.name;
    this.setState({ [type]: e.target.value });
  }
  public render() {
    return (
      <div className="row flex-row w-clearfix">
        <div className="column-33">
          <div className="cell-form">
            <label htmlFor="Name-10" className="label">Тип документа</label>
            <DropdownSelect
              selectable={false} selectLimit={1}
              values={[
                {value: PassportType.GENERAL_PASSPORT, text: 'Паспорт РФ',
                  selected: this.props.passport.get('type') === PassportType.GENERAL_PASSPORT},
                {value: PassportType.FOREIGN_PASSPORT, text: 'Загранпаспорт',
                  selected: this.props.passport.get('type') === PassportType.FOREIGN_PASSPORT},
              ]}
              onSelect={(id, value) => {
                this.props.onEdit(this.state.id, id, value);
                this.setState({ type: value });
              }}
              placeholder={'Выбрать...'}
              name="type"/>
          </div>
        </div>
        {(this.state.type === PassportType.FOREIGN_PASSPORT) ? (
          <div className="column-33">
            <CellFormCleave
              key={this.state.id + 1}
              options={{
                blocks: [ 20 ], numericOnly: true,
              }}
              id={this.state.id}
              label={'Номер'}
              name={'number'}
              value={this.state.number || ''}
              onChange={(e) => this.onChange(e)}
              onBlur={(e) => this.props.onEdit(this.state.id, 'number', e.target.rawValue)}
              required={true}/>
          </div>
        ) : (
          <div className="column-66">
            {this.props.passport.get('user_id') > -1 && (
              <a href="#" className="tech-link delete-document"
                 onClick={() => this.props.onRemove(this.state.id)}>Удалить</a>
            )}
            <CellFormCleave
              key={this.state.id + 2}
              options={{
                blocks: [ 4, 6 ], numericOnly: true,
              }}
              id={this.state.id}
              label={'Серия и номер'}
              name={'number'}
              value={this.state.number || ''}
              onChange={(e) => this.onChange(e)}
              onBlur={(e) => this.props.onEdit(this.state.id, 'number', e.target.rawValue)}
              required={true}/>
          </div>
        )}
        {(this.state.type === PassportType.FOREIGN_PASSPORT) && (
          <div className="column-33">
            {this.props.passport.get('user_id') > -1 && (
              <a href="#" className="tech-link delete-document"
                 onClick={() => this.props.onRemove(this.state.id)}>Удалить</a>
            )}
            <CellFormCleave
              options={{
                blocks: [ 2, 2, 4 ],
                delimiter: '.', numericOnly: true,
              }}
              id={this.state.id}
              label="Срок действия"
              name={'validity'}
              value={this.state.validity || ''}
              onChange={(e) => this.editDate(e)}
              onBlur={(e) => this.props.onEdit(this.state.id, 'validity',
                moment(e.target.value, 'DD.MM.YYYY').format('YYYY-MM-DD'))}
              required={true} />
          </div>
        )}
      </div>
    );
  }
}
