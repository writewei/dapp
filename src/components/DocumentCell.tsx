import React from 'react';
import Cell from './Cell';
import CIDBadge from './CIDBadge';
import WeiDisplay from './WeiDisplay';
import { Document } from '../stores/DocumentStore';
import styled from 'styled-components';

const HFlex = styled.div`
  display: flex;
  justify-content: space-between;
`;

const VFlex = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

export default class DocumentCell extends React.Component<{
  document: Document
}> {
  render() {
    return (
      <Cell>
        <HFlex>
          <VFlex>
            <CIDBadge cid={this.props.document.cid} />
          </VFlex>
          <VFlex>
            <WeiDisplay wei={this.props.document.weiValue} />
            <button onClick={() => {}}>Pay Author</button>
          </VFlex>
        </HFlex>
      </Cell>
    );
  }
}
