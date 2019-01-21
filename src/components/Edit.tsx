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
    setTimeout(() => {
      this.props.ipfs.node.get(pathCid, (err: any, files: any) => {
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
    }, 5000);
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
    this.props.ipfs.node.add(
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
        console.log('Sending pin request for ', cid);
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
          <TextInput ref={c => (this._input = c)} onChange={this.contentChanged} value={this.state.content} />
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
