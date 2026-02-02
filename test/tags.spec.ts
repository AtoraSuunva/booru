import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { sites, tagList } from '../src/index'
import type Tag from '../src/structures/Tag'

const sitesToTest = Object.values(sites)

describe('Using tags', { concurrency: true }, () => {
  for (const s of sitesToTest) {
    it(
      `${s.domain} should return a list of tags`,
      {
        skip:
          s.domain === 'derpibooru.org' ||
          s.domain === 'rule34.paheal.net' ||
          s.domain === 'realbooru.com' || // Derpibooru, Paheal and Realbooru do not support tag listing
          s.domain === 'gelbooru.com' || // gelbooru no longer supports anonymous API calls
          s.domain === 'api.rule34.xxx' || // rule34.xxx no longer supports anonymous API calls
          s.domain === 'e926.net', // e926.net shows a captcha
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
