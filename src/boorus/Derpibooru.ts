import Booru from './Booru'
import { BooruError } from '../Constants'
import * as Constants from '../Constants'
import Site from '../structures/Site'
import SearchParameters from '../structures/SearchParameters';
import SearchResults from '../structures/SearchResults';

/**
 * A class designed for Derpibooru
 * >:(
 * @private
 * @extends Booru
 * @inheritDoc
 */
export default class Derpibooru extends Booru {
  /**
   * Create a new booru for Derpibooru from a site
   * @param {Site} site The site to use
   * @param {Object?} credentials Credentials for the API (Currently not used)
   */
  constructor(site: Site, credentials?: any) {
    super(site, credentials)
  }

  /** @inheritDoc */
  search(tags: string[]|string, { limit = 1, random = false, page = 0 }: SearchParameters = {}):
    Promise<SearchResults> {
    if (!Array.isArray(tags)) {
      tags = [tags]
    }

    // For any image, you must supply *
    if (tags[0] === undefined) {
      tags[0] = '*'
    }

    const uri = Constants.searchURI(this.site, tags, limit)
              + (random ? `&${this.site.random}` : '')
              + (this.credentials ? '&key=' + this.credentials : '')

    return super._doSearchRequest(tags, {limit, random, page, uri})
      .then(r => super._parseSearchResult(r.search, { fakeLimit: 0, tags, limit, random, page }))
      .catch(e => Promise.reject(new BooruError(e)))
  }
}
