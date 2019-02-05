//@ts-check

const Booru = require('../boorus/Booru.js')

/**
 * An image from a booru with a few common props
 *
 * @example
 * Post {
 *  file_url: 'https://aaaa.com/image.jpg',
 *  id: '124125',
 *  tags: ['cat', 'cute'],
 *  score: 5,
 *  source: 'https://giraffeduck.com/aaaa.png',
 *  rating: 's'
 * }
 */
class Post {
  /**
   * Create an image from a booru
   *
   * @param {Object} data The raw data from the Booru
   * @param {Booru} booru The booru that created the image
   */
  constructor(data, booru) {
    /**
     * All the data given by the booru
     * @type {Object}
     * @private
     */
    this._data = data

    /**
     * The {@link Booru} it came from
     * @type {Booru}
     */
    this.booru = booru

    /**
     * The direct link to the image
     * @type {String}
     */
    this.file_url = parseImageUrl(data.file_url || data.image || data.source, data, booru)

    /**
     * The height of this image
     * @type {Number}
     */
    this.height = parseInt(data.height || data.image_height)
    /**
     * The width of this image
     * @type {Number}
     */
    this.width = parseInt(data.width || data.image_width)

    /**
     * The url to the medium-sized image (if available)
     * @type {String?}
     */
    this.sample_url = parseImageUrl(data.sample_url || data.large_file_url ||
      (data.representations ? data.representations.large : undefined), data)
    /**
     * The height of the medium-sized image (if available)
     * @type {Number?}
     */
    this.sample_height = parseInt(data.sample_height)
    /**
     * The width of the medium-sized image (if available)
     * @type {Number?}
     */
    this.sample_width = parseInt(data.sample_width)

    /**
     * The url to the smallest image (if available)
     * @type {String?}
     */
    this.preview_url = parseImageUrl(data.preview_url || data.preview_file_url ||
      (data.representations ? data.representations.small : undefined), data)
    /**
     * The height of the smallest image (if available)
     * @type {Number?}
     */
    this.preview_height = parseInt(data.preview_height)
    /**
     * The width of the smallest image (if available)
     * @type {Number?}
     */
    this.preview_width = parseInt(data.preview_width)

    /**
     * The id of this post
     * @type {String}
     */
    this.id = data.id.toString()
    /**
     * The tags of the post
     * @type {String[]}
     */
    this.tags = (data.tags) ? data.tags.split(' ') : data.tag_string.split(' ').map(v => v.replace(/,/g, '').replace(/ /g, '_'))
    this.tags = this.tags.filter(v => v !== '')
    /**
     * The score of this post
     * @type {Number}
     */
    this.score = parseInt(data.score)
    /**
     * The source of this post (if available)
     * @type {String?}
     */
    this.source = data.source
    /**
     * The rating of the image, as just the first letter (s/q/e/u)
     * @type {String}
     */
    this.rating = data.rating || /(safe|suggestive|questionable|explicit)/i.exec(data.tags) || 'u'

    if (Array.isArray(this.rating)) {
      this.rating = this.rating[0]
    }

    // thanks derpibooru
    if (this.rating === 'suggestive') {
      this.rating = 'q'
    }

    this.rating = this.rating.charAt(0)

    /**
     * The date the post was created at
     * @type {Date}
     */
    this.createdAt = null
    if (typeof data.created_at === 'object') {
      this.createdAt = new Date((data.created_at.s * 1000) + (data.created_at.n / 1000000000))
    } else if (typeof data.created_at === 'number') {
      this.createdAt = new Date(data.created_at * 1000)
    } else {
      this.createdAt = new Date(data.created_at || data.date)
    }

  }

  /**
   * Get the post view (url to the post) of this image
   *
   * @type {String}
   * @example
   *
   * const e9 = new Booru('e9')
   * const imgs = e9.search(['cat', 'dog'])
   *
   * // Log the post url of the first image
   * console.log(imgs[0].postView)
   */
  get postView() {
    return this.booru.postView(this.id)
  }

  /**
   * Get some common props on the image
   *
   * @deprecated All common props are now attached directly to the image
   * @type {Object}
   *
   * @example
   * image.common.id
   * // deprecated, use this instead
   * image.id
   *
   * // To access the image's raw data from the booru, do
   * image._data.id
   */
  get common() {
    return this
  }
}
module.exports = Post

function parseImageUrl(url, data, booru) {
  // if the image's file_url is *still* undefined or the source is empty or it's deleted
  // thanks danbooru *grumble grumble*
  if (url === undefined || url.trim() === '' || data.is_deleted) {
    return null
  }

  if (url.startsWith('/data')) {
    url = 'https://danbooru.donmai.us' + url
  }

  if (url.startsWith('/cached')) {
    url = 'https://danbooru.donmai.us' + url
  }

  if (url.startsWith('/_images')) {
    url = 'https://dollbooru.org' + url
  }

  if (url.startsWith('//derpicdn.net')) {
    url = 'https:' + data.image
  }

  // Why???
  if (!data.file_url && data.directory) {
    url = '//' + booru.domain + '/images/' + data.directory + '/' + data.image
  }

  if (!url.startsWith('http')) {
    url = 'https:' + url
  }

  // lolibooru likes to shove all the tags into its urls, despite the fact you don't need the tags
  if (url.match(/https?:\/\/lolibooru.moe/)) {
    url = data.sample_url.replace(/(.*booru \d+ ).*(\..*)/, '$1sample$2')
  }

  return encodeURI(url)
}
