import React from 'react';
import { inject, observer } from 'mobx-react';
import DocumentStore, { Document } from '../stores/DocumentStore';
import { Redirect } from 'react-router-dom';
import DocumentCell from './DocumentCell';
import { Container } from './Shared';

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
          return <DocumentCell key={index} document={document} />;
        })}
        <Container>
          <button onClick={() => {
            this.setState({ toEdit: true });
          }}>Create a Document</button>
        </Container>
      </>
    );
  }
}
