//@ts-check
// Declare the dependencies
const snekfetch = require('snekfetch')

const Constants = require('./src/Constants.js')
const {BooruError} = Constants
const Utils = require('./src/Utils.js')
const Booru = require('./src/boorus/Booru')

const BooruTypes = {
  'json': require('./src/boorus/JsonBooru'),
  'xml': require('./src/boorus/XmlBooru'),
  'derpi': require('./src/boorus/Derpibooru'),
}

/**
 * Create a new booru to search with
 * @param {String} site The site (or alias of it) to create a booru from
 * @param {*} credentials The credentials to use on this booru
 * @return {Booru} A booru to use
 */
function _Booru(site, credentials = null) {
  const rSite = Utils.resolveSite(site)

  if (rSite === null) {
    throw new BooruError('Site not supported')
  }

  const booruSite = Constants.sites[rSite]

  return new BooruTypes[booruSite.type](booruSite, credentials)
}

const booruCache = {}

/**
 * Search options to use with booru.search()
 * @typedef  {Object}  SearchOptions
 * @property {Number|String}  [limit=1] The number of images to return
 * @property {Boolean} [random=false] If it should randomly grab results
 */

/**
 * Searches a site for images with tags and returns the results
 * @param  {String}        site      The site to search
 * @param  {String[]}      [tags=[]] Tags to search with
 * @param  {SearchOptions}
 * @return {Promise}           A promise with the images as an array of objects
 *
 * @example
 * booru.search('e926', ['glaceon', 'cute'])
 * //returns a promise with the latest cute glace pic from e926
 */
function search(site, tags = [], {limit = 1, random = false} = {}) {
  const rSite = Utils.resolveSite(site)
  limit = parseInt(limit)

  if (rSite === null) {
    throw new BooruError('Site not supported')
  }

  if (!(tags instanceof Array)) {
    throw new BooruError('`tags` should be an array')
  }

  if (typeof limit !== 'number' || Number.isNaN(limit)) {
    throw new BooruError('`limit` should be an int')
  }

  // Too lazy to remove validation (for now)

  const booruSite = Constants.sites[rSite]

  if (!booruCache[rSite]) {
    booruCache[rSite] = new BooruTypes[booruSite.type](booruSite)
  }

  return booruCache[rSite].search(tags, {limit, random})
}

/**
 * Deprecated, now a noop
 * Just access <{@link BooruImage}>.common and it'll be auto-generated as you get it
 *
 * @deprecated
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
