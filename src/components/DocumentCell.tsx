import React from 'react';
import Cell from './Cell';
import CIDBadge from './CIDBadge';
import WeiDisplay from './WeiDisplay';
import { Document } from '../stores/DocumentStore';

export default class DocumentCell extends React.Component<{
  document: Document
}> {
  render() {
    return (
      <Cell>
        <CIDBadge cid={this.props.document.cid} />
        <WeiDisplay wei={this.props.document.weiValue} />
      </Cell>
    );
  }
}
