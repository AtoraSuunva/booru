//@ts-check
class SearchResults extends Array {
  constructor(posts, tags, options, booru) {
    super(...posts)
    this._tags = tags
    this._options = options
    this.booru = booru
    this.page = options.page
  }

  get first() {
    return this[0]
  }

  get last() {
    return this[this.length - 1]
  }

  nextPage() {
    const opts = this._options
    opts.page = this.page + 1

    return this.booru.search(this._tags, opts)
  }
}
module.exports = SearchResults
