require('./web3');
import React from 'react';
import ReactDOM from 'react-dom';
import Home from './components/Home';
import Edit from './components/Edit';
import { Provider } from 'mobx-react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import IPFS from 'ipfs';
import _cidhook from './stores/cidhook';
import EthereumStore from './stores/EthereumStore';
import DocumentStore from './stores/DocumentStore';
import styled from 'styled-components';
import Header from './components/Header';

const stores = {
  node: new IPFS({
    config: {
      Bootstrap: [
        // '/dns4/ipfs.writewei.io/tcp/443/ipfs/QmcETnG5Ug4RnV9tTmjLkg1YabvEVw1gwQwGinCoFZLMWk'
        // '/ip4/127.0.0.1/tcp/4003/ws/ipfs/QmSGen7cLwrzPww5DJXTERRAxHxn3Jjay6asyVaNhwnLjo'
      ]
    }
  }),
  cidhook: new _cidhook(),
  ethereum: new EthereumStore(),
  documentStore: new DocumentStore()
};

Object.assign(document.body.style, {
  margin: 'auto',
  'background-color': '#fff',
  'max-width': '900px',
  'font-family': 'Helvetica',
});

const Container = styled.div`
  margin: 8px;
`;

ReactDOM.render(
  <Provider { ...stores }>
    <Router>
      <Container>
        <>
          <Header />
          <Route path="/" component={Home} exact />
          <Route path="/edit" component={Edit} />
        </>
      </Container>
    </Router>
  </Provider>,
  document.getElementById('app')
);
