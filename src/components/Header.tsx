import React from 'react';
import { inject, observer } from 'mobx-react';
import Cell from './Cell';
import styled from 'styled-components';
import DocumentStore from '../stores/DocumentStore';
import EthereumStore from '../stores/EthereumStore';
import { Redirect } from 'react-router-dom';
import ClickableDiv from './ClickableDiv';

const Title = styled.div`
  font-size: 32px;
  font-weight: bold;
`;

const ContractText = styled.div`
  font-size: 12px;
`;

const HFlex = styled.div`
  display: flex;
  justify-content: space-between;
`;

const Flex = styled.div`
  display: flex;
`;

const Circle = styled.div`
  background: ${(props: { on: boolean }) => props.on ? 'green' : 'red'};
  width: 14px;
  height: 14px;
  border-radius: 50%;
  margin-right: 4px;
`;

@inject('ethereum', 'documentStore', 'ipfs')
@observer
export default class Header extends React.Component<{
  documentStore?: DocumentStore,
  ethereum?: EthereumStore,
  ipfs?: any
}> {
  state = {
    toHome: false
  };
  componentDidUpdate() {
    if (this.state.toHome) this.setState({ toHome: false });
  }
  render() {
    if (this.state.toHome) {
      return <Redirect to='/' />;
    }
    return (
      <Cell>
        <HFlex>
          <ClickableDiv onClick={() => {
            this.setState({ toHome: true });
          }}>
            <Title>writewei</Title>
            <span>A content sharing platform</span>
          </ClickableDiv>
          <ContractText>
            <Flex>
              {'Active Contract: '}
              <a href={this.props.ethereum.etherscanUrl(this.props.documentStore.address)} target="_blank">
                {this.props.documentStore.address}
              </a>
            </Flex>
            <Flex>
              <Circle on={this.props.ipfs.isReady} />
              {this.props.ipfs.isReady ? 'IPFS node running' : 'IPFS node starting'}
            </Flex>
          </ContractText>
        </HFlex>
      </Cell>
    );
  }
}
