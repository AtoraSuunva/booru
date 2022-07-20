export interface BooruSearchParameters {
  tags: string[]
  limit?: number
  page?: number
}

export interface Booru {
  domain: string

  searchURL(params: BooruSearchParameters): string
  getImageURL(id: string): string
}
