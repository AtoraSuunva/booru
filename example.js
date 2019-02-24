const Booru = require('booru');
const { search, BooruError, SiteMap } = require('booru');
// for ES6:
// import Booru, { search, BooruError, SiteMap } from 'booru'

// Search with promises, plus some demo error-checking
Booru.search(site, [tag1, tag2], {limit: 1, random: false})
  .then(posts => {
    //Log the direct link to each image
    for (let post of posts) {
      console.log(post.fileUrl)
    }
  })
  .catch(err => {
    if (err instanceof BooruError) {
      //It's a custom error thrown by the package
      console.error(err.message)
    } else {
      //This means I messed up. Whoops.
      console.error(err)
    }
  });

// Search with async/await
const booruSearch = async (site, tags, limit = 1, random = true) => {
  const posts = await Booru.search(site, tags, {limit, random});

  return console.log(posts[0].fileUrl);
};

// Search without instantiation and with async/await (a.k.a. the fancy pants way)
const booruSearchDirect = async (site, tags, limit = 1, random = true) => {
  const posts = await search(site, tags, {limit, random});

  return console.log(posts[0].fileUrl);
};

console.log(Booru.SiteMap); // you can also check the sites and the options for each
console.log(Object.keys(SiteMap)); // or just the site URLs