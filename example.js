const Booru = require('booru');
// import Booru from 'booru' for ES6
// You can also import the search function directly:
// const { search } = require('booru') or import { search } from 'booru'

// Search with promises, plus some demo error-checking
Booru.search(site, [tag1, tag2], {limit: 1, random: false})
.then(images => {
  //Log the direct link to each image
  for (let image of images) {
    console.log(image.data.file_url)
  }
})
.catch(err => {
  if (err.name === 'BooruError') {
    //It's a custom error thrown by the package
    console.log(err.message)
  } else {
    //This means I messed up. Whoops.
    console.log(err)
  }
});

// or with async/await:
const booruSearchDirect = async (site,tags,limit = 1,random = true) => {
  const images = await search(site, tags, { limit, random });

  return console.log(images[0].data.file_url);
};

const booruSearch = async (site, tags, limit = 1, random = true) => {
  const images = await Booru.search(site, tags, {limit, random});

  return console.log(images[0].data.file_url);
};

console.log(Booru.SiteMap); // you can also check the sites and the options for each
console.log(Object.keys(Booru.SiteMap)); // or just the site URLs