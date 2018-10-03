//@ts-check
const Booru = require('./Booru.js')
const Constants = require('../Constants.js')
const Site = require('../structures/Site.js')

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
  search(tags, { limit = 1, random = false, page = 0 } = {}) {
    if (!Array.isArray(tags)) {
      tags = [tags]
    }

    // For any image, you must supply *
    if (tags[0] === undefined) {
      tags[0] = '*'
    }

    const uri = Constants.searchURI(this.domain, this.site, tags, limit)
              + (random ? `&${this.site.random}` : '')
              + (this.credentials ? '&key=' + this.credentials : '')

    return super._doSearchRequest(tags, {limit, random, page, uri})
      .then(r => super._parseSearchResult(r.search, { fakeLimit: 0, tags, limit, random, page }))
      .catch(e => {e.name = 'BooruError'; return Promise.reject(e)})
  }
}
module.exports = Derpibooru
