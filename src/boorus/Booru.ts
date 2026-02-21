/**
 * @packageDocumentation
 * @module Boorus
 */

import { fetch } from 'undici'
import {
  BooruError,
  defaultOptions,
  postCountURI,
  searchURI,
  tagListURI,
} from '../Constants'
import type InternalSearchParameters from '../structures/InternalSearchParameters'
import Post from '../structures/Post'
import type SearchParameters from '../structures/SearchParameters'
import SearchResults from '../structures/SearchResults'
import type Site from '../structures/Site'
import Tag from '../structures/Tag'
import TagListResults from '../structures/TagListResults'
import {
  jsonifyPosts,
  jsonifyTags,
  resolveSite,
  shuffle,
  tryParseJSON,
} from '../Utils'

// Shut up the compiler
// This attempts to find and use the native browser fetch, if possible
// Fixes https://github.com/AtoraSuunva/booru/issues/51
declare const window: any
const resolvedFetch: typeof fetch =
  typeof window !== 'undefined' ? window.fetch.bind(window) : fetch

export type BooruCredentials = Record<string, string>

interface SearchUrlParams {
  tags: string[]
  limit: number
  page: number
}

interface TagsURLParams {
  limit?: number | undefined
  page?: number | undefined
}

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
 * ```
 * const Booru = require('booru')
 * // Aliases are supported
 * const e9 = Booru('e9')
 *
 * // You can then search the site
 * const imgs = await e9.search(['cat', 'cute'], {limit: 3})
 *
 * // And use the images
 * imgs.forEach(i => console.log(i.fileUrl))
 *
 * // Or access other methods on the Booru
 * e9.postView(imgs[0].id)
 * ```
 */
export class Booru {
  /** The domain of the booru */
  public domain: string
  /** The site object representing this booru */
  public site: Site
  /** The credentials to use for this booru */
  public credentials?: BooruCredentials | undefined

  /**
   * Create a new booru from a site
   *
   * @private
   * @param site The site to use
   * @param credentials Credentials for the API
   */
  constructor(site: Site, credentials?: BooruCredentials) {
    const domain = resolveSite(site.domain)

    if (domain === null) {
      throw new Error(`Invalid site passed: ${site.domain}`)
    }

    this.domain = domain
    this.site = site
    this.credentials = credentials
  }

  protected normalizeTags(tags: string | string[]): string[] {
    if (!Array.isArray(tags)) {
      return [tags]
    }

    return tags.slice()
  }

  /**
   * Search for images on this booru
   * @param {String|String[]} tags The tag(s) to search for
   * @param {SearchParameters} searchArgs The arguments for the search
   * @return {Promise<SearchResults>} The results as an array of Posts
   */
  public async search(
    tags: string | string[],
    {
      limit = 1,
      random = false,
      page = 0,
      showUnavailable = false,
    }: SearchParameters = {},
  ): Promise<SearchResults> {
    const fakeLimit: number = random && !this.site.random ? 100 : 0
    const tagArray = this.normalizeTags(tags)

    try {
      const searchResult = await this.doSearchRequest(tagArray, {
        limit,
        random,
        page,
        showUnavailable,
      })
      return this.parseSearchResult(searchResult, {
        fakeLimit,
        tags: tagArray,
        limit,
        random,
        page,
        showUnavailable,
      })
    } catch (err) {
      if (err instanceof Error) {
        throw new BooruError(err)
      }

      throw err
    }
  }

  /**
   * Gets the total number of posts for a specific tag or tag combination
   * @param {String|String[]} tags The tag(s) to search for
   * @return {Promise<number>} The total number of posts
   */
  public async getPostCount(tags: string | string[]): Promise<number> {
    const tagArray = this.normalizeTags(tags)

    try {
      const postCountResult = await this.doPostCountRequest(tagArray, {
        limit: 1,
      })

      return postCountResult
    } catch (err) {
      if (err instanceof Error) {
        throw new BooruError(err)
      }

      throw err
    }
  }

  /**
   * Gets the url you'd see in your browser from a post id for this booru
   *
   * @param {String} id The id to get the postView for
   * @return {String} The url to the post
   */
  public postView(id: string | number): string {
    if (typeof id === 'string' && Number.isNaN(Number.parseInt(id, 10))) {
      throw new BooruError(`Not a valid id for postView: ${id}`)
    }

    return `http${this.site.insecure ? '' : 's'}://${this.domain}${
      this.site.api.postView
    }${id}`
  }

