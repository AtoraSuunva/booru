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

```bash
npm i --save booru
```

Or if you use yarn

```bash
yarn add booru
```

---

## Usage

```js
const Booru = require('booru')

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
})
```

---

## Docs

Available here: [https://booru.js.org](https://booru.js.org)

---

## Contributors

[BobbyWibowo](https://github.com/BobbyWibowo/booru)
> Change from request-promise-native to snek-fetch

---

## FAQ

### What the ".common prop" do?

Each BooruImage has a .common property with a getter, which returns a normalized object containing
a few common properties across all boorus.

tl;dr: `img.common.tags` will work the same for any booru

```js
common: {
  file_url: 'https://aaaa.com/image.jpg',   //The direct link to the image, ready to post
  id: '124125',                             //The image ID, as a string
  tags: ['cat', 'cute'],                    //The tags, split into an Array
  score: 5,                                 //The score as a Number
  source: 'https://giraffeduck.com/aaa.png',//source of the image, if supplied
  rating: 's'                               //rating of the image
}
```

`s`: 'Safe'
`q`: 'Questionable'
`e`: 'Explicit'
`u`: 'Unrated'

Derpibooru has `Safe, Suggestive, Questionable, Explicit`, although `Suggestive` will be shown as `q` in `image.common`

### Can I contribute?

Sure! Just fork this repo, push your changes, and then make a PR.

I'll accept PR based on what they do and code style (Not super strict about it, but it's best if it roughly follows the rest of the code)

### Why?

Why not?

### This is terrible code

:)

### License?

[It's GPLv3](http://choosealicense.com/licenses/gpl-3.0/)
