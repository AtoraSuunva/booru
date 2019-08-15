import Booru, { BooruClass, search, sites } from '../src/index';
import Post from '../src/structures/Post';
import SearchResults from '../src/structures/SearchResults';

let tag1: string;
let site: string;

beforeEach(() => {
  site = 'pa';
  tag1 = 'glaceon';
});

describe('Using instantiation method', () => {
  let danbooru: BooruClass;
  beforeEach(() => {
    danbooru = Booru(site);
  });

  it('should return an image', async () => {
    const searchResult: SearchResults = await danbooru.search([tag1]);
    const image: Post = searchResult[0];
    expect(searchResult.booru.domain).toBe('rule34.paheal.net');
    expect(searchResult.booru.site).toMatchObject(sites[searchResult.booru.domain]);
    expect(typeof image.fileUrl).toBe('string');
  });
});

describe('Using fancy pants method', () => {
  it('should return an image', async () => {
    const searchResult = await search(site, [tag1]);
    const image: Post = searchResult[0];
    expect(searchResult.booru.domain).toBe('rule34.paheal.net');
    expect(searchResult.booru.site).toMatchObject(sites[searchResult.booru.domain]);
    expect(typeof image.fileUrl).toBe('string');
  });
});