  /**
   * Gets a list of tags from the booru
   * @param {Partial<TagsURLParams>} [params] The parameters for the tags list
   * @param {number} [params.limit=100] The limit of tags to return
   * @param {number} [params.page=1] The page of tags to return
   * @return {Promise<any[]>} A promise with the tags as an array
   */
  public async tagList({
    limit = 100,
    page = 1,
  }: Partial<TagsURLParams> = {}): Promise<TagListResults> {
    const url = this.getTagListUrl({ limit, page })
    const options = defaultOptions
    try {
      const response = await resolvedFetch(url, options)

      // Check for CloudFlare ratelimiting
      if (response.status === 503) {
        const body = await response.clone().text()
        if (body.includes('cf-browser-verification')) {
          throw new BooruError(
            "Received a CloudFlare browser verification request. Can't proceed.",
          )
        }
      }

      if (!response.ok) {
        throw new BooruError(
          `Received HTTP ${response.status} from booru: '${await response.text()}'`,
        )
      }

      const data = await response.text()
      /**
       * Many boorus don't support JSON parameter for tag listing
       * So attempt JSON parsing, but if it fails default to XML parsing
       **/
      let tags = []
      try {
        tags = tryParseJSON(data)
      } catch (_e) {
        tags = jsonifyTags(data)
      }

      return this.parseTagListResult(tags, { limit, page })
    } catch (err) {
      if ((err as any).type === 'invalid-json')
        if (err instanceof Error) {
          throw new BooruError(err)
        }

      throw err
    }
  }

  /**
   * The internal & common searching logic, pls dont use this use .search instead
   *
   * @protected
   * @param {String[]|String} tags The tags to search with
   * @param {InternalSearchParameters} searchArgs The arguments for the search
   * @return {Promise<Object>}
   */
  protected async doSearchRequest(
    tags: string[],
    {
      uri = null,
      limit = 1,
      random = false,
      page = 0,
    }: InternalSearchParameters = {},
  ): Promise<any> {
    // Used for random on sites without order:random
    let fakeLimit: number | undefined
    let searchTags = tags.slice()

    if (random) {
      if (this.site.random) {
        searchTags.push('order:random')
      } else {
        fakeLimit = 100
      }
    }

    if (this.site.defaultTags) {
      searchTags = searchTags.concat(
        this.site.defaultTags.filter((v) => !searchTags.includes(v)),
      )
    }

    const fetchuri =
      uri ??
      this.getSearchUrl({ tags: searchTags, limit: fakeLimit ?? limit, page })

    const options = defaultOptions
    const xml = this.site.type === 'xml'

    try {
      const response = await resolvedFetch(fetchuri, options)

      // Check for CloudFlare ratelimiting
      if (response.status === 503) {
        const body = await response.clone().text()
        if (body.includes('cf-browser-verification')) {
          throw new BooruError(
            "Received a CloudFlare browser verification request. Can't proceed.",
          )
        }
      }

      const data = await response.text()
      const posts = xml ? jsonifyPosts(data).posts : tryParseJSON(data)

      if (!response.ok) {
        throw new BooruError(
          `Received HTTP ${response.status} ` +
            `from booru ${this.site.domain}: '${
              (posts as any).message ??
              (posts as any).error ??
              JSON.stringify(posts)
            }'`,
        )
      }

      return posts
    } catch (err) {
      if ((err as any).type === 'invalid-json') return ''
      throw err
    }
  }

  /**
   * The internal & common postCount logic, pls dont use this use .postCount instead
   *
   * @protected
   * @param {String[]|String} tags The tags to search with
   * @param {InternalSearchParameters} searchArgs The arguments for the search
   * @return {Promise<Object>}
   */
  protected async doPostCountRequest(
    tags: string[],
    { uri = null, limit = 1 }: InternalSearchParameters = {},
  ): Promise<number> {
    let searchTags = tags.slice()

    if (this.site.defaultTags) {
      searchTags = searchTags.concat(
        this.site.defaultTags.filter((v) => !searchTags.includes(v)),
      )
    }

    const fetchuri = uri ?? this.getPostCountUrl({ tags: searchTags, limit })

    try {
      const response = await resolvedFetch(fetchuri, defaultOptions)

      // Check for CloudFlare ratelimiting
      if (response.status === 503) {
        const body = await response.clone().text()
        if (body.includes('cf-browser-verification')) {
          throw new BooruError(
            "Received a CloudFlare browser verification request. Can't proceed.",
          )
        }
      }

      const data = await response.text()

      if (!response.ok) {
        throw new BooruError(
          `Received HTTP ${response.status} ` +
            `from booru: '${
              (data as any).error ??
              (data as any).message ??
              JSON.stringify(data)
            }'`,
        )
      }

      const postCountType = this.site.postCountType

      return this.getPostCountNumber(postCountType, data)
    } catch (err) {
      if ((err as any).type === 'invalid-json') return 0
      throw err
    }
  }

