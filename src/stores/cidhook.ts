import cidhook from 'cidhook';

export default class _cidhook {
  public url: string = 'https://cidhookd.writewei.io';

  async pin(cid: string) {
    return await cidhook.pin(this.url, cid);
  }

  async unpin(cid: string) {
    return await cidhook.unpin(this.url, cid);
  }
}
