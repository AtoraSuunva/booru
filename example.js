const Booru = require('booru')
const {search, BooruError, sites} = require('booru')
// for ES6:
// import Booru, { search, BooruError, sites } from 'booru'

const site = 'safebooru';
const tags = ['glaceon'];

// Search with promises, plus some demo error-checking
Booru.search(site, [tag1, tag2], {limit: 1, random: false})
  .then(posts => {
    //Log the direct link to each image
    for (let post of posts) {
      console.log(post.fileUrl);
    }
  })
  .catch(err => {
    if (err instanceof BooruError) {
      //It's a custom error thrown by the package
      console.error(err.message);
    } else {
      //This means I messed up. Whoops.
      console.error(err);
    }
  });

// Search with async/await
async function booruSearch(site, tags, limit = 1, random = true) {
  const posts = await Booru.search(site, tags, {limit, random});

  return console.log(posts[0].fileUrl);
}

// Create class then search (not recommended!)
async function booruClassSearch(site, tags, limit = 1, random = true) {
  const siteData = Object.values(sites).filter(entry => entry.domain.includes(site))[0]
  const booruClass = new BooruClass(siteData);

  const posts = await booruClass.search(tags, {limit, random});

  return console.log(posts[0].fileUrl);
}

// Search with minimal setup and async/await (a.k.a. the fancy pants way)
async function booruDirectSearch(site, tags, limit = 1, random = true) {
  const posts = await search(site, tags, {limit, random});

  return console.log(posts[0].fileUrl);
}

console.log(Booru.sites); // you can also check the sites and the options for each
console.log(Object.keys(sites)); // or just the site URLs

console.log(booruSearch(site, tags));
console.log(booruClassSearch(site, tags));
console.log(booruDirectSearch(site, tags));