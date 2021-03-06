import { observable } from 'mobx';
import ABI from './WriteWeiABI';

export class Document {
  index: string|number;
  cid: string;
  author: string;
  timestamp: string|number;
  weiValue: string;

  constructor(options = {}) {
    Object.assign(this, options);
  }

}

export default class DocumentStore {
  private contract: any;
  @observable documents: Document[] = [];
  @observable documentCount: number = 0;

  constructor() {
    this.reloadContract();
  }

  reloadContract() {
    this.contract = new web3.eth.Contract(ABI, '0x08203e71f3b8b3eb32e766cae9a105462148c292');
    this.documents = [];
    this.loadDocuments(0, 10);
  }

  get address() {
    return this.contract.options.address;
  }

  async payDocument(from: string, index: number, etherValue: number) {
    const weiValue = web3.utils.toWei(`${etherValue}`);
    await this.contract.methods.payDocument(index).send({
      from,
      value: weiValue,
      gas: 300000
    });
  }

  async addDocument(from: string, cid: string) {
    await this.contract.methods.createDocument(cid).send({
      from,
      gas: 300000
    });
  }

  async loadDocuments(index: number, count: number): Promise<Document> {
    this.documentCount = +(await this.contract.methods.documentCount().call());
    if (this.documentCount === 0) {
      this.documents = [];
      return;
    }
    if (index >= this.documentCount) {
      throw new Error(`Invalid index supplied`);
    }
    const promises = [];
    for (let x = index; x < index + count; x++) {
      if (x >= this.documentCount) break;
      const promise = this.contract.methods.documents(x).call()
        .then((document: Document) => {
          document.index = x;
          return new Document(document);
        });
      promises.push(promise);
    }
    this.documents = [...(await Promise.all(promises)), ...this.documents]
      .sort((p1: Document, p2: Document) => {
        return +p2.index - +p1.index;
      })
      .reverse();
  }
}
