// cli example

// Run with
// node example.js [site] [tag1] [tag2] [tagn]

// You can use any site in sites.json (or their aliases)

const booru = require('./index.js')

booru.search(process.argv[2], process.argv.slice(3), { limit: 1, random: true })
.then(booru.commonfy)
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
