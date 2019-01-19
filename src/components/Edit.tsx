import React from 'react';
import MDContainer from './MDContainer';
import styled from 'styled-components';
import { inject, observer } from 'mobx-react';
import _cidhook from '../stores/cidhook';
import EthereumStore from '../stores/EthereumStore';
import DocumentStore from '../stores/DocumentStore';
import CIDBadge from './CIDBadge';
import { withRouter } from 'react-router-dom';
import { DocumentPreview } from './Home';

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
class Edit extends React.Component<{
  node: any,
  cidhook?: _cidhook,
  documentStore?: DocumentStore,
  ethereum?: EthereumStore,
  location: {
    pathname: string
  }
}> {
  state = {
    content: DEFAULT_TEXT,
    cid: ''
  };

  componentDidMount() {
    this.calculateCid();

    const { pathname } = this.props.location;
    // Example pathname: /edit/cid
    const parts = pathname.split('/').filter(_ => _);
    if (!parts.length || parts.shift() !== 'edit') return;
    if (!parts.length) return;
    const pathCid = parts[0];
    setTimeout(() => {
      this.props.node.files.get(pathCid, (err: any, file: any) => {
        console.log(err, file);
      });
    }, 1000);
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
        this.props.cidhook.pin(cid)
          .then(() => console.log(`cidhooked: ${data[0].path}`));
      }
    );
  };

  publishCid = (cid: string) => {
    this.props.documentStore.addDocument(this.props.ethereum.activeAddress, cid);
  };

  render() {
    return (
      <>
        <DocumentPreview>
          <TextInput onChange={this.contentChanged} value={this.state.content} />
        </DocumentPreview>
        <DocumentPreview>
          <Container>
            <CIDBadge cid={this.state.cid} />
            <div>
              <button onClick={() => this.pinContent(false)}>pin</button>
              <button onClick={() => this.publishCid(this.state.cid)}>publish</button>
            </div>
            </Container>
          </DocumentPreview>
        <DocumentPreview>
          <MDContainer content={this.state.content} />
        </DocumentPreview>
      </>
    );
  }
}

export default withRouter((props: any) => <Edit { ...props } />);
