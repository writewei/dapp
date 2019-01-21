import { observable } from 'mobx';
import IPFS from 'ipfs';

export default class _IPFS {

  @observable isReady: boolean = false;
  node: any;

  constructor() {
    this.node = new IPFS({
      config: {
        Bootstrap: [
          // '/dns4/ipfs.writewei.io/tcp/443/ipfs/QmcETnG5Ug4RnV9tTmjLkg1YabvEVw1gwQwGinCoFZLMWk'
          // '/ip4/127.0.0.1/tcp/4003/ws/ipfs/QmSGen7cLwrzPww5DJXTERRAxHxn3Jjay6asyVaNhwnLjo'
        ]
      }
    });
    this.node.on('ready', () => {
      this.isReady = true;
    });
    this.node.on('error', (err: any) => {
      console.log('IPFS node error:', err);
    });
  }
}
