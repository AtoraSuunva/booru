//@ts-check
const Booru = require('./Booru.js')
const Site = require('../structures/Site.js')

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
}
module.exports = XmlBooru
