/**
 * @packageDocumentation
 * @module Structures
 */

import type Booru from '../boorus/Booru'

/**
 * A tag from a booru with a few common props
 *
 * @example
 * ```
 * Tag {
 * name: 'tag_name',
 * count: 1234,
 * type: 0,
 * ambiguous: false,
 * }
 * ```
 */
export default class Tag {
  /** The {@link Booru} it came from */
  public booru: Booru
  /** The id of the tag */
  public id: number | string
  /** The name of the tag */
  public name: string
  /** The count of the tag */
  public count: number
  /** If the tag is a meta tag */
  public type: number
  /** If the tag is ambiguous */
  public ambiguous?: boolean | null

  /** All the data given by the booru @private */
  protected data: any

  /**
   * Create a new tag from the data given by the booru
   *
   * @param data The data from the booru
   * @param booru The booru this tag is from
   */
  constructor(data: any, booru: Booru) {
    this.data = data
    this.booru = booru

    this.id = data.id
    this.name = data.name
    this.count = data.count ?? data.post_count ?? 0
    this.type = data.type ?? data.category ?? 0
    this.ambiguous = data.ambiguous ? data.ambiguous !== 'false' : null
  }
}
