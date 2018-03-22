//@ts-check

/**
 * Represents a page of search results, works like an array of {@link Post}
 * <br> Usable like an array and allows to easily get the next page
 *
 * @example
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
 */
class SearchResults extends Array {
  /** @private */
  constructor(posts, tags, options, booru) {
    super(...posts)
    this._tags = tags
    this._options = options
    this.booru = booru
    this.page = options.page
  }

  /**
   * Get the first image in this result set
   */
  get first() {
    return this[0]
  }

  /**
   * Get the last image in this result set
   */
  get last() {
    return this[this.length - 1]
  }

  /**
   * Get the next page
   * <br>Works like <code>sb.search('cat', {page: 1}); sb.search('cat', {page: 2})</code>
   */
  nextPage() {
    const opts = this._options
    opts.page = this.page + 1

    return this.booru.search(this._tags, opts)
  }

  //TODO: Add methods like "tagged(tags: Array|String)" or "blacklist(tags: Array|String)" ??
}
module.exports = SearchResults
