import cidhook from 'cidhook';

export default class _cidhook {
  public url: string = 'http://localhost:3000';

  async pin(cid: string) {
    return await cidhook.pin(this.url, cid);
  }

  async unpin(cid: string) {
    return await cidhook.unpin(this.url, cid);
  }
}
