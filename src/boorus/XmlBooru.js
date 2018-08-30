//@ts-check
const Booru = require('./Booru.js')
const Utils = require('../Utils.js')
const Site = require('../structures/Site.js')
const Constants = require('../Constants.js')
const Post = require('../structures/Post.js')
const Snekfetch = require('snekfetch')

/**
 * A class designed for Xml-returning boorus
 *
 * @private
 * @extends Booru
 * @inheritDoc
 */
class XmlBooru extends Booru {
  /**
   * Create a new booru using XML from a site
   * @param {Site} site The site to use
   * @param {Object?} credentials Credentials for the API (Currently not used)
   */
  constructor(site, credentials) {
    super(site, credentials)
  }

  /** @inheritDoc */
  search(tags, { limit = 1, random = false, page = 0 } = {}) {
    let fakeLimit = random && !this.site.random ? 100 : 0

    return new Promise((resolve, reject) => {
      super._doSearchRequest(tags, { limit, random, page })
        .then(async result => {
          result = await Utils.jsonfy(result.text)
          resolve(super._parseSearchResult(result, { fakeLimit, tags, limit, random, page }))
        })
        .catch(e => {e.name = 'BooruError'; reject(e)})
    })
  }
}
module.exports = XmlBooru
