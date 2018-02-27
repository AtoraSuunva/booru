//@ts-check

/**
 * @module BooruImage
 */

/**
 * The common properties of Images
 *
 * @typedef ImageCommon
 * @property {String} file_url The direct link to the image
 * @property {String} id The id of the post
 * @property {String[]} tags The tags of the image in an array
 * @property {Number} score The score of the image
 * @property {String} source Source of the image, if supplied
 * @property {String} rating  Rating of the image
 */

/**
 * An image from a booru with a few common props
 * @property {Object} data All the data given by the booru
 * @property {Booru} Booru The {@link Booru} it came from
 * @property {ImageCommon} _common The (cached) common properties of the image. Use .common instead.
 * @property {ImageCommon} common Contains several useful and common props for each booru
 *
 * @example
 *  common: {
 *    file_url: 'https://aaaa.com/image.jpg',
 *    id: '124125',
 *    tags: ['cat', 'cute'],
 *    score: 5,
 *    source: 'https://giraffeduck.com/aaaa.png',
 *    rating: 's'
 *  }
 */
class BooruImage {
  constructor(data, booru) {
    this.data = data
    this.booru = booru
    this._common = null
  }

  /**
   * An extra property called "common" with a few common properties
   * Allow you to simply use "<Image>.common.tags" and get the tags instead of having to check
   * if it uses .tags then realizing it doesn't then having to use "tag_string" instead
   *
   * @return {ImageCommon} The common items of the image
   */
  get common() {
    if (this._common) {
      return this._common
    }

    this._common = {}

    this._common.file_url = this.data.file_url || this.data.image
    this._common.id = this.data.id.toString()
    this._common.tags = ((this.data.tags !== undefined) ? this.data.tags.split(' ') : this.data.tag_string.split(' ')).map(v => v.replace(/,/g, '').replace(/ /g, '_'))
    this._common.tags = this._common.tags.filter(v => v !== '')
    this._common.score = parseInt(this.data.score)
    this._common.source = this.data.source
    this._common.rating = this.data.rating || /(safe|suggestive|questionable|explicit)/i.exec(this.data.tags)[0]

    // i just give up at this point
    if (this._common.rating === 'suggestive') this._common.rating = 'q'
    this._common.rating = this._common.rating.charAt(0)

    if (this._common.file_url === undefined) {
      this._common.file_url = this.data.source
    }

    // if the image's file_url is *still* undefined or the source is empty or it's deleted: don't use
    // thanks danbooru *grumble grumble*
    if (this._common.file_url === undefined ||
      this._common.file_url.trim() === '' ||
      this.data.is_deleted) {
      return this.common
    }

    if (this._common.file_url.startsWith('/data')) {
      this._common.file_url = 'https://danbooru.donmai.us' + this.data.file_url
    }

    if (this._common.file_url.startsWith('/cached')) {
      this._common.file_url = 'https://danbooru.donmai.us' + this.data.file_url
    }

    if (this._common.file_url.startsWith('/_images')) {
      this._common.file_url = 'https://dollbooru.org' + this.data.file_url
    }

    if (this._common.file_url.startsWith('//derpicdn.net')) {
      this._common.file_url = 'https:' + this.data.image
    }

    if (!this._common.file_url.startsWith('http')) {
      this._common.file_url = 'https:' + this.data.file_url
    }

    // lolibooru likes to shove all the tags into its urls, despite the fact you don't need the tags
    if (this._common.file_url.match(/https?:\/\/lolibooru.moe/)) {
      this._common.file_url =
        this.data.sample_url.replace(/(.*booru \d+ ).*(\..*)/, '$1sample$2')
    }

    return this._common
  }

  /**
   * Get the post view (url to the post) of this image
   * @return {String} The url to this image
   */
  get postView() {
    return this.booru.postView(this.data.id)
  }
}
module.exports = BooruImage
