import React from 'react';
import MDContainer from './MDContainer';
import styled from 'styled-components';
import { inject, observer } from 'mobx-react';
import _cidhook from '../stores/cidhook';
import EthereumStore from '../stores/EthereumStore';
import DocumentStore from '../stores/DocumentStore';
import CIDBadge from './CIDBadge';
import { withRouter } from 'react-router-dom';
import Loader from 'react-loader-spinner'
import Cell from './Cell';

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

### Write Documents

This is a platform for creating and saving markdown documents on IPFS, and publishing on the Ethereum network. The buttons above can be used to pin your work (save for later), or publish (list in the smart contract).

Pinning is free, publishing incurs the cost of interacting with the smart contract (< $0.50 usually).

Documents are hosted for free but must be < 500 KB (~512,000 characters).

### Markdown Documents

Support \`most\` _anything_ **that** **_you_** might need.

It can do
 - this
    - that
       - and
         - the other

[Links](google.com), images <img src="https://i.ytimg.com/vi/lFcSrYw-ARY/maxresdefault.jpg" width=500 />,

### The Platform

Allow users to pay Ether to written documents they find valuable. The author gets 100% of sent funds.

You can pay this document with this button: <button>Pay 0.01 Ether</button>
`;

@inject('ipfs', 'cidhook', 'documentStore', 'ethereum')
@observer
class Edit extends React.Component<{
  ipfs: any,
  cidhook?: _cidhook,
  documentStore?: DocumentStore,
  ethereum?: EthereumStore,
  location: {
    pathname: string
  }
}> {
  state = {
    content: DEFAULT_TEXT,
    cid: '',
    isPinning: false,
    isLoading: false
  };

  componentDidMount() {
    const { pathname } = this.props.location;
    // Example pathname: /edit/cid
    const parts = pathname.split('/').filter(_ => _);
    if (!parts.length || parts.shift() !== 'edit') return;
    if (!parts.length) {
      // No CID is specified in path
      this.calculateCid();
      return;
    }
    const pathCid = parts[0];
    this.setState({ content: '', cid: pathCid, isLoading: true });
    setTimeout(() => {
      this.props.ipfs.node.files.get(pathCid, (err: any, files: any) => {
        if (err) {
          console.log('Error loading path cid', err);
          this.setState({ isLoading: false });
          return;
        }
        this.setState({
          content: files[0].content.toString('utf8'),
          isLoading: false
        });
      });
    }, 1000);
  }

  calculateCid = () => {
    this.props.ipfs.node.files.add(
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
    this.props.ipfs.node.files.add(
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
        this.setState({
          cid,
          isPinning: true
        });
        this.props.cidhook.pin(cid)
          .then(() => console.log(`cidhooked: ${data[0].path}`))
          .catch((err: any) => console.log('Error pinning', err))
          .then(() => this.setState({ isPinning: false }));
      }
    );
  };

  publishCid = (cid: string) => {
    this.props.documentStore.addDocument(this.props.ethereum.activeAddress, cid);
  };

  render() {
    if (this.state.isLoading) {
      return (
        <Cell>
          {`Loading cid: ${this.state.cid}`}
          <Loader
            type={'Rings'}
            color={'#000'}
            height={50}
            width={50}
          />
        </Cell>
      );
    }
    return (
      <>
        <Cell>
          <TextInput onChange={this.contentChanged} value={this.state.content} />
        </Cell>
        <Cell>
          <Container>
            <CIDBadge cid={this.state.cid} />
            <span>
              <button onClick={() => this.pinContent(false)}>pin</button>
              <button onClick={() => this.publishCid(this.state.cid)}>publish</button>
            </span>
          </Container>
        </Cell>
        <Cell>
          <MDContainer content={this.state.content} />
        </Cell>
      </>
    );
  }
}

export default withRouter((props: any) => <Edit { ...props } />);
