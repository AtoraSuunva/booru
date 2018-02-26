//@ts-check

/**
 * @module Booru
 */

const {BooruError, sites} = require('../Constants.js')
const BooruImage = require('../Image.js')

/*
- new Booru // Interface
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
module.exports = class Booru {
  /**
   * Create a new booru from a site
   * @param {String} domain The full domain name
   * @param {Site} site The site to use
   * @param {Object?} credentials Credentials for the API (Currently not used)
   */
  constructor(domain, site, credentials = null) {
    this.domain = domain
    this.site = site

  }

  /**
   * Search for images on this booru
   * @param {String|String[]} tags The tag(s) to search for
   * @param {Object} searchArgs The arguments for the search
   * @param {Number} [searchArgs.limit=1] The number of images to return
   * @param {Boolean} [searchArgs.random=false] If it should randomly grab results
   * @return {Promise<BooruImage[]>} The images from the booru
   */
  search(tags, {limit = 1, random = false} = {}) {
    if (!Array.isArray(tags)) {
      tags = [tags]
    }

    return null
  }

  /**
   * Gets the url you'd see in your browser from a post id for this booru
   * @param {String} id The id to get the postView for
   */
  postView(id) {
    if (Number.isNaN(parseInt(id))) {
      throw new BooruError(`Not a vaid id for postView: ${id}`)
    }

    return this.domain + this.site.api.postView + id
  }
}
