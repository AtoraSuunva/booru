# booru

>*A node package to do stuff on various boorus, like search 'em*

## Features

- Able to search 17 different boorus (check [sites.json](./sites.json))
- Also alias support so you can be lazy (`sb` for `safebooru.org`)
- Promises because they're magical
- Choose the amount of images to get
- Random support for all sites, using `order:random` on sites that support it and using a bit of magic on sites that don't
- Coming soon: Support for more than just searching

---

## Installation

```sh
npm i --save booru
# Replace "npm i --save" with "yarn add" when using yarn
```

---

## Usage

```js
const Booru = require('booru');
/**
 * or for Babel / TypeScript:
 * import Booru from 'booru'
 * Note: Requires --esmoduleinterop for TypeScript
 * use "import * as Booru" with --allowsyntheticdefaultimport
 * or "import booru = require('booru')" with neither
 */

// Instantiate a booru and search it
const e9 = new Booru('e9')
let imgs = await e9.search(['cute', 'cat'], {limit: 3})

// Log the url to first post found
console.log(imgs[0].postView)

// Don't instantiate, plus some demo error-checking
Booru.search(site, [tag1, tag2], {limit: 1, random: false})
.then(images => {
  //Log the direct link to each image
  for (let image of images) {
    console.log(image.common.file_url)
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

// or with async/await and ES6 Arrow Functions:
const booruSearch = async (site, tags, limit = 0, random = true) => {
    const images = await Booru.search(site, tags, {limit, random});

    console.log(images[0].common.file_url);
}

console.log(booru.sites); // you can also check the sites and the options for each
console.log(Object.keys(booru.sites)); // or just the site URLs
```

---

## Docs

Available here: [https://booru.js.org](https://booru.js.org)

---

## Contributors

[BobbyWibowo](https://github.com/BobbyWibowo/booru)
> Change from request-promise-native to snek-fetch https://github.com/AtlasTheBot/booru/pull/9

[rubikscraft](https://github.com/rubikscraft/booru)
> Add 2 new boorus (furry.booru.org/realbooru.com) https://github.com/AtlasTheBot/booru/pull/17  
> Various Derpibooru fixes https://github.com/AtlasTheBot/booru/pull/19

[Favna](https://github.com/favna/)
> Add TypeScript declarations https://github.com/AtlasTheBot/booru/pull/21 (and other things)
---

## FAQ

### What are the properties of a `Post`?

The basic structure of a `Post` object looks like:

```js
Post {
  _data: {/*...*/},                     // The raw data from the booru
  file_url: 'https://aaaa.com/img.jpg', // The direct link to the image, ready to post
  id: '124125',                         // The image ID, as a string
  tags: ['cat', 'cute'],                // The tags, split into an Array
  score: 5,                             // The score as a Number
  source: 'https://ex.com/aaa.png',     // Source of the image, if supplied
  rating: 's',                          // Rating of the image
  createdAt: Date,                      // The `Date` this image was created at
}
```

`s`: 'Safe'
`q`: 'Questionable'
`e`: 'Explicit'
`u`: 'Unrated'

Derpibooru has `Safe, Suggestive, Questionable, Explicit`, although `Suggestive` will be shown as `q` in `<Post>.rating`

### Can I contribute?

Sure! Just fork this repo, push your changes, and then make a PR.

I'll accept PR based on what they do and code style (Not super strict about it, but it's best if it roughly follows the rest of the code)

### Why?

Why not?

### This is terrible code

:)

### License?

[It's GPLv3](http://choosealicense.com/licenses/gpl-3.0/)
