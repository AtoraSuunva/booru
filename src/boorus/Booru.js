//@ts-check

const Snekfetch = require('snekfetch')
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
 * Represents an interface to a generic Booru
 *
 * @interface Booru
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
    this.domain = Utils.resolveSite(site.aliases[0])
    this.site = site

    if (this.domain === null) {
      throw new Error(`Invalid site passed: ${site}`)
    }
  }

  /**
   * Search for images on this booru
   * @param {String|String[]} tags The tag(s) to search for
   * @param {Object} searchArgs The arguments for the search
   * @param {Number} [searchArgs.limit=1] The number of images to return
   * @param {Boolean} [searchArgs.random=false] If it should randomly grab results
   * @return {Promise<Post[]>} The results as an array of Posts
   */
  search(tags, { limit = 1, random = false, page = 0 } = {}) {
    let fakeLimit = random && !this.site.random ? 100 : 0

    return new Promise((resolve, reject) => {
      this._doSearchRequest(tags, {limit, random, page})
        .then(result => {
          resolve(this._parseSearchResult(result, {fakeLimit, tags, limit, random, page}))
        })
        .catch(e => reject(new Constants.BooruError(e.message || e.error)))
    })
  }

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

  _parseSearchResult(result, {fakeLimit, tags, limit, random, page}) {
    let r
    if (fakeLimit) {
      r = Utils.shuffle(result.body)
    }

    const posts = (r || result.body || result).slice(0, limit).map(v => new Post(v, this))
    const options = { limit, random, page }

    return new SearchResults(posts, tags, options, this)
  }

  /**
   * Gets the url you'd see in your browser from a post id for this booru
   * @param {String} id The id to get the postView for
   */
  postView(id) {
    if (Number.isNaN(parseInt(id))) {
      throw new BooruError(`Not a valid id for postView: ${id}`)
    }

    // TODO: Check if https is supported
    return 'https://' + this.domain + this.site.api.postView + id
  }
}

module.exports = Booru
