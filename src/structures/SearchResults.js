//@ts-check

const Booru = require('../boorus/Booru.js')
const Post = require('../structures/Post.js')
const Utils = require('../Utils.js')

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
    /**
     * The tags used for this search
     * @type {String[]}
     */
    this._tags = tags
    /**
     * The options used for this search
     * @type {Object}
     */
    this._options = options
    /**
     * The booru used for this search
     * @type {Booru}
     */
    this.booru = booru
    /**
     * The page of this search
     * @type {Number}
     */
    this.page = options.page
  }

  /**
   * Get the first post in this result set
   * @return {Post}
   */
  get first() {
    return this[0]
  }

  /**
   * Get the last post in this result set
   * @return {Post}
   */
  get last() {
    return this[this.length - 1]
  }

  /**
   * Get the next page
   * <br>Works like <code>sb.search('cat', {page: 1}); sb.search('cat', {page: 2})</code>
   * @return {Promise<SearchResults>}
   */
  nextPage() {
    const opts = this._options
    opts.page = this.page + 1

    return this.booru.search(this._tags, opts)
  }

  /**
   * Create a new SearchResults with just images with the matching tags
   *
   * @param {String[]|String} tags The tags (or tag) to search for
   * @param {Object} options The extra options for the search
   * @param {Boolean} [options.invert=false] If the results should be inverted and return images *not* tagged
   * @return {SearchResults}
   */
  tagged(tags, {invert = false} = {}) {
    if (!Array.isArray(tags)) {
      tags = [tags]
    }

    const posts = []

    for (let p of this) {
      const m = Utils.compareArrays(tags, p.tags).length
      if ((!invert && m > 0) || (invert && m === 0)) {
        posts.push(p)
      }
    }

    return new SearchResults(posts, this._tags, this._options, this.booru)
  }

  /**
   * Returns a SearchResults with images *not* tagged with any of the specified tags (or tag)
   * @param {String[]|String} tags The tags (or tag) to blacklist
   * @return {SearchResults} The results without any images with the specified tags
   */
  blacklist(tags) {
    return this.tagged(tags, {invert: true})
  }
}
module.exports = SearchResults
