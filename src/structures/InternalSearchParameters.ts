/**
 * @packageDocumentation
 * @module Structures
 */

import { BooruCredentials } from '../boorus/Booru'
import type SearchParameters from './SearchParameters'

/**
 * Interface for {@link Booru}'s **private internal** search params pls no use
 */

export default interface InternalSearchParameters extends SearchParameters {
  /** The uri to override with, if provided */
  uri?: string | null
  /** If `order:random` should be faked */
  fakeLimit?: number
  /** The tags used in the search */
  tags?: string[]
  /** Credentials to use for the request */
  credentials?: BooruCredentials
}
