// cli example

// Run with
// node example.js [site] [tag1] [tag2] [tagn]

// You can use any site in sites.json (or their aliases)

const Booru = require('./index.js')

Booru.search(process.argv[2], process.argv.slice(3), { limit: 1, random: true })
.then(images => {
  // Log the direct link to each image
  for (let image of images) {
    console.log(image.common.file_url)
  }
})
.catch(err => {
  if (err.name === 'BooruError') {
    // It's a custom error thrown by the package
    console.log(err.message)
  } else {
    // This means I messed up. Whoops.
    console.log(err)
  }
})

// Another example, where we instantiate a booru and then use it
// instantiating a booru allows for you to do more complex things,
// like favoriting a post (if you provide an api token) or posting/viewing comments, etc.
async function example() {
  const e9 = new Booru('e9', {token: 'goes here'})
  let imgs

  imgs = await e9.search(['cat', 'cute'], {limit: 1, random: true})

  // Log the post url to the first image
  console.log(imgs[0].postView)

  // In the future, things like `e9.favorite(BooruImage)` or `e9.fetchComments(BooruImage)`
  // Will be available (and maybe even <BooruImage>.favorite())
}
