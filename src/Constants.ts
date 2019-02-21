import Site from './structures/Site'
import SiteInfo from './structures/SiteInfo'
// So TypeScript includes my json in the output dir >:(
// There is most likely a better way to do this but I mostly want it to be over :(
import sitesButTSPleaseIncludeInOutput from './sites.json'
const sites: SMap<SiteInfo> = require('./sites.json')
const pkg = require('../package.json')

// So TypeScript is happy :)
export interface SMap<V> {
  [key: string]: V
}

export interface NMap<V> {
  [key: number]: V
}

/**
* A map of site url/{@link SiteInfo}
*/
export { sites }

/**
 * Custom error type for when the boorus error or for user-side error, not my code (probably)
 * <p>The name of the error is 'BooruError'
 * @type {Error}
 */
export class BooruError extends Error {
  constructor(...args: any) {
    super(...(args[0] instanceof Error ? [args[0].message] : args))

    if (args[0] instanceof Error) {
      this.stack = args[0].stack
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
export const userAgent: string = `booru@${pkg.version} (https://github.com/AtlasTheBot/booru)`

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
export function searchURI(site: Site, tags: string[] = [], limit: number = 100, page: number = 0): string {
  return `http${site.insecure ? '' : 's'}://${site.domain}${site.api.search}`
  + (site.tagQuery ? site.tagQuery : 'tags')
  + `=${expandTags(tags).join('+')}&limit=${limit}&${site.paginate}=${page}`
}

// thanks, gelbooru
const expandedTags: SMap<string> = {
  'rating:s': 'rating:safe',
  'rating:q': 'rating:questionable',
  'rating:e': 'rating:explicit',
}

/**
 * Expands tags based on a simple map, used for gelbooru/safebooru/etc compat :(
 *
 * @private
 * @param {String[]} tags The tags to expand
 */
function expandTags(tags: string[]): string[] {
  for (let i = 0; i < tags.length; i++) {
    const ex: string = expandedTags[tags[i].toLowerCase()]
    if (ex) {
      tags[i] = ex
    }
  }

  return tags
}

/**
 * The default options to use for requests
 * <p>I could document this better but meh
 *
 * @private
 */
export const defaultOptions: any = {
  headers: {
    'Accept': 'application/json, application/xml;q=0.9, */*;q=0.8',
    'User-Agent': module.exports.userAgent
  }
}
