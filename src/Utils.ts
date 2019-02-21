/*
- Utils
  => .resolveSite(site/alias)
  => .jsonfy([images])
  => .shuffle([arr])
  => .randInt(min, max)
*/

import { sites, BooruError } from './Constants'

// For XML only apis
const xml2js = require('xml2js')
const parser = new xml2js.Parser()

/**
 * Check if `site` is a supported site (and check if it's an alias and return the sites's true name)
 *
 * @param  {String} domain The site to resolveSite
 * @return {String?} null if site is not supported, the site otherwise
 */
export function resolveSite(domain: string): string|null {
  if (typeof domain !== 'string') {
    return null
  }

  domain = domain.toLowerCase()

  for (let site in sites) {
    if (site === domain || sites[site].aliases.includes(domain)) {
      return site
    }
  }

  return null
}

/**
 * Parses xml to json, which can be used with js
 *
 * @private
 * @param  {String} xml The xml to convert to json
 * @return {Promise<Object[]>} A Promise with an array of objects created from the xml
 */
export function jsonfy(xml: string): Promise<object[]> {
  return new Promise((resolve, reject) => {
    // If it's an object, assume it's already jsonfied
    if (typeof xml === 'object') {
      resolve(xml)
    }

    parser.parseString(xml, (err: Error|null, res: any) => {
      if (err) reject(err)

      if (res.posts.post !== undefined) {
        resolve(res.posts.post.map((val: any) => val.$))
      } else {
        resolve([])
      }
    })
  })
}


/**
 * Yay fisher-bates
 * <p>Taken from http://stackoverflow.com/a/2450976
 *
 * @private
 * @param  {Array} array Array of something
 * @return {Array}       Shuffled array of something
 */
export function shuffle<T>(array: T[]): T[] {
  let currentIndex: number = array.length
  let temporaryValue: T
  let randomIndex: number

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
 *
 * @private
 * @param {Number} min The minimum (inclusive)
 * @param {Number} max The maximum (inclusive)
 */
export function randInt(min: number, max: number): number {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min + 1)) + min
}

/**
 * Performs some basic search validation
 *
 * @private
 * @param {String} site The site to resolve
 * @param {Number|String} limit The limit for the amount of images to fetch
 */
export function validateSearchParams(site: string, limit: number|string): {site: string, limit: number} {
  const resolvedSite = resolveSite(site)

  if (typeof limit !== 'number')
    limit = parseInt(limit)

  if (resolvedSite === null)
    throw new BooruError('Site not supported')

  if (typeof limit !== 'number' || Number.isNaN(limit))
    throw new BooruError('`limit` should be an int')

  return { site: resolvedSite, limit }
}

/**
 * Finds the matching strings between two arrays
 *
 * @private
 * @param {String[]} arr1 The first array
 * @param {String[]} arr2 The second array
 * @return {String[]} The shared strings between the arrays
 */
export function compareArrays(arr1: string[], arr2: string[]): string[] {
  const matches: string[] = []
  arr1.forEach(ele1 => {
    arr2.forEach(ele2 => {
      if (ele1.toLowerCase() === ele2.toLowerCase()) {
        matches.push(ele1)
      }
    })
  })

  return matches
}
