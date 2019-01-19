import React from 'react';
import MDContainer from './MDContainer';
import styled from 'styled-components';
import { inject, observer } from 'mobx-react';
import _cidhook from '../stores/cidhook';
import EthereumStore from '../stores/EthereumStore';
import DocumentStore from '../stores/DocumentStore';
import CIDBadge from './CIDBadge';

const TextInput = styled.textarea`
  width: 100%;
  height: 200px;
  resize: vertical;
`;

const Container = styled.div`
  display: flex;
  justify-content: space-between;
`;

const DEFAULT_TEXT = `# Hi There

I bet you're thinking, what is this thing.

### This is a subsection

- this is a bullet point
- another level in


\`\`\`
() => console.log('hello world');
\`\`\`

![](https://media.mnn.com/assets/images/2018/07/cat_eating_fancy_ice_cream.jpg.838x0_q80.jpg)

A bit smaller

<img src="https://media.mnn.com/assets/images/2018/07/cat_eating_fancy_ice_cream.jpg.838x0_q80.jpg" width=300 />
`;

@inject('node', 'cidhook', 'documentStore', 'ethereum')
@observer
export default class Edit extends React.Component<{
  node: any,
  cidhook?: _cidhook,
  documentStore?: DocumentStore,
  ethereum?: EthereumStore
}> {
  state = {
    content: DEFAULT_TEXT,
    cid: ''
  };

  componentDidMount() {
    this.calculateCid();
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
  };

  contentChanged = (event: any) => {
    const content = event.target.value;
    this.setState({ content }, this.calculateCid);
  };

  pinContent = (dryRun: boolean = true) => {
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
        const cid = data[0].path;
        this.setState({ cid });
        this.props.cidhook.pin(cid);
        if (!dryRun) {
          console.log(`pinned ipfs cid: ${data[0].path}`);
        }
      }
    );
  };

  publishCid = (cid: string) => {
    this.props.documentStore.addDocument(this.props.ethereum.activeAddress, cid);
  };

  render() {
    return (
      <>
        <Container>
          <CIDBadge cid={this.state.cid} />
          <a href={`https://ipfs.io/ipfs/${this.state.cid}`}>{this.state.cid}</a>
          <div>
            <button onClick={() => this.pinContent(false)}>pin</button>
            <button onClick={() => this.publishCid(this.state.cid)}>publish</button>
          </div>
        </Container>
        <TextInput onChange={this.contentChanged} value={this.state.content} />
        <MDContainer content={this.state.content} />
      </>
    );
  }
}
