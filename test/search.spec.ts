import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { forSite, search, sites } from '../src/index'
import type Post from '../src/structures/Post'
import type SearchResults from '../src/structures/SearchResults'

const sitesToTest = Object.values(sites)
const tags = ['cat']

describe('Using forSite', { concurrency: true }, () => {
  for (const s of sitesToTest) {
    // realbooru currently 500's on the API
    // https://github.com/AtoraSuunva/booru/issues/109
    // so skip in tests for now, and either they fix it or it gets removed from the lib
    it(
      `${s.domain} should return an image`,
      {
        skip: s.domain === 'realbooru.com',
      },
      async () => {
        const booru = forSite(s.domain)
        const searchResult: SearchResults = await booru.search(tags)
        const image: Post = searchResult[0]

        assert.equal(searchResult.booru.site.domain, s.domain)
        // Use partial when it stabilizes https://nodejs.org/api/assert.html#assertpartialdeepstrictequalactual-expected-message
        // assert.deepEqual(searchResult.booru.site, s)
        assert.equal(typeof image.fileUrl, 'string')
      },
    )
  }
})

describe('Using search', { concurrency: true }, () => {
  for (const s of sitesToTest) {
    it(
      `${s.domain} should return an image`,
      {
        skip: s.domain === 'realbooru.com',
      },
      async () => {
        const searchResult = await search(s.domain, tags)
        const image: Post = searchResult[0]

        assert.equal(searchResult.booru.site.domain, s.domain)
        // assert.deepEqual(searchResult.booru.site, s)
        assert.equal(typeof image.fileUrl, 'string')
      },
    )
  }
})
