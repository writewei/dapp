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

@inject('node')
export default class Home extends React.Component<{
  node: any
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
  }

  contentChanged = (event: any) => {
    const content = event.target.value;
    this.setState({ content }, this.calculateCid);
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
