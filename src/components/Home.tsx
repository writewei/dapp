import React from 'react';
import MDContainer from './MDContainer';
import styled from 'styled-components';

const TextInput = styled.textarea`
  width: 100%;
  height: 200px;
  resize: vertical;
`;

export default class Home extends React.Component {
  state = {
    content: `# Hi There

Write something to get started.`
  };
  render() {
    return (
      <>
        <TextInput
          onChange={(event) => {
            this.setState({
              content: event.target.value
            });
          }} value={this.state.content}
        />
        <MDContainer content={this.state.content} />
      </>
    );
  }
}
