/**
 * @packageDocumentation
 * @module Utils
 */

import { BooruError, sites } from './Constants'

import { parse as xml2json } from 'fast-xml-parser'

/**
 * Check if `site` is a supported site (and check if it's an alias and return the sites's true name)
 *
 * @param  {String} domain The site to resolveSite
 * @return {String?} null if site is not supported, the site otherwise
 */
export function resolveSite(domain: string): string | null {
  if (typeof domain !== 'string') {
    return null
  }

  domain = domain.toLowerCase()

  for (const site in sites) {
    if (site === domain || sites[site].aliases.includes(domain)) {
      return site
    }
  }

  return null
}

interface XMLPage {
  html: any
}

interface XMLPosts {
  post?: any[]
  tag?: any | any[]
}

interface BooruXML {
  html?: XMLPage
  '!doctype'?: XMLPage
  posts: XMLPosts
}

/**
 * Parses xml to json, which can be used with js
 *
 * @private
 * @param  {String} xml The xml to convert to json
 * @return {Object[]} A Promise with an array of objects created from the xml
 */
export function jsonfy(xml: string): object[] {
  if (typeof xml === 'object') return xml

  const data = xml2json(xml, {
    ignoreAttributes: false,
    attributeNamePrefix: '',
  }) as BooruXML

  if (data.html || data['!doctype']) {
    // Some boorus return HTML error pages instead of JSON responses on errors
    // So try scraping off what we can in that case
    const page = data.html || data['!doctype']?.html
    const message = []
    if (page.body.h1) {
      message.push(page.body.h1)
    }

    if (page.body.p) {
      message.push(page.body.p['#text'])
    }

    throw new BooruError(
      `The Booru sent back an error: '${message.join(': ')}'`,
    )
  }

  if (data.posts.post) {
    return data.posts.post
  }

  if (data.posts.tag) {
    return Array.isArray(data.posts.tag) ? data.posts.tag : [data.posts.tag]
  }

  return []
}

/**
 * Yay fisher-bates
 * Taken from http://stackoverflow.com/a/2450976
 *
 * @private
 * @param  {Array} array Array of something
 * @return {Array}       Shuffled array of something
 */
export function shuffle<T>(array: T[]): T[] {
  let currentIndex: number = array.length
  let temporaryValue: T
  let randomIndex: number

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex)
    currentIndex -= 1

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
export function validateSearchParams(
  site: string,
  limit: number | string,
): { site: string; limit: number } {
  const resolvedSite = resolveSite(site)

  if (typeof limit !== 'number') {
    limit = parseInt(limit, 10)
  }

  if (resolvedSite === null) {
    throw new BooruError('Site not supported')
  }

  if (typeof limit !== 'number' || Number.isNaN(limit)) {
    throw new BooruError('`limit` should be an int')
  }

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
  return arr1.filter(e1 =>
    arr2.some(e2 => e1.toLowerCase() === e2.toLowerCase()),
  )
}
