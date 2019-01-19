import React from 'react';
import { inject, observer } from 'mobx-react';
import DocumentStore, { Document } from '../stores/DocumentStore';

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
          return document.cid;
        })}
      </>
    );
  }
}
