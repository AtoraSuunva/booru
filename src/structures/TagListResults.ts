/**
 * @packageDocumentation
 * @module Structures
 */

import type Booru from '../boorus/Booru'
import type Tag from './Tag'
import type TagListParameters from './TagListParameters'

/**
 * Represents a page of tag list results, works like an array of {@link Tag}
 * <p> Usable like an array and allows to easily get the next page
 *
 * @example
 * ```
 * const Booru = require('booru')
 * // Safebooru
 * const sb = new Booru('sb')
 *
 * const tags = await sb.tagList()
 *
 * // Log the tags from the first page, then from the second
 * tags.forEach(t => console.log(t.name))
 * const tags2 = await tags.nextPage()
 * tags2.forEach(t => console.log(t.name))
 * ```
 */
export default class TagListResults extends Array<Tag> {
  /** The booru used for this tag list */
  public booru: Booru
  /** The page of this tag list */
  public page: number
  /** The options used for this tag list */
  public readonly options: TagListParameters
  /** The tags from this tag list result */
  public readonly tags: Tag[]

  /** @private */
  constructor(tags: Tag[], options: TagListParameters, booru: Booru) {
    super(tags.length)

    for (let i = 0; i < tags.length; i++) {
      this[i] = tags[i]
    }

    this.tags = tags
    this.options = options
    this.booru = booru
    this.page = options ? (options.page ?? 0) : 0
  }

  /**
   * Get the first tag in this result set
   * @return {Tag}
   */
  get first(): Tag {
    return this[0]
  }

  /**
   * Get the last tag in this result set
   * @return {Tag}
   */
  get last(): Tag {
    return this[this.length - 1]
  }

  /**
   * Get the next page of results
   * @returns {Promise<TagListResults>} The next page of results
   */
  public async nextPage(): Promise<TagListResults> {
    const nextPage = this.page + 1
    const newTags = await this.booru.tagList({
      limit: this.options.limit,
      page: nextPage,
    })
    return new TagListResults(
      newTags,
      { ...this.options, page: nextPage },
      this.booru,
    )
  }
}
