/**
 * @packageDocumentation
 * @module Structures
 */

import { BooruCredentials } from '../boorus/Booru'

/**
 * Just an interface for {@link Booru}'s search params :)
 */
export default interface SearchParameters {
  /** The limit on *max* posts to show, you might get less posts than this */
  limit?: number
  /** Should posts be in random order, implementation differs per booru */
  random?: boolean
  /** Which page of results to fetch */
  page?: number
  /** The credentials to use to auth with the booru */
  credentials?: BooruCredentials
  /** Return unavailable posts (ie. banned/deleted posts) */
  showUnavailable?: boolean
}
