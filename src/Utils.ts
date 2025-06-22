/**
 * @packageDocumentation
 * @module Utils
 */

import { type AnySite, BooruError, sites } from './Constants'

import { XMLParser } from 'fast-xml-parser'

/**
 * Check if `site` is a supported site (and check if it's an alias and return the sites's true name)
 *
 * @param  {String} domain The site to resolveSite
 * @return {String?} null if site is not supported, the site otherwise
 */
export function resolveSite(domain: string): AnySite | null {
  if (typeof domain !== 'string') {
    return null
  }

  const lowerDomain = domain.toLowerCase()

  for (const [site, info] of Object.entries(sites)) {
    if (
      site === lowerDomain ||
      info.domain === lowerDomain ||
      info.aliases.includes(lowerDomain)
    ) {
      return site as AnySite
    }
  }

  return null
}

interface XMLPage {
  html: any
}

interface XMLPosts {
  post?: any[]
  tag?: any
}

interface XMLTags {
  tag?: any[]
}

interface BooruXML {
  html?: XMLPage
  '!doctype'?: XMLPage
}

interface BooruXMLPosts extends BooruXML {
  posts: XMLPosts
}

interface BooruXMLTags extends BooruXML {
  tags: XMLTags
}

const xmlParser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: '',
})

/**
 * Parses posts xml to json, which can be used with js
 *
 * @private
 * @param  {String} xml The xml to convert to json
 * @return {Object[]} A Promise with an array of objects created from the xml
 */
export function jsonifyPosts(xml: string): object[] {
  if (typeof xml === 'object') return xml

  const data = xmlParser.parse(xml) as BooruXMLPosts

  if (data.html || data['!doctype']) {
    // Some boorus return HTML error pages instead of JSON responses on errors
    // So try scraping off what we can in that case
    const page = data.html ?? data['!doctype']?.html
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
 * Parses tags xml to json, which can be used with js
 *
 * @private
 * @param  {String} xml The xml to convert to json
 * @return {Object[]} A Promise with an array of objects created from the xml
 */
export function jsonifyTags(xml: string): object[] {
  if (typeof xml === 'object') return xml

  const data = xmlParser.parse(xml) as BooruXMLTags

  if (data.html || data['!doctype']) {
    // Some boorus return HTML error pages instead of JSON responses on errors
    // So try scraping off what we can in that case
    const page = data.html ?? data['!doctype']?.html
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

  if (data.tags.tag) {
    return data.tags.tag
      ? Array.isArray(data.tags.tag)
        ? data.tags.tag
        : [data.tags.tag]
      : []
  }
  return []
}

/**
 * Try to parse JSON, and then return an empty array if data is an empty string, or the parsed JSON
 *
 * Blame rule34.xxx for returning literally an empty response with HTTP 200 for this
 * @param data The data to try and parse
 * @returns Either the parsed data, or an empty array
 */
export function tryParseJSON(data: string): Record<string, unknown>[] {
  if (data === '') {
    return []
  }

  return JSON.parse(data)
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
  const nmin = Math.ceil(min)
  const nmax = Math.floor(max)
  return Math.floor(Math.random() * (nmax - nmin + 1)) + nmin
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

  const resolvedLimit =
    typeof limit !== 'number' ? Number.parseInt(limit, 10) : limit

  if (resolvedSite === null) {
    throw new BooruError('Site not supported')
  }

  if (typeof limit !== 'number' || Number.isNaN(limit)) {
    throw new BooruError('`limit` should be an int')
  }

  return { site: resolvedSite, limit: resolvedLimit }
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
  return arr1.filter((e1) =>
    arr2.some((e2) => e1.toLowerCase() === e2.toLowerCase()),
  )
}

type URIEncodable = string | number | boolean
type QueryValue = URIEncodable | URIEncodable[]

interface QuerystringOptions {
  arrayJoin?: string
}

interface EncodeURIQueryValueOptions {
  arrayJoin?: string
}

/**
 * Turns an object into a query string, correctly encoding uri components
 *
 * @example
 * const options = { page: 10, limit: 100 }
 * const query = querystring(options) // 'page=10&limit=100'
 * console.log(`https://example.com?${query}`)
 *
 * @param query An object with key/value pairs that will be turned into a string
 * @returns A string that can be appended to a url (after `?`)
 */
export function querystring(
  query: Record<string, QueryValue>,
  { arrayJoin = '+' }: QuerystringOptions = {},
): string {
  return Object.entries(query)
    .map(
      ([key, value]) =>
        `${encodeURIComponent(key)}=${encodeURIQueryValue(value, {
          arrayJoin,
        })}`,
    )
    .join('&')
}

/**
 * Encodes a single value or an array of values to be usable in as a URI component,
 * joining array elements with '+'
 * @param value The value to encode
 * @returns An encoded value that can be passed to a querystring
 */
export function encodeURIQueryValue(
  value: QueryValue,
  { arrayJoin = '+' }: EncodeURIQueryValueOptions = {},
): string {
  if (Array.isArray(value)) {
    return value.map(encodeURIComponent).join(arrayJoin)
  }

  return encodeURIComponent(value)
}
