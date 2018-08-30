/**
 * Represents a site, mostly used for JSDoc
 */
class Site {
  constructor(data) {
    /**
     * The type of this site (json/xml/derpi)
     * @type {String}
     */
    this.type = data.type || 'json'
    /**
     * The aliases of this site
     * @type {String[]}
     */
    this.aliases = data.aliases || []
    /**
     * If this site serves NSFW posts or not
     * @type {Boolean}
     */
    this.nsfw = data.nsfw
    /**
     * An object representing the api of this site
     * @type {Object}
     */
    this.api = data.api || {}
    /**
     * The url query param to paginate on the site
     * @type {String}
     */
    this.paginate = data.paginate || 'page'
    /**
     * If the site supports `order:random`
     * @type {Boolean}
     */
    this.random = data.random
    /**
     * The url query param for tags
     * @type {String}
     */
    this.tagQuery = data.tagQuery || 'tags'
    /**
     * If this site supports only http://
     * @type {Boolean}
     */
    this.insecure = data.insecure || false
  }
}

module.exports = Site
