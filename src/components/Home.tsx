import React from 'react';
import { inject, observer } from 'mobx-react';
import DocumentStore, { Document } from '../stores/DocumentStore';
import CIDBadge from './CIDBadge';
import WeiDisplay from './WeiDisplay';
import Edit from './Edit';
import Cell from './Cell';

@inject('ethereum', 'documentStore')
@observer
export default class Home extends React.Component<{
  documentStore?: DocumentStore
}> {
  state = {};
  render() {
    return (
      <>
        {this.props.documentStore.documents.map((document: Document) => {
          console.log('test', document);
          return (
            <Cell key={document.cid}>
              <CIDBadge cid={document.cid} />
              <WeiDisplay wei={document.weiValue} />
            </Cell>
          );
        })}
        <Edit />
      </>
    );
  }
}
