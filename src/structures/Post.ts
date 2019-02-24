import { deprecate } from 'util';
import Booru from '../boorus/Booru';

// tslint:disable-next-line:no-empty
const common = deprecate(() => {
}, 'Common is now deprecated, just access the properties directly');

/**
 * Tries to figure out what the image url should be
 *
 * @param {string} url   why
 * @param {*}      data  boorus
 * @param {Booru}  booru so hard
 */
const parseImageUrl = (url: string, data: any, booru: Booru): string | null => {
  // If the image's file_url is *still* undefined or the source is empty or it's deleted
  // Thanks danbooru *grumble grumble*
  if (!url || url.trim() === '' || data.is_deleted) {
    return null;
  }

  if (url.startsWith('/data')) {
    url = `https://danbooru.donmai.us${url}`;
  }

  if (url.startsWith('/cached')) {
    url = `https://danbooru.donmai.us${url}`;
  }

  if (url.startsWith('/_images')) {
    url = `https://dollbooru.org${url}`;
  }

  if (url.startsWith('//derpicdn.net')) {
    url = `https:${data.image}`;
  }

  // Why???
  if (!data.file_url && data.directory) {
    url = `//${booru.domain}/images/${data.directory}/${data.image}`;
  }

  if (!url.startsWith('http')) {
    url = `https:${url}`;
  }

  // Lolibooru likes to shove all the tags into its urls, despite the fact you don't need the tags
  if (url.match(/https?:\/\/lolibooru.moe/)) {
    url = data.sample_url.replace(/(.*booru \d+ ).*(\..*)/, '$1sample$2');
  }

  return encodeURI(url);
};

/**
 * An image from a booru with a few common props
 *
 * @example
 * Post {
 *  fileUrl: 'https://aaaa.com/image.jpg',
 *  id: '124125',
 *  tags: ['cat', 'cute'],
 *  score: 5,
 *  source: 'https://giraffeduck.com/aaaa.png',
 *  rating: 's'
 * }
 */
export default class Post {

  /** The {@link Booru} it came from */
  public booru: Booru;
  /** The direct link to the file */
  public fileUrl: string | null;
  /** The height of the file */
  public height: number;
  /** The width of the file */
  public width: number;
  /** The url to the medium-sized image (if available) */
  public sampleUrl: string | null;
  /** The height of the medium-sized image (if available) */
  public sampleHeight: number | null;
  /** The width of the medium-sized image (if available) */
  public sampleWidth: number | null;
  /** The url to the smallest image (if available) */
  public previewUrl: string | null;
  /** The height of the smallest image (if available) */
  public previewHeight: number | null;
  /** The width of the smallest image (if available) */
  public previewWidth: number | null;
  /** The id of this post */
  public id: string;
  /** The tags of this post */
  public tags: string[];
  /** The score of this post */
  public score: number;
  /** The source of this post, if available */
  public source?: string;
  /** The rating of the image, as just the first letter (s/q/e/u) => safe/questionable/explicit/unrated */
  public rating: string;
  /** The Date this post was created at */
  public createdAt?: Date | null;
  /** All the data given by the booru @private */
  protected data: any;

  /**
   * Create an image from a booru
   *
   * @param {Object} data The raw data from the Booru
   * @param {Booru} booru The booru that created the image
   */
  constructor (data: any, booru: Booru) {
    this.data = data;
    this.booru = booru;

    this.fileUrl = parseImageUrl(data.file_url || data.image || data.source, data, booru);

    this.height = parseInt(data.height || data.image_height, 10);
    this.width = parseInt(data.width || data.image_width, 10);

    this.sampleUrl = parseImageUrl(data.sample_url || data.large_file_url ||
      (data.representations ? data.representations.large : undefined), data, booru);
    this.sampleHeight = parseInt(data.sample_height, 10);
    this.sampleWidth = parseInt(data.sample_width, 10);

    this.previewUrl = parseImageUrl(data.preview_url || data.preview_file_url ||
      (data.representations ? data.representations.small : undefined), data, booru);
    this.previewHeight = parseInt(data.preview_height, 10);
    this.previewWidth = parseInt(data.preview_width, 10);

    this.id = data.id.toString();
    this.tags = ((data.tags)
        ? data.tags.split(' ')
        : data.tag_string.split(' ').map((v: string): string => v.replace(/,/g, '').replace(/ /g, '_'))
    ).filter((v: string) => v !== '');

    this.score = parseInt(data.score, 10);
    this.source = data.source;
    this.rating = data.rating || /(safe|suggestive|questionable|explicit)/i.exec(data.tags) || 'u';

    if (Array.isArray(this.rating)) {
      this.rating = this.rating[0];
    }

    // Thanks derpibooru
    if (this.rating === 'suggestive') {
      this.rating = 'q';
    }

    this.rating = this.rating.charAt(0);

    this.createdAt = null;
    // tslint:disable-next-line:prefer-conditional-expression
    if (typeof data.created_at === 'object') {
      this.createdAt = new Date((data.created_at.s * 1000) + (data.created_at.n / 1000000000));
    } else if (typeof data.created_at === 'number') {
      this.createdAt = new Date(data.created_at * 1000);
    } else {
      this.createdAt = new Date(data.created_at || data.date);
    }
  }

  /**
   * The direct link to the file
   * <p>It's prefered to use `.fileUrl` instead because camelCase
   */
  get file_url (): string | null {
    return this.fileUrl;
  }

  /**
   * The url to the medium-sized image (if available)
   * <p>It's prefered to use `.sampleUrl` instead because camelCase
   */
  get sample_url (): string | null {
    return this.sampleUrl;
  }

  /**
   * The height of the medium-sized image (if available)
   * <p>It's prefered to use `.sampleHeight` instead because camelCase
   */
  get sample_height (): number | null {
    return this.sampleHeight;
  }

  /**
   * The width of the medium-sized image (if available)
   * <p>It's prefered to use `.sampleWidth` instead because camelCase
   */
  get sample_width (): number | null {
    return this.sampleWidth;
  }

  /**
   * The url to the smallest image (if available)
   * <p>It's prefered to use `.previewUrl` instead because camelCase
   */
  get preview_url (): string | null {
    return this.previewUrl;
  }

  /**
   * The height of the smallest image (if available)
   * <p>It's prefered to use `.previewHeight` instead because camelCase
   */
  get preview_height (): number | null {
    return this.previewHeight;
  }

  /**
   * The width of the smallest image (if available)
   * <p>It's prefered to use `.previewWidth` instead because camelCase
   */
  get preview_width (): number | null {
    return this.previewWidth;
  }

  /**
   * Get the post view (url to the post) of this image
   *
   * @type {String}
   * @example
   *
   * const e9 = Booru('e9')
   * const imgs = e9.search(['cat', 'dog'])
   *
   * // Log the post url of the first image
   * console.log(imgs[0].postView)
   */
  get postView (): string {
    return this.booru.postView(this.id);
  }

  /**
   * Get some common props on the image
   *
   * @deprecated All common props are now attached directly to the image
   * @type {Object}
   *
   * @example
   * image.id
   * // deprecated, use this instead
   * image.id
   *
   * // To access the post's raw data from the booru, do
   * image._data.id
   */
  get common (): this {
    common();
    return this;
  }
}
