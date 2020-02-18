import * as React from 'react';
import { CellFormCleave } from '../../Misc/Input/CellFormCleave';
import { DropdownSelect } from '../../Misc/Input/DropdownSelect';
import { IBonusCard } from '../../../models/users';

export interface IBonusCardProps {
  bonusCard: IBonusCard;
  onEdit: (id: number, param: string, value: any) => void;
  onRemove: (id: number) => void;
}
export class BonusCard extends React.Component<IBonusCardProps, any> {
  public readonly state: IBonusCard = this.props.bonusCard;

  constructor(props) {
    super(props);
    this.editNumber = this.editNumber.bind(this);
  }
  private editNumber(e) {
    this.setState({ number: e.target.rawValue });
  }

  public render() {
    return (
      <div className="row flex-row w-clearfix">
        <div className="column-50">
          <div className="cell-form">
            <label htmlFor="Name-10" className="label">Авиакомпания</label>
            <DropdownSelect customClass={'whiteBG'}
              selectable={false} selectLimit={1}
              values={[
                {value: 434, text: 'Аэрофлот',
                  selected: this.props.bonusCard.airlines_id === 434},
                {value: 196, text: 'Россия',
                  selected: this.props.bonusCard.airlines_id === 196},
              ]}
              onSelect={(id, value) => this.props.onEdit(this.state.id, id, value)}
              placeholder={'Выбрать...'}
              name="airlines_id"/>
          </div>
        </div>
        <div className="column-50">
          <a href="#" className="tech-link delete-document"
             onClick={() => this.props.onRemove(this.state.id)}>Удалить</a>
          <CellFormCleave
            options={{
              blocks: [ 20 ], numericOnly: true,
            }}
            id={this.state.id}
            label={'Номер'}
            name={'number'}
            value={this.state.number || ''}
            onChange={(e) => this.editNumber(e)}
            onBlur={(e) => this.props.onEdit(this.state.id, 'number', e.target.rawValue)}
            required={true} />
        </div>
      </div>
    );
  }
}
