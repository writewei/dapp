require('./web3');
import React from 'react';
import ReactDOM from 'react-dom';
import Home from './components/Home';
import Edit from './components/Edit';
import { Provider } from 'mobx-react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import _cidhook from './stores/cidhook';
import EthereumStore from './stores/EthereumStore';
import DocumentStore from './stores/DocumentStore';
import IPFSStore from './stores/IPFSStore';
import Header from './components/Header';
import Footer from './components/Footer';
import { Container } from './components/Shared';

const stores = {
  ipfs: new IPFSStore(),
  cidhook: new _cidhook(),
  ethereum: new EthereumStore(),
  documentStore: new DocumentStore()
};

Object.assign(document.body.style, {
  margin: 'auto',
  // 'background-color': 'hsl(220, 13%, 18%)',
  'max-width': '900px',
  'font-family': 'Helvetica',
});

ReactDOM.render(
  <Provider { ...stores }>
    <Router>
      <Container>
        <>
          <Header />
          <Route path="/" component={Home} exact />
          <Route path="/edit" component={Edit} />
          <Footer />
        </>
      </Container>
    </Router>
  </Provider>,
  document.getElementById('app')
);
