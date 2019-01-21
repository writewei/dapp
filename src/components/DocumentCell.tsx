import React from 'react';
import Cell from './Cell';
import CIDBadge from './CIDBadge';
import WeiDisplay from './WeiDisplay';
import { Document } from '../stores/DocumentStore';
import styled from 'styled-components';
import { inject, observer } from 'mobx-react';
import DocumentStore from '../stores/DocumentStore';
import EthereumStore from '../stores/EthereumStore';

const HFlex = styled.div`
  display: flex;
  justify-content: space-between;
`;

const VFlex = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

@inject('ethereum', 'documentStore')
@observer
export default class DocumentCell extends React.Component<{
  document: Document,
  documentStore?: DocumentStore,
  ethereum?: EthereumStore
}> {
  render() {
    return (
      <Cell>
        <HFlex>
          <VFlex>
            <CIDBadge cid={this.props.document.cid} />
            Author:
            <a
              href={this.props.ethereum.etherscanUrl(this.props.document.author)}
              target="_blank"
            >
              {this.props.document.author}
            </a>
          </VFlex>
          <VFlex>
            <WeiDisplay wei={this.props.document.weiValue} />
            <button onClick={() => {
              // this.props.documentStore.
              this.props.documentStore.payDocument(
                this.props.ethereum.activeAddress,
                +this.props.document.index,
                0.5
              )
                .then(() => {
                  alert('Payment Completed')
                })
                .catch((err: any) => alert(err));
            }}>Pay Author</button>
          </VFlex>
        </HFlex>
      </Cell>
    );
  }
}
