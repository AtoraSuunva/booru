import Booru, { BooruClass, search, SiteMap } from '../src/index';
import Post from '../src/structures/Post';
import SearchResults from '../src/structures/SearchResults';

let tag1: string;
let site: string;

beforeEach(() => {
  site = 'yh';
  tag1 = 'glaceon';
});

describe.skip('Using instantiation method', () => {
  let danbooru: BooruClass;
  beforeEach(() => {
    danbooru = Booru(site);
  });

  it('should return an image', async () => {
    const searchResult: SearchResults = await danbooru.search([tag1]);
    const image: Post = searchResult[0];
    expect(searchResult.booru.domain).toBe('youhate.us');
    expect(searchResult.booru.site).toMatchObject(SiteMap[searchResult.booru.domain]);
    expect(typeof image.fileUrl).toBe('string');
  });
});

describe.skip('Using fancy pants method', () => {
  it('should return an image', async () => {
    const searchResult = await search(site, [tag1]);
    const image: Post = searchResult[0];
    expect(searchResult.booru.domain).toBe('youhate.us');
    expect(searchResult.booru.site).toMatchObject(SiteMap[searchResult.booru.domain]);
    expect(typeof image.fileUrl).toBe('string');
  });
});