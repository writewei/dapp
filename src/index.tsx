import React from 'react';
import ReactDOM from 'react-dom';
import Home from './components/Home';
import { Provider } from 'mobx-react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import IPFS from 'ipfs';
import _cidhook from './stores/cidhook';

const stores = {
  node: new IPFS(),
  cidhook: new _cidhook()
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
      </>
    </Router>
  </Provider>,
  document.getElementById('app')
);
