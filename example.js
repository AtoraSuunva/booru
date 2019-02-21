// cli example

// Run with
// node example.js [site] [tag1] [tag2] [tagn]

// You can use any site in sites.json (or their aliases)

const Booru = require('./dist/index.js')

Booru.search(process.argv[2], process.argv.slice(3), { limit: 1, random: true })
.then(posts => {
  if (posts.length === 0) {
    console.log('No posts with those tags found.')
  }

  // Log the direct file link & post view to each post
  for (let i = 0; i < posts.length; i++) {
    console.log(`Result #${i}`, posts[i].fileUrl, posts[i].postView)
  }
})
.catch(err => {
  if (err instanceof Booru.BooruError) {
    // It's a custom error thrown by the package
    console.log(err)
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

  // In the future, things like `e9.favorite(Post)` or `e9.fetchComments(Post)`
  // Will be available (and <Post>.favorite())
}
