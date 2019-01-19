import React from 'react';
import cidbadge from 'cidbadge';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  justify-content: space-between;
`;

export default class ButtonHeader extends React.Component<{
  cid: string
}> {
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
