//@ts-check

const Snekfetch = require('snekfetch')
const Site = require('../structures/Site.js')
const Utils = require('../Utils.js')
const Constants =  require('../Constants.js')
const {BooruError} = Constants

const Post = require('../structures/Post.js')
const SearchResults = require('../structures/SearchResults.js')

/*
- new Booru
    => Constructor, params {name, {nsfw, {search, postView, ...}, random}, {apiTokens...}}
    => .search([tags...], {limit, random})
    => .postView(id)
    => .site
*/

/**
 * A basic, JSON booru
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
class Booru {
  /**
   * Create a new booru from a site
   *
   * @private
   * @param {Site} site The site to use
   * @param {Object?} credentials Credentials for the API (Currently not used)
   */
  constructor(site, credentials = null) {
    /**
     * The domain of the booru
     * @type {String}
     */
    this.domain = Utils.resolveSite(site.aliases[0])
    /**
     * The site object representing this booru
     * @type {Site}
     */
    this.site = site

    if (this.domain === null) {
      throw new Error(`Invalid site passed: ${site}`)
    }

    this.credentials = credentials
  }

  /**
   * Search for images on this booru
   * @param {String|String[]} tags The tag(s) to search for
   * @param {Object} searchArgs The arguments for the search
   * @param {Number} [searchArgs.limit=1] The number of images to return
   * @param {Boolean} [searchArgs.random=false] If it should randomly grab results
   * @param {Number} [searchArgs.page=0] The page to search
   * @return {Promise<SearchResults>} The results as an array of Posts
   */
  search(tags, { limit = 1, random = false, page = 0 } = {}) {
    let fakeLimit = random && !this.site.random ? 100 : 0

    return new Promise((resolve, reject) => {
      this._doSearchRequest(tags, {limit, random, page})
        .then(result => {
          resolve(this._parseSearchResult(result, {fakeLimit, tags, limit, random, page}))
        })
        .catch(e => {e.name = 'BooruError'; reject(e)})
    })
  }

  /**
   * The internal & common searching logic, pls dont use this use .search instead
   *
   * @private
   * @param {String[]|String} tags The tags to search with
   * @param {Object} searchArgs The arguments for the search
   * @param {Number} [searchArgs.limit=1] The number of images to return
   * @param {Boolean} [searchArgs.random=false] If it should randomly grab results
   * @param {Number} [searchArgs.page=0] The page number to search
   * @return {Promise<Snekfetch.SnekfetchResponse>}
   */
  _doSearchRequest(tags, {limit = 1, random = false, page = 0} = {}) {
    if (!Array.isArray(tags)) {
      tags = [tags]
    }

    // Used for random on sites without order:random
    let fakeLimit

    if (random) {
      if (this.site.random) {
        tags.push('order:random')
      } else {
        fakeLimit = 100
      }
    }

    const uri = Constants.searchURI(this.domain, this.site, tags, fakeLimit || limit, page)
    const options = Constants.defaultOptions

    return Snekfetch.get(uri, options)
  }

  /**
   * Parse the response from the booru
   *
   * @private
   * @param {Object} result The response of the booru
   * @param {Object} searchArgs The arguments used for the search
   * @param {Number?} [searchArgs.fakeLimit] If the `order:random` should be faked
   * @param {String[]|String} [searchArgs.tags] The tags used on the search
   * @param {Number} [searchArgs.limit] The number of images to return
   * @param {Boolean} [searchArgs.random] If it should randomly grab results
   * @param {Number} [searchArgs.page] The page number searched
   * @return {SearchResults} The results of this search
   */
  _parseSearchResult(result, {fakeLimit, tags, limit, random, page}) {
    if (Array.isArray(result)) {
      result = {body: result}
    }

    let r
    // if gelbooru/other booru decides to return *nothing* instead of an empty array 😒
    if (result.text === '') {
      r = []
    } else if (fakeLimit) {
      r = Utils.shuffle(result.body instanceof Buffer ? JSON.parse(result.text) : result.body)
    }

    const results = r || (result.body instanceof Buffer ? JSON.parse(result.text) : result.body) || result

    const posts = results.slice(0, limit).map(v => new Post(v, this))
    const options = { limit, random, page }

    return new SearchResults(posts, tags, options, this)
  }

  /**
   * Gets the url you'd see in your browser from a post id for this booru
   *
   * @param {String} id The id to get the postView for
   * @return {String} The url to the post
   */
  postView(id) {
    if (Number.isNaN(parseInt(id))) {
      throw new BooruError(`Not a valid id for postView: ${id}`)
    }

    return `http${this.site.insecure ? '' : 's'}://` + this.domain + this.site.api.postView + id
  }
}

module.exports = Booru
