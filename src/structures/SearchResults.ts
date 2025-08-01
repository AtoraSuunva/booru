/**
 * @packageDocumentation
 * @module Structures
 */

import type Booru from '../boorus/Booru'
import type Post from '../structures/Post'
import * as Utils from '../Utils'
import type SearchParameters from './SearchParameters'

/**
 * Represents a page of search results, works like an array of {@link Post}
 * <p> Usable like an array and allows to easily get the next page
 *
 * @example
 * ```
 * const Booru = require('booru')
 * // Safebooru
 * const sb = new Booru('sb')
 *
 * const imgs = await sb.search('cat')
 *
 * // Log the images from the first page, then from the second
 * imgs.forEach(i => console.log(i.postView))
 * const imgs2 = await imgs.nextPage()
 * imgs2.forEach(i => console.log(i.postView))
 * ```
 */
export default class SearchResults extends Array<Post> {
  /** The booru used for this search */
  public booru: Booru
  /** The page of this search */
  public page: number
  /** The tags used for this search */
  public readonly tags: string[]
  /** The options used for this search */
  public readonly options: SearchParameters
  /** The posts from this search result */
  public readonly posts: Post[]

  /** @private */
  constructor(
    posts: Post[],
    tags: string[],
    options: SearchParameters,
    booru: Booru,
  ) {
    super(posts.length)

    for (let i = 0; i < posts.length; i++) {
      this[i] = posts[i]
    }

    this.posts = posts
    this.tags = tags
    this.options = options
    this.booru = booru
    this.page = options ? (options.page ?? 0) : 0
  }

  /**
   * Get the first post in this result set
   * @return {Post}
   */
  get first(): Post {
    return this[0]
  }

  /**
   * Get the last post in this result set
   * @return {Post}
   */
  get last(): Post {
    return this[this.length - 1]
  }

  /**
   * Get the next page
   * <p>Works like <code>sb.search('cat', {page: 1}); sb.search('cat', {page: 2})</code>
   * @return {Promise<SearchResults>}
   */
  public nextPage(): Promise<SearchResults> {
    const opts: SearchParameters = this.options
    opts.page = this.page + 1

    return this.booru.search(this.tags, opts)
  }

  /**
   * Create a new SearchResults with just images with the matching tags
   *
   * @param {String[]|String} tags The tags (or tag) to search for
   * @param {Object} options The extra options for the search
   * @param {Boolean} [options.invert=false] If the results should be inverted and
   *                                         return images *not* tagged
   * @return {SearchResults}
   */
  public tagged(
    tags: string[] | string,
    { invert = false } = {},
  ): SearchResults {
    const searchTags = Array.isArray(tags) ? tags : [tags]
    const posts: Post[] = []

    for (const p of this) {
      const m: number = Utils.compareArrays(searchTags, p.tags).length
      if ((!invert && m > 0) || (invert && m === 0)) {
        posts.push(p)
      }
    }

    return new SearchResults(posts, this.tags, this.options, this.booru)
  }

  /**
   * Returns a SearchResults with images *not* tagged with any of the specified tags (or tag)
   * @param {String[]|String} tags The tags (or tag) to blacklist
   * @return {SearchResults} The results without any images with the specified tags
   */
  public blacklist(tags: string[] | string): SearchResults {
    return this.tagged(tags, { invert: true })
  }
}
