/**
 * @packageDocumentation
 * @module Structures
 */

import type SiteApi from './SiteApi'
import type SiteInfo from './SiteInfo'

/**
 * Represents a site, mostly used for JSDoc
 */
export default class Site {
  /** The domain of the Site (the "google.com" part of "https://google.com/foo") */
  public domain: string
  /** The type of this site (json/xml/derpi) */
  public type: string
  /** The aliases of this site */
  public aliases: string[]
  /** If this site serves NSFW posts or not */
  public nsfw: boolean
  /** An object representing the api of this site */
  public api: SiteApi
  /** The url query param to paginate on the site */
  public paginate: string
  /**
   * If the site supports `order:random`.
   * If a string, this means a custom random system is used :/
   */
  public random: boolean | string
  /** The url query param for tags */
  public tagQuery: string
  /** The character to use to join tags when creating the search url */
  public tagJoin: string
  /** If this site supports only http:// */
  public insecure: boolean
  /** Tags to add to every request, if not included */
  public defaultTags: string[]

  constructor(data: SiteInfo) {
    this.domain = data.domain
    this.type = data.type ?? 'json'
    this.aliases = data.aliases ?? []
    this.nsfw = data.nsfw
    this.api = data.api ?? {}
    this.paginate = data.paginate ?? 'page'
    this.random = data.random ?? false
    this.tagQuery = data.tagQuery ?? 'tags'
    this.tagJoin = data.tagJoin ?? '+'
    this.insecure = data.insecure ?? false
    this.defaultTags = data.defaultTags ?? []
  }
}
