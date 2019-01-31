import { observable } from 'mobx';
import IPFS from 'ipfs';

export default class _IPFS {

  @observable isReady: boolean = false;
  node: any;

  constructor() {
    this.node = new IPFS({
      config: {
        Addresses: {
          Swarm: [
            // '/dns4/starsignal.writewei.io/tcp/443/p2p-webrtc-star'
          ]
        }
      }
    });
    this.node.on('ready', () => {
      this.isReady = true;
      // this.node.bootstrap.add('/dns4/ipfs.writewei.io/tcp/443/ipfs/QmcLccRcV915rV5cbfxzF263rNe45BSXfaPFQjGqn8LXAQ');
    });
    this.node.on('error', (err: any) => {
      console.log('IPFS node error:', err);
    });
  }
}
