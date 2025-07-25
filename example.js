const Booru = require('./dist')
const { BooruError, sites } = require('./dist')
// for ES6:
// import Booru, { search, BooruError, sites } from 'booru'

const argTags = process.argv.slice(3)
const site = process.argv[2] || 'sb'
const tags = process.argv[2] ? argTags : ['cat']

const searchUrl = Booru.forSite(site).getSearchUrl({ tags, limit: 1 })

console.log(`Searching with url: ${searchUrl}`)

function formatPost(post) {
  return {
    id: post.id,
    postView: post.postView,
    fileUrl: post.fileUrl,
    score: post.score,
    rating: post.rating,
    source: post.source,
    createdAt: post.createdAt,
    tags:
      post.tags.length > 5
        ? [...post.tags.slice(0, 5), `...${post.tags.length - 5} more`]
        : post.tags,
  }
}

// Search with promises
Booru.search(site, tags, { limit: 1, random: false })
  .then((posts) => {
    if (posts.length === 0) {
      console.log('No images found.')
    }

    console.log(`Found ${posts.length} image${posts.length === 1 ? '' : 's'}.`)
    for (let post of posts) {
      console.log(formatPost(post))
    }
  })
  .catch((err) => {
    if (err instanceof BooruError) {
      // It's a custom error thrown by the package
      // Typically results from errors the boorus returns, eg. "too many tags"
      console.error(err)
    } else {
      // This means something pretty bad happened
      console.error(err)
    }
  })

// Tag list with promises
Booru.tagList(site, { limit: 5 })
  .then((tags) => {
    console.log(`Found ${tags.length} tags.`)
    for (let tag of tags) {
      console.log(`- ${tag.name}`)
    }
  })
  .catch((err) => {
    if (err instanceof BooruError) {
      // It's a custom error thrown by the package
      console.error(err)
    } else {
      // This means something pretty bad happened
      console.error(err)
    }
  })

// Search with async/await
async function booruSearch(site, tags, limit = 1, random = true) {
  const posts = await Booru.search(site, tags, { limit, random })

  return console.log(posts[0].fileUrl)
}

// Tag list with async/await
async function booruTagList(site, limit = 5) {
  const tags = await Booru.tagList(site, { limit })

  return console.log(tags[0].name)
}

// Create an instance of a booru to use yourself
// This allows you to create a booru with certain credentials/settings and reuse it
// Internally, `Booru.search` just creates boorus and caches them
// Ex: `Booru.forSite('safebooru')`
async function booruClassSearch(site, tags, limit = 1, random = true) {
  const myBooru = Booru.forSite(site)
  const posts = await myBooru.search(tags, { limit, random })

  return console.log(posts[0].fileUrl)
}

// You can also check the sites and the options for each
//   console.log(Booru.sites)
// Or just the site URLs
//   console.log(Object.keys(sites))
