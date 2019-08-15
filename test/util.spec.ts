import path from 'path';
import { BooruClass, BooruError, resolveSite, sites } from '../src';
import Site from '../src/structures/Site';

let site: string;

beforeEach(() => {
  site = 'db';
});

describe('Check resolveSite', () => {
  it('should resolve alias to host', () => {
    expect(resolveSite(site)).toBe('danbooru.donmai.us');
  });
});

describe('check BooruError', () => {
  it('should resolve to a BooruError', () => {
    const booruError = new BooruError();
    expect(booruError.name).toBe('BooruError');
    expect(booruError.stack).toContain(path.basename(__filename));
  });
});

describe('check BooruClass', () => {
  it('should resolve to a BooruClass', () => {
    const SiteData: Site = {
      aliases: ['sb', 'safe', 'safebooru'],
      api: {search: '/index.php?page=dapi&s=post&q=index&json=1&', postView: '/index.php?page=post&s=view&json=1&id='},
      domain: 'safebooru.org',
      nsfw: false,
      random: false,
      paginate: 'pid',
    };
    const booruClass = new BooruClass(SiteData);

    expect(booruClass.domain).toBe('safebooru.org');
    expect(booruClass.site).toMatchObject(SiteData);
  });
});

describe('check sites', () => {
  it('should support 17 sites', () => {
    const map = sites;
    expect(Object.keys(map)).toHaveLength(17);
  });
});