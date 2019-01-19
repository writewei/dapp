require('./web3');
import React from 'react';
import ReactDOM from 'react-dom';
import Home from './components/Home';
import Edit from './components/Edit';
import { Provider } from 'mobx-react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import IPFS from 'ipfs';
import _cidhook from './stores/cidhook';
import EthereumStore from './stores/ethereum';

const stores = {
  node: new IPFS({
    config: {
      Bootstrap: [
        // '/dns4/ipfs.writewei.io/tcp/443/ipfs/QmcETnG5Ug4RnV9tTmjLkg1YabvEVw1gwQwGinCoFZLMWk'
      ]
    }
  }),
  cidhook: new _cidhook(),
  ethereum: new EthereumStore()
};

Object.assign(document.body.style, {
  margin: 'auto',
  'background-color': '#fff',
  'max-width': '900px',
  'font-family': 'Helvetica',
});

ReactDOM.render(
  <Provider { ...stores }>
    <Router>
      <>
        <Route path="/" component={Home} />
        <Route path="/edit" component={Edit} />
      </>
    </Router>
  </Provider>,
  document.getElementById('app')
);
