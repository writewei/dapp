import React from 'react';
import { inject, observer } from 'mobx-react';
import Cell from './Cell';

@inject()
@observer
export default class Header extends React.Component {
  render() {
    return (
      <Cell>
        <h1>writewei</h1>
      </Cell>
    );
  }
}
