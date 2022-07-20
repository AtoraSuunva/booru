import { fetch, RequestInfo, RequestInit, Response } from 'undici'
import { z } from 'zod'
import { Booru, BooruSearchParameters } from './Booru'
import { querystring } from './URLUtils'

export class e621 implements Booru {
  constructor(public domain = 'e621.net') {}

  public async search({
    tags,
    limit,
    page,
  }: BooruSearchParameters): Promise<e621Post[]> {
    const url = this.searchURL({ tags, limit, page })
    const response = await booruFetch(url).then((r) => r.json())
    const { posts } = e621Response.parse(response)
    return posts
  }

  public searchURL({ tags, limit, page }: BooruSearchParameters): string {
    return `https://${this.domain}/posts.json?${querystring({
      tags,
      limit,
      page,
    })}`
  }

  public getImageURL(id: string): string {
    return `https://${this.domain}/post/show/${id}`
  }
}

export class e926 extends e621 {
  constructor() {
    super('e926.net')
  }
}

const e621File = z.object({
  width: z.number(),
  height: z.number(),
  ext: z.string(),
  size: z.number(),
  md5: z.string(),
  url: z.string().nullable(),
})

const e621Preview = z.object({
  width: z.number(),
  height: z.number(),
  url: z.string().nullable(),
})

const e621SingleAlternate = z.object({
  type: z.string(),
  height: z.number(),
  width: z.number(),
  urls: z.tuple([z.string().nullable(), z.string()]),
})

const e621Alternates = z.object({
  '720p': e621SingleAlternate.optional(),
  '480p': e621SingleAlternate.optional(),
  original: e621SingleAlternate.optional(),
})

const e621Sample = z.object({
  has: z.boolean(),
  width: z.number(),
  height: z.number(),
  url: z.string().nullable(),
  alternates: e621Alternates,
})

const e621Score = z.object({
  up: z.number(),
  down: z.number(),
  total: z.number(),
})

const e621Tags = z.object({
  general: z.string().array(),
  species: z.string().array(),
  character: z.string().array(),
  copyright: z.string().array(),
  artist: z.string().array(),
  invalid: z.string().array(),
  lore: z.string().array(),
  meta: z.string().array(),
})

const e621Flags = z.object({
  pending: z.boolean(),
  flagged: z.boolean(),
  note_locked: z.boolean(),
  status_locked: z.boolean(),
  rating_locked: z.boolean(),
  comment_disabled: z.boolean(),
  deleted: z.boolean(),
})

const e621Relationships = z.object({
  parent_id: z.number().nullable(),
  has_children: z.boolean(),
  has_active_children: z.boolean(),
  children: z.number().array(),
})

type e621Post = z.infer<typeof e621Post>
const e621Post = z.object({
  id: z.number(),
  created_at: z.string(),
  updated_at: z.string(),
  file: e621File,
  preview: e621Preview,
  sample: e621Sample,
  score: e621Score,
  tags: e621Tags,
  locked_tags: z.string().array(),
  change_seq: z.number(),
  flags: e621Flags,
  rating: z.enum(['s', 'q', 'e']),
  fav_count: z.number(),
  sources: z.string().array(),
  pools: z.number().array(),
  relationships: e621Relationships,
  approver_id: z.number().nullable(),
  uploader_id: z.number(),
  comment_count: z.number(),
  is_favorited: z.boolean(),
  has_notes: z.boolean(),
  duration: z.number().nullable(),
})

const e621Response = z.object({
  posts: e621Post.array(),
})

const fetchDefaults: RequestInit = {
  headers: {
    Accept: 'application/json, application/xml;q=0.9, */*;q=0.8',
    'User-Agent': 'booru (https://github.com/AtoraSuunva/booru)',
  },
}

function booruFetch(
  input: RequestInfo,
  init: RequestInit = {},
): Promise<Response> {
  return fetch(input, {
    ...init,
    ...fetchDefaults,
  })
}
