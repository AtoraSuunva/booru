/**
 * @packageDocumentation
 * @module Constants
 */

import { RequestInit } from 'undici'
import siteJson from './sites.json'
import Site from './structures/Site'
import SiteInfo from './structures/SiteInfo'

export interface SMap<V> {
  [key: string]: V
}

type gelTags = {
  'rating:e': 'rating:explicit'
  'rating:q': 'rating:questionable'
  'rating:s': 'rating:safe'

  [key: string]: string
}

const expandedTags: gelTags = {
  'rating:e': 'rating:explicit',
  'rating:q': 'rating:questionable',
  'rating:s': 'rating:safe',
}

/**
 * A map of site url/{@link SiteInfo}
 */
export const sites = siteJson as unknown as SMap<SiteInfo>

/**
 * Custom error type for when the boorus error or for user-side error, not my code (probably)
 * <p>The name of the error is 'BooruError'
 * @type {Error}
 */
export class BooruError extends Error {
  constructor(message: string | Error) {
    super(message instanceof Error ? message.message : message)

    if (message instanceof Error) {
      this.stack = message.stack
    } else {
      Error.captureStackTrace(this, BooruError)
    }

    this.name = 'BooruError'
  }
}

/**
 * The user-agent to use for searches
 * @private
 */
export const USER_AGENT = `booru (https://github.com/AtoraSuunva/booru)`

/**
 * Expands tags based on a simple map, used for gelbooru/safebooru/etc compat :(
 *
 * @private
 * @param {String[]} tags The tags to expand
 */
function expandTags(tags: string[]): string[] {
  return tags.map((v) => {
    const ex = expandedTags[v.toLowerCase()]
    return encodeURIComponent(ex ? ex : v)
  })
}

/**
 * Create a full uri to search with
 *
 * @private
 * @param {string} domain The domain to search
 * @param {Site} site The site to search
 * @param {string[]} [tags=[]] The tags to search for
 * @param {number} [limit=100] The limit for images to return
 * @param {number} [page=0] The page to get
 */
export function searchURI(
  site: Site,
  tags: string[] = [],
  limit = 100,
  page: number,
): string {
  return (
    `http${site.insecure ? '' : 's'}://` +
    `${site.domain}${site.api.search}` +
    `${site.tagQuery}=${expandTags(tags).join(site.tagJoin)}` +
    `&limit=${limit}` +
    `&${site.paginate}=${page}`
  )
}

/**
 * The default options to use for requests
 * <p>I could document this better but meh
 *
 * @private
 */
export const defaultOptions: RequestInit = {
  headers: {
    Accept: 'application/json, application/xml;q=0.9, */*;q=0.8',
    'User-Agent': USER_AGENT,
  },
}
