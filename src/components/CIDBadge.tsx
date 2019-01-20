import React from 'react';
import cidbadge from 'cidbadge';
import { Redirect } from 'react-router-dom';
import styled from 'styled-components';

const ClickableDiv = styled.div`
  cursor: pointer;
`;

export default class CIDBadgeContainer extends React.Component<{
  cid: string
}> {
  state = {
    isRedirecting: false,
    redirectPath: ''
  };
  componentDidUpdate() {
    if (this.state.isRedirecting) this.setState({ isRedirecting: false });
  }
  render() {
    if (this.state.isRedirecting) {
      return <Redirect to={this.state.redirectPath} />;
    }
    return (
      <ClickableDiv onClick={() => {
        this.setState({
          isRedirecting: true,
          redirectPath: `/edit/${this.props.cid}`
        });
      }}>
        <span dangerouslySetInnerHTML={{ __html: cidbadge(this.props.cid)}} />
      </ClickableDiv>
    );
  }
}
