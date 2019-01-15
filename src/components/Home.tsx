import React from 'react';
import MDContainer from './MDContainer';
import styled from 'styled-components';
import { inject } from 'mobx-react';
import cidbadge from 'cidbadge';

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

Write something to get started.`,
    cid: 'QmWiNA...8GsHf9'
  };

  contentChanged = (event: any) => {
    const content = event.target.value;
    // Add the content to the local ipfs node on every change
    // This can't stay in lol
    this.props.node.files.add(Buffer.from(content, 'utf8'), (err: any, data: any) => {
      if (err || !data.length) return;
      this.setState({
        cid: data[0].path
      });
    });
    this.setState({
      content
    });
  };

  render() {
    return (
      <>
        <span dangerouslySetInnerHTML={{ __html: cidbadge(this.state.cid)}} />
        <TextInput onChange={this.contentChanged} value={this.state.content} />
        <MDContainer content={this.state.content} />
      </>
    );
  }
}
