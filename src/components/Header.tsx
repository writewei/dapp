import React from 'react';
import { inject, observer } from 'mobx-react';
import Cell from './Cell';
import styled from 'styled-components';
import DocumentStore from '../stores/DocumentStore';
import EthereumStore from '../stores/EthereumStore';

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

@inject('ethereum', 'documentStore')
@observer
export default class Header extends React.Component<{
  documentStore?: DocumentStore,
  ethereum?: EthereumStore
}> {
  render() {
    return (
      <Cell>
        <HFlex>
          <div>
            <Title>writewei</Title>
            <span>A decentralized writing platform</span>
          </div>
          <ContractText>
            {'Active Contract: '}
            <a href={this.props.ethereum.etherscanUrl(this.props.documentStore.address)} target="_blank">
              {this.props.documentStore.address}
            </a>
          </ContractText>
        </HFlex>
      </Cell>
    );
  }
}
