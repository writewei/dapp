import React from 'react';
import { inject, observer } from 'mobx-react';
import DocumentStore, { Document } from '../stores/DocumentStore';
import styled from 'styled-components';
import CIDBadge from './CIDBadge';
import WeiDisplay from './WeiDisplay';

const DocumentPreview = styled.div`
  margin: 8px;
  box-shadow: rgba(0, 0, 0, 0.1) 0px 0px 8px;
`;

@inject('ethereum', 'documentStore')
@observer
export default class Home extends React.Component<{
  documentStore?: DocumentStore
}> {
  state = {};
  render() {
    return (
      <>
        <h1>
          writewei
        </h1>
        {this.props.documentStore.documents.map((document: Document) => {
          console.log('test', document);
          return (
            <DocumentPreview key={document.cid}>
              <CIDBadge cid={document.cid} />
              <WeiDisplay wei={document.weiValue} />
            </DocumentPreview>
          );
        })}
      </>
    );
  }
}
