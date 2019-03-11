const Booru = require('booru')
const {BooruError, sites} = require('booru')
// for ES6:
// import Booru, { search, BooruError, sites } from 'booru'

const site = 'safebooru'
const tags = ['glaceon']

// Search with promises
Booru.search(site, tags, {limit: 1, random: false})
  .then(posts => {
    //Log the direct link to each image
    for (let post of posts) {
      console.log(post.fileUrl)
    }
  })
  .catch(err => {
    if (err instanceof BooruError) {
      // It's a custom error thrown by the package
      // Typically results from errors the boorus returns, eg. "too many tags"
      console.error(err.message)
    } else {
      // This means something pretty bad happened
      console.error(err)
    }
  })

// Search with async/await
async function booruSearch(site, tags, limit = 1, random = true) {
  const posts = await Booru.search(site, tags, {limit, random})

  return console.log(posts[0].fileUrl)
}

// Create an instance of a booru to use yourself
// This allows you to create a booru with certain credentials/settings and reuse it
// Internally, `Booru.search` just creates boorus and caches them
// Ex: `Booru('safebooru')`
async function booruClassSearch(site, tags, limit = 1, random = true) {
  const myBooru = Booru(site)
  const posts = await myBooru.search(tags, {limit, random})

  return console.log(posts[0].fileUrl)
}

// You can also check the sites and the options for each
//   console.log(Booru.sites)
// Or just the site URLs
//   console.log(Object.keys(sites))
