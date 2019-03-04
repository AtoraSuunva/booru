import SearchParameters from './SearchParameters'

/**
 * Interface for {@link Booru}'s **private internal** search params pls no use
 */

/**
 * @param {Number?} [searchArgs.fakeLimit] If the `order:random` should be faked
 * @param {String[]|String} [searchArgs.tags] The tags used on the search
 * @param {Number} [searchArgs.limit] The number of images to return
 * @param {Boolean} [searchArgs.random] If it should randomly grab results
 * @param {Number} [searchArgs.page] The page number searched
 */
export default interface InternalSearchParameters extends SearchParameters {
  /** The uri to override with, if provided */
  uri?: string | null
  /** If `order:random` should be faked */
  fakeLimit?: number
  /** The tags used in the search */
  tags?: string[] | string
}
