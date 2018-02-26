// Declare the dependencies
const snekfetch = require('snekfetch')

const constants = require('./src/Constants.js')
const utils = require('./src/Utils.js')

/**
 * Search options to use with booru.search()
 * @typedef  {Object}  SearchOptions
 * @property {Number}  [limit=1] The number of images to return
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
  return new Promise((resolve, reject) => {
    site = resolveSite(site)
    limit = parseInt(limit)

    if (site === false)
      return reject(new BooruError('Site not supported'))

    if (!(tags instanceof Array))
      return reject(new BooruError('`tags` should be an array'))

    if (typeof limit !== 'number' || Number.isNaN(limit))
      return reject(new BooruError('`limit` should be an int'))

    resolve(searchPosts(site, tags, {limit, random}))
  })
}



/**
 * Actual searching code
 * @private
 * @param  {String}  site   The full site url, name + tld
 * @param  {Array}   tags   The array of tags to search for
 * @param  {Number}  limit  Number of posts to fetch
 * @param  {searchOptions}
 * @return {Promise}        Response with the site's api
 */
function searchPosts(site, tags, {limit = 1, random = false} = {}) {
  return new Promise((resolve, reject) => {
    // derpibooru requires '*' to show all images
    if (tags[0] === undefined && site === 'derpibooru.org')
      tags[0] = '*'

    // derpibooru requires spaces instead of _
    if (site === 'derpibooru.org')
      tags = tags.map(v => v.replace(/_/g, '%20'))

    let uri = `http://${site}${sites[site].api}${(sites[site].tagQuery) ? sites[site].tagQuery : 'tags'}=${tags.join('+')}&limit=${limit}`
    let options = {
      headers: {'User-Agent': 'Booru, a node package for booru searching (by AtlasTheBot)'}
    }

    if (!random) {
      resolve(
        snekfetch
          .get(uri, options)
          .then(result => result.body)
          .catch(err => reject(new BooruError(err.error.message || err.error)))
      )
    }

    // If we request random images...
    // First check if the site supports order:random (or some other way to randomize it)
    if (sites[site].random) {
      // If it's a string it's (likely) randomized using a user-provided random hex
      if (typeof sites[site].random === 'string') {
        uri = `http://${site}${sites[site].api}${(sites[site].tagQuery) ? sites[site].tagQuery : 'tags'}=${tags.join('+')}&limit=${limit}`
            + `&${sites[site].random}${(sites[site].random.endsWith('%')) ? Array(7).fill(0).map(v => randInt(0, 16)).join('') : ''}`
        // http://example.com/posts/?tags=some_example&limit=100&sf=random%AB43FF
        // Sorry, but derpibooru has an odd and confusing api that's not similar to the others at all
      } else {
        // We can just add `order:random` and get random results!
        uri = `http://${site}${sites[site].api}tags=order:random+${tags.join('+')}&limit=${limit}`
      }

      snekfetch
        .get(uri, options)
        // Once again, derpi is weird and has it's results in body.search and not just in body
        .then(result => resolve(((result.body.search) ? result.body.search : result.body).slice(0, limit)))
        .catch(err => reject(new BooruError(err.message || err.error)))
    } else {
      // The site doesn't support random sorting in any way, so we need to do it ourselves
      // This is done by just getting the 100 latest and randomly sorting those
      // Which isn't really an amazing way, but works well enough and doesn't require keeping track
      // of how many pages or whatever
      uri = `http://${site}${sites[site].api}tags=${tags.join('+')}&limit=100`

      // This does automatically jsonfy results, but that's because I can't really sort them otherwise
      snekfetch
        .get(uri, options)
        .then(result => jsonfy(result.text))
        .then(images => resolve(shuffle(images).slice(0, limit)))
        .catch(err => resolve(new BooruError(err.message || err.error)))
    }
  })
}

/**
 * Deprecated, now a noop
 * Just access <{@link BooruImage}>.common and it'll be auto-generated as you get it
 *
 * @deprecated
 * @param  {BooruImage[]}       images Array of {@link BooruImage} objects
 * @return {BooruLink[]}        Array of {@link BooruLink} objects
 */
function commonfy(images) {
  return new Promise.resolve(images)
}

module.exports.commonfy = commonfy // do nothing
module.exports.sites = constants.sites // Sites in case you want to see what it supports
module.exports.resolveSite = utils.resolveSite // might as well /shrug

// coding is fun :)
