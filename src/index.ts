/**
 * @packageDocumentation
 * @module Index
 */

import { BooruError, SMap, sites } from './Constants'

import Booru from './boorus/Booru'
import Derpibooru from './boorus/Derpibooru'
import Post from './structures/Post'
import SearchParameters from './structures/SearchParameters'
import SearchResults from './structures/SearchResults'
import Site from './structures/Site'
import XmlBooru from './boorus/XmlBooru'
import { deprecate } from 'util'
import { resolveSite } from './Utils'

const BooruTypes: any = {
  derpi: Derpibooru,
  xml: XmlBooru,
}

const booruCache: SMap<Booru> = {}

/**
 * Create a new booru, if special type, use that booru, else use default Booru
 *
 * @param {SiteInfo} booruSite The site to use
 * @param {*} credentials The credentials to use, if any
 * @return {Booru} A new booru
 */
function booruFrom(booruSite: Site, credentials?: any): Booru {
  return new (booruSite.type !== undefined && BooruTypes[booruSite.type]
    ? BooruTypes[booruSite.type]
    : Booru)(booruSite, credentials)
}

/**
 * Create a new booru to search with
 *
 * @constructor
 * @param {String} site The {@link Site} domain (or alias of it) to create a booru from
 * @param {*} credentials The credentials to use on this booru
 * @return {Booru} A booru to use
 */
function booruForSite(site: string, credentials: any = null): Booru {
  const rSite = resolveSite(site)

  if (!rSite) throw new BooruError('Site not supported')

  const booruSite = new Site(sites[rSite])

  // If special type, use that booru, else use default Booru
  return booruFrom(booruSite, credentials)
}

export { booruForSite as forSite }

/**
 * Searches a site for images with tags and returns the results
 * @param {String} site The site to search
 * @param {String[]|String} [tags=[]] Tags to search with
 * @param {Object} [searchOptions={}] The options for searching
 * @param {Number|String} [searchOptions.limit=1] The limit of images to return
 * @param {Boolean} [searchOptions.random=false] If it should grab randomly sorted results
 * @param {Object?} [searchOptions.credentials=null] Credentials to use to search the booru,
 *  if provided (Unused)
 * @return {Promise<SearchResults>} A promise with the images as an array of objects
 *
 * @example
 * ```
 * const Booru = require('booru')
 * // Returns a promise with the latest cute glace pic from e926
 * Booru.search('e926', ['glaceon', 'cute'])
 * ```
 */
export function search(site: string, tags: string[] | string = [],
                       {limit = 1, random = false, page = 0, credentials = null}
                        : SearchParameters = {}): Promise<SearchResults> {

  const rSite: string | null = resolveSite(site)

  if (typeof limit === 'string') {
    limit = parseInt(limit, 10)
  }

  if (rSite === null) {
    throw new BooruError('Site not supported')
  }

  if (!Array.isArray(tags) && typeof tags !== 'string') {
    throw new BooruError('`tags` should be an array or string')
  }

  if (typeof limit !== 'number' || Number.isNaN(limit)) {
    throw new BooruError('`limit` should be an int')
  }

  const booruSite = new Site(sites[rSite])

  if (!booruCache[rSite]) {
    booruCache[rSite] = booruFrom(booruSite)
  }

  return booruCache[rSite].search(tags, {limit, random, page, credentials})
}

// tslint:disable-next-line:no-empty
const deprecatedCommonfy = deprecate(() => { },
 'Common is now deprecated, just access the properties directly')

/**
 * Deprecated, now a noop
 * <p>This will be removed *soon* please stop using it</p>
 * <p>Just access <code>&lt;{@link Post}&gt;.prop</code>, no need to commonfy anymore
 *
 * @deprecated Just use <code>&lt;{@link Post}&gt;.prop</code> instead
 * @param  {Post[]} images   Array of {@link Post} objects
 * @return {Promise<Post[]>} Array of {@link Post} objects
 */
export function commonfy(images: Post[]): Promise<Post[]> {
  deprecatedCommonfy()
  return Promise.resolve(images)
}

export { Booru as BooruClass } from './boorus/Booru'
export { sites } from './Constants'
export { resolveSite } from './Utils'
export { BooruError } from './Constants'