  private getPostCountNumber(
    postCountType: 'json' | 'xml' | 'derpi',
    data: string,
  ) {
    if (postCountType === 'json') {
      return (tryParseJSON(data) as any).counts.posts
    }
    if (postCountType === 'derpi') {
      return (tryParseJSON(data) as any).total
    }
    if (postCountType === 'xml') {
      console.log(this.site.domain)
      const jsonData = jsonifyPosts(data)
      if (jsonData.count !== undefined) {
        return jsonData.count
      }
    }
    return -1
  }

  /**
   * Generates a URL to search the booru with, mostly for debugging purposes
   * @param opt
   * @param {string[]} [opt.tags] The tags to search for
   * @param {number} [opt.limit] The limit of results to return
   * @param {number} [opt.page] The page of results to return
   * @returns A URL to search the booru
   */
  getSearchUrl({
    tags = [],
    limit = 100,
    page = 1,
  }: Partial<SearchUrlParams> = {}): string {
    return searchURI(this.site, tags, limit, page, this.credentials)
  }

  /**
   * Generates a URL to search the booru with, mostly for debugging purposes
   * @param opt
   * @param {string[]} [opt.tags] The tags to search for
   * @param {number} [opt.limit] The limit of results to return
   * @param {number} [opt.page] The page of results to return
   * @returns A URL to search the booru
   */
  getPostCountUrl({
    tags = [],
    limit = 1,
  }: Partial<SearchUrlParams> = {}): string {
    return postCountURI(this.site, tags, limit, this.credentials)
  }

  /**
   * Generates a URL to get a list of tags from the booru
   * @param opt
   * @param {number} [opt.limit] The limit of tags to return
   * @param {number} [opt.page] The page of tags to return
   * @returns {string} A URL to get the tags list
   */
  getTagListUrl({
    limit = 100,
    page = 1,
  }: Partial<TagsURLParams> = {}): string {
    if (!this.site.api.tagList) {
      throw new BooruError(
        `This booru does not support tag listing: ${this.site.domain}`,
      )
    }
    return tagListURI(this.site, limit, page, this.credentials)
  }

  /**
   * Parse the response from the booru
   *
   * @protected
   * @param {Object} result The response of the booru
   * @param {InternalSearchParameters} searchArgs The arguments used for the search
   * @return {SearchResults} The results of this search
   */
  protected parseSearchResult(
    result: any,
    {
      fakeLimit,
      tags,
      limit,
      random,
      page,
      showUnavailable,
    }: InternalSearchParameters,
  ): SearchResults {
    let outResult = result

    if (outResult.success === false) {
      throw new BooruError(outResult.message ?? outResult.reason)
    }

    // Gelbooru
    if (outResult['@attributes']) {
      const attributes = outResult['@attributes']

      if (attributes.count === '0' || !outResult.post) {
        outResult = []
      } else if (Array.isArray(outResult.post)) {
        outResult = outResult.post
      } else {
        outResult = [outResult.post]
      }
    }

    if (outResult.posts) {
      outResult = outResult.posts
    }

    if (outResult.images) {
      outResult = outResult.images
    }

    let r: string[] | undefined
    // If gelbooru/other booru decides to return *nothing* instead of an empty array
    if (outResult === '') {
      r = []
    } else if (fakeLimit) {
      r = shuffle(outResult)
    } else if (outResult.constructor === Object) {
      // For XML based sites
      r = [outResult]
    }

    let posts: Post[] = (r ?? outResult)
      .slice(0, limit)
      .map((v: any) => new Post(v, this))
    const options = { limit, random, page, showUnavailable }

    if (tags === undefined) {
      tags = []
    }

    if (!showUnavailable) {
      posts = posts.filter((p) => p.available)
    }

    return new SearchResults(posts, tags, options, this)
  }

  /**
   * Parse the response from the booru for a tag list
   *
   * @param result
   * @param param1
   * @returns
   */
  protected parseTagListResult(
    result: any,
    { limit = 100, page = 1 }: Partial<TagsURLParams> = {},
  ): TagListResults {
    if (result.success === false) {
      throw new BooruError(result.message ?? result.reason)
    }

    let tags: any[] = []

    if (result) {
      if (Array.isArray(result)) {
        tags = result.map((v) => new Tag(v, this))
      } else {
        tags = [new Tag(result, this)]
      }
    }

    return new TagListResults(tags, { limit, page }, this)
  }
}

export default Booru
