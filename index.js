//@ts-check
// Declare the dependencies
const Constants = require('./src/Constants.js')
const { BooruError } = Constants
const Utils = require('./src/Utils.js')
const Booru = require('./src/boorus/Booru.js')
const Post = require('./src/structures/Post.js')
const SearchResults = require('./src/structures/SearchResults.js')

const BooruTypes = {
  'xml': require('./src/boorus/XmlBooru.js'),
  'derpi': require('./src/boorus/Derpibooru.js'),
}

/**
 * Create a new booru to search with
 * @private
 * @constructor
 * @param {String} site The {@link Site} (or alias of it) to create a booru from
 * @param {*} credentials The credentials to use on this booru
 * @return {Booru} A booru to use
 */
function _Booru(site, credentials = null) {
  const rSite = Utils.resolveSite(site)

  if (rSite === null) {
    throw new BooruError('Site not supported')
  }

  const booruSite = Constants.sites[rSite]

  // If special type, use that booru, else use default Booru
  return new (BooruTypes[booruSite.type] || Booru)(booruSite, credentials)
}

const booruCache = {}

/**
 * Searches a site for images with tags and returns the results
 * @param {String} site The site to search
 * @param {String[]} [tags=[]] Tags to search with
 * @param {Object} [searchOptions={}] The options for searching
 * @param {Number|String} [searchOptions.limit=1] The limit of images to return
 * @param {Boolean} [searchOptions.random=false] If it should grab randomly sorted results
 * @param {Object?} [searchOptions.credentials=null] Credentials to use to search the booru, if provided (Unused)
 * @return {Promise<SearchResults>} A promise with the images as an array of objects
 *
 * @example
 * const Booru = require('booru')
 * // Returns a promise with the latest cute glace pic from e926
 * Booru.search('e926', ['glaceon', 'cute'])
 */
function search(site, tags = [], {limit = 1, random = false, credentials = null} = {}) {
  const rSite = Utils.resolveSite(site)
  limit = parseInt(limit)

  if (rSite === null) {
    throw new BooruError('Site not supported')
  }

  if (!Array.isArray(tags) && typeof tags !== 'string') {
    throw new BooruError('`tags` should be an array or string')
  }

  if (typeof limit !== 'number' || Number.isNaN(limit)) {
    throw new BooruError('`limit` should be an int')
  }

  // Too lazy to remove validation (for now)

  const booruSite = Constants.sites[rSite]

  if (!booruCache[rSite]) {
    booruCache[rSite] = new (BooruTypes[booruSite.type] || Booru)(booruSite)
  }

  return booruCache[rSite].search(tags, {limit, random, credentials})
}

/**
 * Deprecated, now a noop
 * Just access <{@link BooruImage}>.common and it'll be auto-generated as you get it
 *
 * @deprecated Just use <{@link BooruImage}>.common instead
 * @param  {*} images Array of {@link BooruImage} objects
 * @return {*} Array of {@link BooruLink} objects
 */
function commonfy(images) {
  return Promise.resolve(images)
}

module.exports = _Booru

module.exports.search = search
module.exports.commonfy = commonfy // do nothing
module.exports.sites = Constants.sites // Sites in case you want to see what it supports
module.exports.resolveSite = Utils.resolveSite // might as well /shrug

// coding is fun :)
