import React from 'react';
import MDContainer from './MDContainer';
import styled from 'styled-components';
import { inject } from 'mobx-react';

const TextInput = styled.textarea`
  width: 100%;
  height: 200px;
  resize: vertical;
`;

@inject('node')
export default class Home extends React.Component<{
  node: any
}> {
  state = {
    content: `# Hi There

Write something to get started.`
  };

  contentChanged = (event: any) => {
    this.setState({
      content: event.target.value
    });
  };

  render() {
    return (
      <>
        <TextInput onChange={this.contentChanged} value={this.state.content} />
        <MDContainer content={this.state.content} />
      </>
    );
  }
}
