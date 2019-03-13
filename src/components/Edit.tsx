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
import { BlockContainer } from './Shared';
import multihash from 'multihashes';

const TextInput = styled.textarea`
  width: 100%;
  height: 200px;
  resize: vertical;
`;

const Container = styled.div`
  display: flex;
  justify-content: space-between;
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
    content: '',
    cid: '',
    isPinning: false,
    isLoading: false
  };

  _input?: HTMLTextAreaElement;

  componentDidUpdate() {
    this._input && this._input.focus();
  }

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
    if (this.props.ipfs.isReady) {
      this.loadCid(pathCid);
    } else {
      this.props.ipfs.node.once('ready', () => this.loadCid(pathCid));
    }
  }

  loadCid(cid: string) {
    this.props.ipfs.node.get(cid, (err: any, files: any) => {
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
  }

  calculateCid = () => {
    this.props.ipfs.node.add(
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
    Promise.resolve()
      .then(() => {
        if (dryRun) {
          const data = new multihash.Buffer('0beec7b5ea3f0fdbc95d0dd47f3c5bc275da8a33');
          return multihash.encode(data);
        }
        return this.props.cidhook.add(this.state.content);
      })
      .then(({ cid }) => {
        this.setState({
          cid,
          isPinning: false
        });
      })
      .catch(err => {
        if (err) return alert(`Error: ${err}`);
      });
  };

  publishCid = (cid: string) => {
    this.props.documentStore.addDocument(this.props.ethereum.activeAddress, cid);
  };

  render() {
    if (this.state.isLoading) {
      return (
        <BlockContainer>
          {`Loading cid: ${this.state.cid}`}
          <Loader
            type={'Rings'}
            color={'#000'}
            height={50}
            width={50}
          />
        </BlockContainer>
      );
    }
    return (
      <>
        <BlockContainer>
          <TextInput ref={c => (this._input = c)} onChange={this.contentChanged} value={this.state.content} />
        </BlockContainer>
        <BlockContainer>
          <Container>
            <CIDBadge cid={this.state.cid} />
            <span>
              <button onClick={() => this.pinContent(false)}>pin</button>
              <button onClick={() => this.publishCid(this.state.cid)}>publish</button>
            </span>
          </Container>
        </BlockContainer>
        <BlockContainer>
          <MDContainer content={this.state.content} />
        </BlockContainer>
      </>
    );
  }
}

export default withRouter((props: any) => <Edit { ...props } />);
