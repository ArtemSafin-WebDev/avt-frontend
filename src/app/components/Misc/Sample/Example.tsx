import * as React from 'react';
import { connect } from 'react-redux';

export interface IExampleProps {
}
export interface IExampleState {
}
@(connect(
  (/*state: IStore*/) => ({
  }),
  (/*dispatch*/) => ({
  }),
) as any)
export class Example extends React.Component<IExampleProps, IExampleState> {
  public readonly state: IExampleState = {
    newContact: false,
  };

  constructor(props) {
    super(props);
  }

  public render() {
    return (
      <div/>
    );
  }
}
