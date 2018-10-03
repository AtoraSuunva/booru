//@ts-check
/*
- Constants
    => .sites
    => .BooruError
    => .userAgent
    => .searchURI(site, tags, limit)
*/
const Site = require('./structures/Site.js')
const sites = require('./sites.json')
const pkg = require('../package.json')

/**
 * Represents the api of a site
 * <p>Each property is a path on the site</p>
 * @typedef SiteApi
 * @property {String} search The path to search for posts
 * @property {String} postView The path to view a post by ID
 */

/**
 * @typedef Site
 * @property {String[]} aliases The aliases for that site
 * @property {Boolean} nsfw If this site has nsfw images
 * @property {Boolean|String} random If this site supports 'Order:random' or requires a custom way
 * @property {String?} tagQuery If the site requires a specific query for the tags (other than tags)
 * @property {SiteApi} api The {@link SiteApi} of this site
 */

 /**
  * A map of site url/{@link Site}
  * @type {Object.<String, Site>}
  */
module.exports.sites = sites

/**
 * Custom error type for when the boorus error or for user-side error, not my code (probably)
 * <br>The name of the error is 'BooruError'
 * @type {Error}
 */
class BooruError extends Error {
  constructor(...args) {
    super(...args)
    Error.captureStackTrace(this, BooruError)
    this.name = 'BooruError'
  }
}
module.exports.BooruError = BooruError

/**
 * The user-agent to use for searches
 * @private
 */
module.exports.userAgent = `booru/${pkg.version} (+https://github.com/AtlasTheBot/booru)`

/**
 * Create a full uri to search with
 *
 * @private
 * @param {*} domain The domain to search
 * @param {Site} site The site to search
 * @param {String[]} [tags=[]] The tags to search for
 * @param {Number} [limit=100] The limit for images to return
 * @param {Number} [page=0] The page to get
 */
module.exports.searchURI = (domain, site, tags = [], limit = 100, page = 0) =>
  `http${site.insecure ? '' : 's'}://${domain}${site.api.search}${(site.tagQuery) ? site.tagQuery : 'tags'}`
  + `=${expandTags(tags).join('+')}&limit=${limit}&${site.paginate || 'page'}=${page}`

// THANKS GELBOORU
const expandedTags = {
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
function expandTags(tags) {
  for (let i = 0; i < tags.length; i++) {
    const ex = expandedTags[tags[i].toLowerCase()]
    if (ex) {
      tags[i] = ex
    }
  }

  return tags
}
/**
 * The default options to use for requests
 * @private
 */
module.exports.defaultOptions = {
  headers: {
    'Accept': 'application/json, application/xml;q=0.9, */*;q=0.8',
    'User-Agent': module.exports.userAgent
  }
}
