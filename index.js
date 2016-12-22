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

//Searches a site for images with tags and returns the results
//site  => String, the site to search
//tags  => Array , tags to search for
//limit => Int   , Number of results to return
//returns a promise
function search(site, tags = [], limit = 1) {
  return new Promise((resolve, reject) => {
    site = resolveSite(site)
    if (site === false) reject(new booruError('Site not supported'))

    switch (sites[site].api) {
      case '/post/index.json?':
      case '/posts.json?':
      case '/post.json?':
      case '/index.php?page=dapi&s=post&q=index&':
      case '/api/danbooru/find_posts/index.xml?':
        resolve(searchPosts(site, tags, limit)) //Quick (double)check to see if it's supported
      break;

      default:
        reject(new booruError('Something went horribly wrong somehow. Congrats you broke it!'))
    }

    reject(new booruError('This should never happen'))
  })
}

//Check if `site` is a supported site (and check if it's an alias and return the sites's true name)
//site => String, the site to resolve
//return false if site is not supported, the site otherwise
function resolveSite(sitessss) { // I should name this better
  for (let site in sites) {
    if (site === sitessss || sites[site].aliases.includes(sitessss)) {
      return site
    }
  }

  return false
}

//Actual searching code
//site  => String, full site url "e621.net"
//tags  => Array , an array of tags to add
//limit => Int   , Number of posts to fetch
//returns a promise with the response from teh site's api
function searchPosts (site, tags, limit) {
  let options = {
    uri: `http://${site}${sites[site].api}tags=${tags.join('+')}&limit=${limit}`, //nice me
    headers: {'User-Agent': 'Booru, a node package for booru searching (by AtlasTheBot)'},
    json: true // Automatically parses the JSON string
  }
  return rp(options).catch(err => {throw new booruError(err.error.message || err.error)})
}

//Takes an array of images and converts to json is needed, and add an extra property called "common" with a few common properties
//Allow you to simply use "images[2].common.tags" and get the tags instead of having to check if it uses .tags then realizing it doesn't
//then having to use "tag_string" instead and aaaa i hate xml aaaa

//images => Array, an array of images to commonfy
//returns the same array of images, but with each having a .common prop with some values
function commonfy(images) {
  return new Promise((resolve, reject) => {
    if (images[0] === undefined) reject(new booruError('You didn\'t give any images'))

    jsonfy(images).then(createCommon).then(resolve)
    .catch(e => {reject(new booruError('what are you doing stop. Only send images into this function: ' + e))})
  })
}

//fuck xml
//images => String, xml response
//returns JSON
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

//actually create the common property
//this will add

/*
common: {
  file_url: 'https://aaaa.com/image.jpg',  //The direct link to the image, ready to post
  id: '124125',                            //The image ID, as a string
  tags: ['cat', 'cute'],                   //The tags, split into an Array
  score: 5,                                //The score as a Number
  source: 'https://giraffedu.ck/aaaa.png', //source of the image, if supplied
  rating: 's'                              //rating of the image
}
*/

//images => Array, the images to add common props to
//site   => The site from which the images came from
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

module.exports.search = search //The actual search function
module.exports.commonfy = commonfy //do the thing
module.exports.sites  = sites  //Sites in case you want to see what it supports
module.exports.resolveSite = resolveSite //might as well /shrug
