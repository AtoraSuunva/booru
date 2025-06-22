/**
 * @packageDocumentation
 * @module Index
 */

import { type AnySite, BooruError, sites } from './Constants'

import { deprecate } from 'node:util'
import { resolveSite } from './Utils'
import Booru, { type BooruCredentials } from './boorus/Booru'
import Derpibooru from './boorus/Derpibooru'
import XmlBooru from './boorus/XmlBooru'
import Post from './structures/Post'
import type SearchParameters from './structures/SearchParameters'
import SearchResults from './structures/SearchResults'
import Site from './structures/Site'
import type TagListParameters from './structures/TagListParameters'
import type TagListResults from './structures/TagListResults'

const BooruTypes: Record<string, typeof Booru> = {
  derpi: Derpibooru,
  xml: XmlBooru,
}

const booruCache: Partial<Record<AnySite, Booru>> = {}

/**
 * Create a new booru, if special type, use that booru, else use default Booru
 *
 * @param booruSite The site to use
 * @param credentials The credentials to use, if any
 * @return A new booru
 */
function booruFrom(booruSite: Site, credentials?: BooruCredentials): Booru {
  return new (
    booruSite.type !== undefined && BooruTypes[booruSite.type]
      ? BooruTypes[booruSite.type]
      : Booru
  )(booruSite, credentials)
}

/**
 * Create a new booru to search with
 *
 * @constructor
 * @param {String} site The {@link Site} domain (or alias of it) to create a booru from
 * @param {BooruCredentials} credentials The credentials to use on this booru
 * @return {Booru} A booru to use
 */
function booruForSite(site: string, credentials?: BooruCredentials): Booru {
  const rSite = resolveSite(site)

  if (!rSite) throw new BooruError('Site not supported')

  const booruSite = new Site(sites[rSite])

  // If special type, use that booru, else use default Booru
  return booruFrom(booruSite, credentials)
}

export { booruForSite as forSite }
export default booruForSite

export interface BooruSearch extends SearchParameters {
  credentials?: BooruCredentials
}

export interface BooruTagList extends TagListParameters {
  credentials?: BooruCredentials
}

/**
 * Searches a site for images with tags and returns the results
 * @param {String} site The site to search
 * @param {String[]|String} [tags=[]] Tags to search with
 * @param {SearchParameters} [searchOptions={}] The options for searching
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
export function search(
  site: string,
  tags: string[] | string = [],
  { limit = 1, random = false, page = 0, credentials = {} }: BooruSearch = {},
): Promise<SearchResults> {
  const rSite = resolveSite(site)

  if (typeof limit === 'string') {
    limit = Number.parseInt(limit, 10)
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
    booruCache[rSite] = booruFrom(booruSite, credentials)
  }

  // This is ugly and a hack, I know this
  booruCache[rSite].credentials = credentials
  return booruCache[rSite].search(tags, { limit, random, page })
}

/**
 * Get a list of tags from a site
 * @param {String} site The site to get the tags from
 * @param {TagListParameters} [options={}] The options for the tag list
 * @return {Promise<TagListResults>} A promise with the tags as an array of objects
 *
 * @example
 * ```
 * const Booru = require('booru')
 * // Returns a promise with the first 100 tags from e926
 * Booru.tagList('e926')
 * ```
 */
export function tagList(
  site: string,
  { limit = 1, page = 0, credentials = {} }: BooruTagList = {},
): Promise<TagListResults> {
  const rSite = resolveSite(site)

  if (rSite === null) {
    throw new BooruError('Site not supported')
  }

  const booruSite = new Site(sites[rSite])

  if (!booruCache[rSite]) {
    booruCache[rSite] = booruFrom(booruSite, credentials)
  }

  booruCache[rSite].credentials = credentials
  return booruCache[rSite].tagList({ limit, page })
}

const deprecatedCommonfy = deprecate(
  () => {},
  'Common is now deprecated, just access the properties directly',
)

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
export { BooruError, sites } from './Constants'
export { resolveSite } from './Utils'
export { Derpibooru, Post, SearchResults, Site, XmlBooru }
export type { BooruCredentials, SearchParameters }
