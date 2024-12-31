/**
 * @packageDocumentation
 * @module Structures
 */

/**
 * Just an interface for {@link Booru}'s search params :)
 */
export default interface SearchParameters {
  /** The limit on *max* posts to show, you might get less posts than this */
  limit?: number | undefined
  /** Should posts be in random order, implementation differs per booru */
  random?: boolean | undefined
  /** Which page of results to fetch */
  page?: number | undefined
  /** Return unavailable posts (ie. banned/deleted posts) */
  showUnavailable?: boolean | undefined
}
