import { observable } from 'mobx';
import ABI from './WriteWeiABI';

export interface Document {
  index: string|number;
  cid: string;
  author: string;
  timestamp: string|number;
  updatedTimestamp: string|number;
  weiValue: string;
}

export default class DocumentStore {
  private contract: any;
  @observable documents: Document[] = [];
  @observable documentCount: number = 0;

  constructor() {
    this.reloadContract();
  }

  reloadContract() {
    this.contract = new web3.eth.Contract(ABI, '0xfc2ea6a4ad73ce9af7fb4ebff3cc063e0a48f2dc');
    this.documents = [];
    this.loadDocuments(0, 10);
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
          return document;
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