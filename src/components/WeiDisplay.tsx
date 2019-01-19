import React from 'react';
import BN from 'bn.js';
import web3 from 'web3';

export default class WeiDisplay extends React.Component <{
  wei: BN | number | string,
  gdaxStore?: any
}> {

  static ethPrice = 0;

  static async loadEthPrice() {
    const response = await fetch('https://api.coinbase.com/v2/exchange-rates');
    const json = await response.json();
    const ETH_USD_RATE = json.data.rates.ETH;
    const USD_ETH_RATE = Math.round(1e2 / ETH_USD_RATE) / 1e2;
    this.ethPrice = USD_ETH_RATE;
  }

  render() {
    const etherValue = +web3.utils.fromWei(this.props.wei.toString());
    const roundedEtherValue = Math.round(etherValue * 1e5) / 1e5;
    const usdValue = Math.round(1e2 * roundedEtherValue * WeiDisplay.ethPrice) / 1e2;
    return (
      <>
        {`${roundedEtherValue.toString()} ether ~= $${usdValue}`}
      </>
    );
  }
}

setTimeout(async () => {
  try {
    await WeiDisplay.loadEthPrice();
  } catch (err) {
    console.log('Error loading WeiDisplay eth price', err);
  }
}, 30000);
