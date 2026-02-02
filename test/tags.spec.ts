import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { sites, tagList } from '../src/index'
import type SiteInfo from '../src/structures/SiteInfo'
import type Tag from '../src/structures/Tag'
import { shouldSkipSite } from './search.spec'

const sitesToTest = Object.values(sites)

function shouldSkipTagList(site: SiteInfo): boolean {
  return (
    shouldSkipSite(site) ||
    site.domain === 'derpibooru.org' || // no tag list support
    site.domain === 'rule34.paheal.net' // no tag list support
  )
}

describe('Using tags', { concurrency: true }, () => {
  for (const s of sitesToTest) {
    it(
      `${s.domain} should return a list of tags`,
      {
        skip: shouldSkipTagList(s),
      },
      async () => {
        const tagResult = await tagList(s.domain, {
          limit: 10,
          page: 0,
        })
        const tag: Tag = tagResult[0]

        assert.equal(tagResult.booru.site.domain, s.domain)
        // assert.deepEqual(searchResult.booru.site, s)
        assert.equal(typeof tag.name, 'string')
      },
    )
  }
})
