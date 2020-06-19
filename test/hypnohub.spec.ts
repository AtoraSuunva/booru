import Booru, { BooruClass, search, sites } from '../src/index'
import Post from '../src/structures/Post'
import SearchResults from '../src/structures/SearchResults'

let tag1: string
let site: string

beforeEach(() => {
  site = 'hh'
  tag1 = 'cat'
})

// Ignore since I seem to be getting hit by DDoS protection on the api endpoint?
describe.skip('Using instantiation method', () => {
  let booruClass: BooruClass
  beforeEach(() => {
    booruClass = Booru(site)
  })

  it('should return an image', async () => {
    const searchResult: SearchResults = await booruClass.search([tag1])
    const image: Post = searchResult[0]
    expect(searchResult.booru.domain).toBe('hypnohub.net')
    expect(searchResult.booru.site).toMatchObject(sites[searchResult.booru.domain])
    expect(typeof image.fileUrl).toBe('string')
  })
})

describe.skip('Using fancy pants method', () => {
  it('should return an image', async () => {
    const searchResult = await search(site, [tag1])
    const image: Post = searchResult[0]
    expect(searchResult.booru.domain).toBe('hypnohub.net')
    expect(searchResult.booru.site).toMatchObject(sites[searchResult.booru.domain])
    expect(typeof image.fileUrl).toBe('string')
  })
})
