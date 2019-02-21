const fetch = require('node-fetch')

import Site from '../structures/Site'
import Post from '../structures/Post'
import SearchResults from '../structures/SearchResults'
import SearchParameters from '../structures/SearchParameters'
import InternalSearchParameters from '../structures/InternalSearchParameters'
import * as Utils from '../Utils'
import * as Constants from '../Constants'
import { FetchError } from 'node-fetch';
const { BooruError } = Constants

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
export default class Booru {
  /** The domain of the booru */
  domain: string
  /** The site object representing this booru */
  site: Site
  /** The credentials to use for this booru */
  credentials: any

  /**
   * Create a new booru from a site
   *
   * @private
   * @param {Site} site The site to use
   * @param {Object?} credentials Credentials for the API (Currently not used)
   */
  constructor(site: Site, credentials: object|null = null) {
    const domain = Utils.resolveSite(site.domain)

    if (domain === null) {
      throw new Error(`Invalid site passed: ${site}`)
    }

    this.domain = domain
    this.site = site
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
  search(tags: string|string[],
    { limit = 1, random = false, page = 0 }: SearchParameters = {}): Promise<SearchResults> {

    const fakeLimit: number = random && !this.site.random ? 100 : 0

    return this._doSearchRequest(tags, { limit, random, page })
      .then(r => this._parseSearchResult(r, { fakeLimit, tags, limit, random, page }))
      .catch(e => Promise.reject(new BooruError(e)))
  }

  /**
   * The internal & common searching logic, pls dont use this use .search instead
   *
   * @protected
   * @param {String[]|String} tags The tags to search with
   * @param {Object} searchArgs The arguments for the search
   * @param {Number} [searchArgs.limit=1] The number of images to return
   * @param {Boolean} [searchArgs.random=false] If it should randomly grab results
   * @param {Number} [searchArgs.page=0] The page number to search
   * @param {String?} [searchArgs.uri=null] If the uri should be overwritten
   * @return {Promise<Object>}
   */
  protected _doSearchRequest(tags: string[]|string,
     {limit = 1, random = false, page = 0, uri = null}: InternalSearchParameters = {}): Promise<any> {

    if (!Array.isArray(tags)) {
      tags = [tags]
    }

    // Used for random on sites without order:random
    let fakeLimit: number|undefined

    if (random) {
      if (this.site.random) {
        tags.push('order:random')
      } else {
        fakeLimit = 100
      }
    }

    const fetchuri = uri ||
                    Constants.searchURI(this.site, tags, fakeLimit || limit, page)
    const options = Constants.defaultOptions
    const xml = this.site.type === 'xml'

    return fetch(fetchuri, options)
          .then((r: Response) => xml ? r.text() : r.json())
          .then((r: string|object) => xml ? Utils.jsonfy(r as string) : Promise.resolve(r))
          .catch((e: FetchError) => e.type === 'invalid-json' ? Promise.resolve('') : Promise.reject(e))
  }

  /**
   * Parse the response from the booru
   *
   * @protected
   * @param {Object} result The response of the booru
   * @param {Object} searchArgs The arguments used for the search
   * @param {Number?} [searchArgs.fakeLimit] If the `order:random` should be faked
   * @param {String[]|String} [searchArgs.tags] The tags used on the search
   * @param {Number} [searchArgs.limit] The number of images to return
   * @param {Boolean} [searchArgs.random] If it should randomly grab results
   * @param {Number} [searchArgs.page] The page number searched
   * @return {SearchResults} The results of this search
   */
  protected _parseSearchResult(result: any,
    {fakeLimit, tags, limit, random, page}: InternalSearchParameters) {

    if (result.success === false) {
      throw new BooruError(result.message || result.reason)
    }

    let r: string[]|undefined
    // if gelbooru/other booru decides to return *nothing* instead of an empty array
    if (result === '') {
      r = []
    } else if (fakeLimit) {
      r = Utils.shuffle(result)
    }

    const results = r || result
    const posts = results.slice(0, limit).map((v: any) => new Post(v, this))
    const options = { limit, random, page }

    if (tags === undefined) {
      tags = []
    }

    if (!Array.isArray(tags)) {
      tags = [tags]
    }

    return new SearchResults(posts, tags, options, this)
  }

  /**
   * Gets the url you'd see in your browser from a post id for this booru
   *
   * @param {String} id The id to get the postView for
   * @return {String} The url to the post
   */
  postView(id: string|number): string {
    if (typeof id === 'string' && Number.isNaN(parseInt(id))) {
      throw new BooruError(`Not a valid id for postView: ${id}`)
    }

    return `http${this.site.insecure ? '' : 's'}://` + this.domain + this.site.api.postView + id
  }
}
