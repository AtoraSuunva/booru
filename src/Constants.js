//@ts-check

/**
 * @module Constants Constants
 * @namespace Constants
 */

/*
- Constants
    => .sites
    => .BooruError
    => .userAgent
    => .searchURI(site, tags, limit)
*/
const sites = require('./sites.json')
const package = require('../package.json')

/**
 * Represents the api of a site
 * Each property is a path on the site
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
  * @type {Object.<String, Site>} A map of site url/{@link Site}
  */
module.exports.sites = sites

/**
 * Custom error type for when the boorus error or for user-side error, not my code (probably)
 * @type {Error}
 * @param {String?} message The error message to use
 */
function BooruError(message) {
  this.name = 'BooruError'
  this.message = message || 'Error messsage unspecified.'
  this.stack = (new Error()).stack
}
BooruError.prototype = Object.create(Error.prototype)
BooruError.prototype.constructor = BooruError

module.exports.BooruError = BooruError

/**
 * The user-agent to use for searches
 */
module.exports.userAgent = `Booru v${package.version}, a node package for booru searching (by AtlasTheBot)`

/**
 * Create a full uri to search with
 *
 * @param {String} site The site to search
 * @param {String[]} [tags=[]] The tags to search for
 * @param {Number} [limit=100] The limit for images to return
 */
module.exports.searchURI = (site, tags = [], limit = 100) =>
  `http://${site}${sites[site].api}${(sites[site].tagQuery) ? sites[site].tagQuery : 'tags'}`
  + `=${tags.join('+')}&limit=${limit}`
