import React from 'react';
import cidbadge from 'cidbadge';
import styled from 'styled-components';
import { inject } from 'mobx-react';

const Container = styled.div`
  display: flex;
  justify-content: space-between;
`;

@inject('node', 'cidhook')
export default class ButtonHeader extends React.Component<{
  content: string,
  node?: any
}> {
  state = {
    cid: ''
  };

  postArticle = (dryRun: boolean) => {

    this.props.node.files.add(
      Buffer.from(this.state.content, 'utf8'),
      {
        onlyHash: dryRun
      },
      (err: any, data: any) => {
        if (err) {
          return alert(`Error: ${err}`);
        } else if (!data.length) {
          return alert(`Error: 0 length data received.`);
        }

        this.setState({
          cid: data[0].path
        });
      }
    );
  }

  calculateCid = () => {
    this.props.node.files.add(
      Buffer.from(this.state.content, 'utf8'),
      {
        onlyHash: true
      },
      (err: any, data: any) => {
        if (err || !data.length) return;
        this.setState({
          cid: data[0].path
        });
      }
    );
  }
  render() {
    return (
      <Container>
        <span dangerouslySetInnerHTML={{ __html: cidbadge(this.props.cid)}} />
        <button onClick={() => {

        }}>Post</button>
      </Container>
    );
  }
}
