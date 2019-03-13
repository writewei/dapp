import cidhook from 'cidhook';

export default class _cidhook {
  public url: string = 'https://cidhookd.writewei.io';

  async add(content: string) {
    const data = Buffer.from(content);
    return await cidhook.add(this.url, data);
  }

  async unpin(cid: string) {
    return await cidhook.unpin(this.url, cid);
  }
}
