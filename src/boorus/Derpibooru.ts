/**
 * @packageDocumentation
 * @module Boorus
 */

import { BooruError } from '../Constants'
import SearchParameters from '../structures/SearchParameters'
import SearchResults from '../structures/SearchResults'
import Site from '../structures/Site'
import Booru, { BooruCredentials } from './Booru'

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
   * @param site The site to use
   * @param credentials Credentials for the API (Currently not used)
   */
  constructor(site: Site, credentials?: BooruCredentials) {
    super(site, credentials)
  }

  /** @inheritDoc */
  public override search(
    tags: string[] | string,
    { limit = 1, random = false, page = 0 }: SearchParameters = {},
  ): Promise<SearchResults> {
    if (!Array.isArray(tags)) {
      tags = [tags]
    }

    // For any image, you must supply *
    if (tags[0] === undefined) {
      tags[0] = '*'
    }

    // Derpibooru offsets the pages by 1
    page += 1

    const uri =
      this.getSearchUrl({ tags, limit, page }) +
      (random && this.site.random === 'string' ? `&${this.site.random}` : '') +
      (this.credentials ? `&key=${this.credentials.token}` : '')

    return super
      .doSearchRequest(tags, { limit, random, page, uri })
      .then((r) =>
        super.parseSearchResult(r, { fakeLimit: 0, tags, limit, random, page }),
      )
      .catch((e) => Promise.reject(new BooruError(e)))
  }
}
