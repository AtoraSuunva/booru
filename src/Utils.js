//@ts-check

/**
 * @module Utils
 */

/*
- Utils
  => .resolveSite(site/alias)
  => .jsonfy([images])
  => .shuffle([arr])
  => .randInt(min, max)
*/

const {
  sites
} = require('./Constants.js')

// For XML only apis
const xml2js = require('xml2js')
const parser = new xml2js.Parser()

/**
 * Check if `site` is a supported site (and check if it's an alias and return the sites's true name)
 * @param  {String}           siteToResolve The site to resolveSite
 * @return {(String|Boolean)}               False if site is not supported, the site otherwise
 */
module.exports.resolveSite = function resolveSite(siteToResolve) {
  if (typeof siteToResolve !== 'string') {
    return false
  }

  siteToResolve = siteToResolve.toLowerCase()

  for (let site in sites) {
    if (site === siteToResolve || sites[site].aliases.includes(siteToResolve)) {
      return site
    }
  }

  return false
}

/**
 * Parses xml to json, which can be used with js
 * @private
 * @param  {String[]} xml The xml to convert to json
 * @return {Object[]}     An array of objects created from the xml
 */
module.exports.jsonfy = function jsonfy(xml) {
  // If it's an object, assume it's already jsonfied
  if (typeof xml !== 'object') {
    parser.parseString(xml, (err, res) => {
      if (err)
        throw err

      if (res.posts.post !== undefined) {
        return res.posts.post.map(val => val.$)
      } else {
        return []
      }
    })
  } else return xml
}


/**
 * Yay fisher-bates
 * Taken from http://stackoverflow.com/a/2450976
 * @private
 * @param  {Array} array Array of something
 * @return {Array}       Shuffled array of something
 */
module.exports.shuffle = function shuffle(array) {
  let currentIndex = array.length
  let temporaryValue
  let randomIndex

  // While there remain elements to shuffle...
  while (currentIndex !== 0) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex)
    currentIndex -= 1
    // And swap it with the current element.
    temporaryValue = array[currentIndex]
    array[currentIndex] = array[randomIndex]
    array[randomIndex] = temporaryValue
  }
  return array
}

// Thanks mdn and damnit derpibooru
/**
 * Generate a random int between [min, max]
 * @private
 * @param {Number} min The minimum (inclusive)
 * @param {Number} max The maximum (inclusive)
 */
module.exports.randInt = function randInt(min, max) {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min + 1)) + min
}
