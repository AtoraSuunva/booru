//@ts-check
// Declare the dependencies
const snekfetch = require('snekfetch')

const Constants = require('./src/Constants.js')
const { BooruError } = Constants
const Utils = require('./src/Utils.js')
const Booru = require('./src/boorus/Booru.js')

const BooruTypes = {
  'xml': require('./src/boorus/XmlBooru.js'),
  'derpi': require('./src/boorus/Derpibooru.js'),
}

/**
 * Create a new booru to search with
 * @constructor
 * @param {String} site The {@link Site} (or alias of it) to create a booru from
 * @param {*} credentials The credentials to use on this booru
 * @return {Booru} A booru to use
 *
 * @example
 * const Booru = require('booru')
 * // Aliases are supported
 * const e9 = new Booru('e9')
 *
 * // You can then search the site
 * const imgs = await e9.search(['cat', 'cute'], {limit: 3})
 *
 * // And use the images
 * imgs.forEach(i => console.log(i.common.file_url))
 *
 * // Or access other methods on the Booru
 * e9.postView(imgs[0].common.id)
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
 * @return {Promise<Post[]>} A promise with the images as an array of objects
 *
 * @example
 * const Booru = require('booru')
 * // Returns a promise with the latest cute glace pic from e926
 * Booru.search('e926', ['glaceon', 'cute'])
 */
function search(site, tags = [], {limit = 1, random = false} = {}) {
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

  return booruCache[rSite].search(tags, {limit, random})
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
