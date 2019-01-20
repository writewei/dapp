import React from 'react';
import { inject, observer } from 'mobx-react';
import DocumentStore, { Document } from '../stores/DocumentStore';
import CIDBadge from './CIDBadge';
import WeiDisplay from './WeiDisplay';
import Cell from './Cell';
import { Redirect } from 'react-router-dom';

@inject('ethereum', 'documentStore')
@observer
export default class Home extends React.Component<{
  documentStore?: DocumentStore
}> {
  state = {
    toEdit: false
  };
  render() {
    if (this.state.toEdit) {
      return <Redirect to='/edit' />
    }
    return (
      <>
        {this.props.documentStore.documents.map((document: Document, index: number) => {
          return (
            <Cell key={index}>
              <CIDBadge cid={document.cid} />
              <WeiDisplay wei={document.weiValue} />
            </Cell>
          );
        })}
        <button onClick={() => {
          this.setState({ toEdit: true });
        }}>Create a Document</button>
      </>
    );
  }
}
