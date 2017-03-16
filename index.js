//there is no god

//declare the dependencies
const rp = require('request-promise-native') //native since I want less dependencies to make this as lightweight as i can
const xml2js = require('xml2js') //for XML apis (Gelbooru pls)
const parser = new xml2js.Parser()
const sites = require('./sites.json')

//Custom error type so you know when you mess up or when I mess up
function booruError(message) {
  this.name = 'booruError';
  this.message = message || 'Atlas forgot to specify the error message, go yell at him';
  this.stack = (new Error()).stack;
}
booruError.prototype = Object.create(Error.prototype);
booruError.prototype.constructor = booruError;

//here we gooooo

/**
 * An image from a booru, has a few props and stuff
 * Properties vary per booru
 * @typedef  {Object} Image
 */

 /**
  * An image from a booru with a few common props
  * @typedef  {Object}   ImageCommon
  * @property {Object}   common          - Contains several useful and common props for each booru
  * @property {String}   common.file_url - The direct link to the image
  * @property {String}   common.id       - The id of the post
  * @property {String[]} common.tags     - The tags of the image in an array
  * @property {Number}   common.score    - The score of the image
  * @property {String}   common.source   - Source of the image, if supplied
  * @property {String}   common.rating   - Rating of the image
  *
  * @example
  *  common: {
  *    file_url: 'https://aaaa.com/image.jpg',
  *    id: '124125',
  *    tags: ['cat', 'cute'],
  *    score: 5,
  *    source: 'https://giraffedu.ck/aaaa.png',
  *    rating: 's'
  *  }
  */

/**
 * Search options to use with booru.search()
 * @typedef  {Object}  SearchOptions
 * @property {Number}  [limit=1] The number of images to return
 * @property {Boolean} [random=false] If it should randomly grab results
 */

/**
 * Searches a site for images with tags and returns the results
 * @param  {String}        site      The site to search
 * @param  {String[]}      [tags=[]] Tags to search with
 * @param  {SearchOptions}
 * @return {Promise}           A promise with the images as an array of objects
 *
 * @example
 * booru.search('e926', ['glaceon', 'cute'])
 * //returns a promise with the latest cute glace pic from e926
 */
function search(site, tags = [], {limit = 1, random = false} = {}) {
  return new Promise((resolve, reject) => {
    site = resolveSite(site)
    limit = parseInt(limit)

    if (site === false) return reject(new booruError('Site not supported'))
    if (!(tags instanceof Array)) return reject(new booruError('`tags` should be an array'))
    if (typeof limit !== 'number' && !Number.isNaN(limit)) return reject(new booruError('`limit` should be an int'))


    resolve( searchPosts(site, tags, {limit, random}) )
  })
}

/**
 * Check if `site` is a supported site (and check if it's an alias and return the sites's true name)
 * @param  {String}           siteToResolve The site to resolveSite
 * @return {(String|Boolean)}               False if site is not supported, the site otherwise
 */
function resolveSite(siteToResolve) {
  if (typeof siteToResolve !== 'string')
    return false

  siteToResolve = siteToResolve.toLowerCase()
  for (let site in sites) {
    if (site === siteToResolve || sites[site].aliases.includes(siteToResolve)) {
      return site
    }
  }

  return false
}

/**
 * Actual searching code
 * @private
 * @param  {String}  site   The full site url, name + tld
 * @param  {Array}   tags   The array of tags to search for
 * @param  {Number}  limit  Number of posts to fetch
 * @param  {searchOptions}
 * @return {Promise}        Response with the site's api
 */
function searchPosts(site, tags, {limit = 1, random = false} = {}) {
  return new Promise((resolve, reject) => {
    let options = {
      uri: `http://${site}${sites[site].api}tags=${tags.join('+')}&limit=${limit}`, //nice me
      headers: {'User-Agent': 'Booru, a node package for booru searching (by AtlasTheBot)'},
      json: true // Automatically parses the JSON string
    }

    if (!random)
      resolve(rp(options).catch(err => {throw new booruError(err.error.message || err.error)}))
    //if not we use some random search magic

    if (sites[site].random) {
      options.uri = `http://${site}${sites[site].api}tags=order:random+${tags.join('+')}&limit=${limit}`
      resolve(rp(options).catch(err => {throw new booruError(err.error.message || err.error)}))
    } else {
      options.uri = `http://${site}${sites[site].api}tags=${tags.join('+')}&limit=100`
      resolve(
        rp(options)
        .then(jsonfy)
        .then(images => new Promise(
          res => res(shuffle(images).slice(0, limit))
        )) //i regret nothing
      )

      .catch(err => {throw new booruError(err.error.message || err.error)})
    }

  })
}

/**
 * Takes an array of images and converts to json is needed, and add an extra property called "common" with a few common properties
 * Allow you to simply use "images[2].common.tags" and get the tags instead of having to check if it uses .tags then realizing it doesn't
 * then having to use "tag_string" instead and aaaa i hate xml aaaa
 * @param  {Image[]}       images Array of {@link Image} objects
 * @return {ImageCommon[]}        Array of {@link ImageCommon} objects
 */
function commonfy(images) {
  return new Promise((resolve, reject) => {
    if (images[0] === undefined) reject(new booruError('You didn\'t give any images'))

    jsonfy(images).then(createCommon).then(resolve)
    .catch(e => {reject(new booruError('what are you doing stop. Only send images into this function: ' + e))})
  })
}

//fuck xml
/**
 * Fuck xml
 * @private
 * @param  {Image[]} images The images to convert to jsonfy
 * @return {Image[]}        The images in JSON format
 */
function jsonfy(images) {
  return new Promise((resolve, reject) => {
    if (typeof images !== 'object') { //fuck xml
      parser.parseString(images, (err, res) => {
        if (err) throw err
        if (res.posts.post === undefined) {
          resolve([])
        } else {
          resolve(res.posts.post.map(val => {return val.$})) //fuck xml
        }
      })
    } else {
      resolve(images)
    }
  })
}
//fuck xml

/**
 * Create the .common property for each {@link Image} passed
 * @param  {Image[]}       images The images to add common props to
 * @return {ImageCommon[]}        The images with common props added
 */
function createCommon(images) {
  return new Promise((resolve, reject) => {
    if (images === []) resolve([])
    for (let image in images) {
      images[image].common = {}

      images[image].common.file_url    = images[image].file_url
      images[image].common.id          = images[image].id.toString()
      images[image].common.tags        = (images[image].tags !== undefined) ? images[image].tags.split(' ') : images[image].tag_string.split(' ')
      images[image].common.tags        = images[image].common.tags.filter(v => {return v !== ''})
      images[image].common.score       = parseInt(images[image].score)
      images[image].common.source      = images[image].source
      images[image].common.rating      = images[image].rating

      if (images[image].common.file_url.startsWith('/data')) images[image].common.file_url    = 'https://danbooru.donmai.us' + images[image].file_url
      if (images[image].common.file_url.startsWith('/_images')) images[image].common.file_url    = 'https://dollbooru.org' + images[image].file_url
      if (!images[image].common.file_url.startsWith('http')) images[image].common.file_url    = 'https:' + images[image].file_url
    }
    resolve(images)
  })
}

/**
 * Yay fisher-bates
 * Taken from http://stackoverflow.com/a/2450976
 * @param  {Array} array Array of something
 * @return {Array}       Shuffled array of something
 */
function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
  return array;
}

module.exports.search = search //The actual search function
module.exports.commonfy = commonfy //do the thing
module.exports.sites  = sites  //Sites in case you want to see what it supports
module.exports.resolveSite = resolveSite //might as well /shrug

//shoutout to simpleflips
