/**
 * @packageDocumentation
 * @module Structures
 */

/**
 * Just an interface for {@link Booru}'s tag list params :)
 */
export default interface SearchParameters {
  /** The limit on *max* tags to show, you might get less tags than this */
  limit?: number | undefined
  /** Which page of results to fetch */
  page?: number | undefined
}
