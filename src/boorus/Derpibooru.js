//@ts-check
const Booru = require('./Booru.js')
const Utils = require('../Utils.js')
const Constants = require('../Constants.js')
const Post = require('../structures/Post.js')
const Snekfetch = require('snekfetch')

/**
 * A class designed for Derpibooru
 * >:(
 * @private
 * @extends Booru
 * @inheritDoc
 */
class Derpibooru extends Booru {
  /**
   * Create a new booru for Derpibooru from a site
   * @param {Site} site The site to use
   * @param {Object?} credentials Credentials for the API (Currently not used)
   */
  constructor(site, credentials) {
    super(site, credentials)
  }

  /** @inheritDoc */
  search(tags, {limit = 1, random = false, credentials = null} = {}) {
    if (!credentials && this.credentials) credentials = this.credentials;

    if (!Array.isArray(tags)) {
      tags = [tags]
    }

    // For any image, you must supply *
    if (tags[0] === undefined) {
      tags[0] = '*'
    }

    const uri = Constants.searchURI(this.domain, this.site, tags, limit)
              + (random ? `&${this.site.random}` : '')
              + (credentials ? '&key=' + credentials : '')
    const options = Constants.defaultOptions

    return new Promise((resolve, reject) => {
      Snekfetch.get(uri, options)
        .then(result => {
          resolve((result.body.search).slice(0, limit).map(v => new Post(v, this)))
        })
        .catch(e => {e.name = 'BooruError'; reject(e)})
    })
  }
}
module.exports = Derpibooru
