import SiteInfo from './SiteInfo'
import SiteApi from './SiteApi'

/**
 * Represents a site, mostly used for JSDoc
 */
export default class Site {
  /** The domain of the Site (the "google.com" part of "https://google.com/foo") */
  domain: string
  /** The type of this site (json/xml/derpi) */
  type: string
  /** The aliases of this site */
  aliases: string[]
  /** If this site serves NSFW posts or not */
  nsfw: boolean
  /** An object representing the api of this site */
  api: SiteApi
  /** The url query param to paginate on the site */
  paginate: string
  /** If the site supports `order:random`. If a string, this means a custom random system is used :/ */
  random: boolean|string
  /** The url query param for tags */
  tagQuery: string
  /** If this site supports only http:// */
  insecure: boolean

  // lol it takes as input a site so ts doesn't complain
  constructor(data: SiteInfo) {
    this.domain = data.domain
    this.type = data.type || 'json'
    this.aliases = data.aliases || []
    this.nsfw = data.nsfw || true
    this.api = data.api || {}
    this.paginate = data.paginate || 'page'
    this.random = data.random || false
    this.tagQuery = data.tagQuery || 'tags'
    this.insecure = data.insecure || false
  }
}
