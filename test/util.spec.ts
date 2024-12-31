import assert from 'node:assert/strict'
import path from 'node:path'
import { describe, it } from 'node:test'
import { BooruClass, BooruError, resolveSite, sites } from '../src'
import type Site from '../src/structures/Site'

describe('Check resolveSite', () => {
  it('should resolve alias to host', () => {
    assert.equal(resolveSite('sb'), 'safebooru.org')
  })
})

describe('check BooruError', () => {
  it('should resolve to a BooruError', () => {
    const booruError = new BooruError('test')
    assert.equal(booruError.name, 'BooruError')
    assert(booruError.stack?.includes(path.basename(__filename)))
  })
})

describe('check BooruClass', () => {
  it('should resolve to a BooruClass', () => {
    const siteData: Site = sites[resolveSite('safebooru.org') ?? '']

    const booruClass = new BooruClass(siteData)

    assert.equal(booruClass.domain, 'safebooru.org')
    assert.deepEqual(booruClass.site, siteData)
  })
})

describe('check sites', () => {
  it('should support 15 sites', () => {
    assert.equal(Object.keys(sites).length, 15)
  })
})
