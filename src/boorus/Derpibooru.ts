/**
 * @packageDocumentation
 * @module Boorus
 */

import { BooruError } from '../Constants'
import type SearchParameters from '../structures/SearchParameters'
import type SearchResults from '../structures/SearchResults'
import Booru from './Booru'

/**
 * A class designed for Derpibooru
 * >:(
 * @private
 * @extends Booru
 * @inheritDoc
 */
export default class Derpibooru extends Booru {
  /** @inheritDoc */
  public override search(
    tags: string[] | string,
    { limit = 1, random = false, page = 0 }: SearchParameters = {},
  ): Promise<SearchResults> {
    const tagArray = this.normalizeTags(tags)

    // For any image, you must supply *
    if (tagArray[0] === undefined) {
      tagArray[0] = '*'
    }

    // Derpibooru offsets the pages by 1
    page += 1

    const uri =
      this.getSearchUrl({ tags: tagArray, limit, page }) +
      (random && this.site.random === 'string' ? `&${this.site.random}` : '') +
      (this.credentials ? `&key=${this.credentials.token}` : '')

    return super
      .doSearchRequest(tagArray, { limit, random, page, uri })
      .then((r) =>
        super.parseSearchResult(r, {
          fakeLimit: 0,
          tags: tagArray,
          limit,
          random,
          page,
        }),
      )
      .catch((e) => Promise.reject(new BooruError(e)))
  }
}
