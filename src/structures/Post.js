//@ts-check

/**
 * An image from a booru with a few common props
 * @prop {Object} _data All the data given by the booru
 * @prop {Booru} booru The {@link Booru} it came from
 * @prop {String} id The id of the post
 *
 * @prop {String} file_url The direct link to the image
 * @prop {Number} height The height of the full image
 * @prop {Number} width The width of the full image
 *
 * @prop {String[]} tags The tags of the image in an array
 * @prop {Number} score The score of the image
 * @prop {String} source Source of the image, if supplied
 * @prop {String} rating  Rating of the image
 *
 * @prop {Date} createdAt The date it was created at
 *
 * @prop {String} preview_url The smallest image size available
 * @prop {Number?} preview_height The height of the preview image
 * @prop {Number?} preview_width The width of the preview image
 *
 * @prop {String?} sample_url The medium image size available
 * @prop {Number?} sample_height The height of the sample image
 * @prop {Number?} sample_width The width of the preview image
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
   * @param {IBooru} booru The booru that created the image
   */
  constructor(data, booru) {
    this._data = data
    this.booru = booru

    this.file_url = parseImageUrl(data.file_url || data.image || data.source, data)
    this.height = parseInt(data.height || data.image_height)
    this.width = parseInt(data.width || data.image_width)

    this.sample_url = parseImageUrl(data.sample_url || data.large_file_url ||
      data.representations ? data.representations.large : undefined, data)
    this.sample_height = parseInt(data.sample_height)
    this.sample_width = parseInt(data.sample_width)

    this.preview_url = parseImageUrl(data.preview_url || data.preview_file_url ||
      data.representations ? data.representations.small : undefined, data)
    this.preview_height = parseInt(data.preview_height)
    this.preview_width = parseInt(data.preview_width)

    this.id = data.id.toString()
    this.tags = ((data.tags !== undefined) ? data.tags.split(' ') : data.tag_string.split(' ')).map(v => v.replace(/,/g, '').replace(/ /g, '_'))
    this.tags = this.tags.filter(v => v !== '')
    this.score = parseInt(data.score)
    this.source = data.source
    this.rating = data.rating || /(safe|suggestive|questionable|explicit)/i.exec(data.tags)[0]

    // i just give up at this point
    if (this.rating === 'suggestive') {
      this.rating = 'q'
    }
    this.rating = this.rating.charAt(0)

    if (typeof data.created_at === 'object') {
      this.createdAt = new Date((data.created_at.s * 1000) + (data.created_at.n / 1000000000))
    } else if (typeof data.created_at === 'number') {
      this.createdAt = new Date(data.created_at * 1000)
    } else {
      this.createdAt = new Date(data.created_at)
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

function parseImageUrl(url, data) {
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

  if (!url.startsWith('http')) {
    url = 'https:' + url
  }

  // lolibooru likes to shove all the tags into its urls, despite the fact you don't need the tags
  if (url.match(/https?:\/\/lolibooru.moe/)) {
    url = data.sample_url.replace(/(.*booru \d+ ).*(\..*)/, '$1sample$2')
  }

  return url
}
