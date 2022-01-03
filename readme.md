# `booru`

> _A node package to search boorus_

[![CircleCI](https://img.shields.io/circleci/project/github/AtoraSuunva/booru.svg)](https://circleci.com/gh/AtoraSuunva/booru) ![npm](https://img.shields.io/npm/v/booru.svg) ![GitHub](https://img.shields.io/github/license/AtoraSuunva/booru.svg) ![Typescript typings](https://img.shields.io/badge/Typings-Typescript-informational.svg)

## Features

- Search 15 different boorus (check [sites.json](./src/sites.json))
- Normalizes all received data into `Post` objects that are consistent no matter which booru you use
- Access to the raw data received from the booru as well (transformed from XML to JSON, if applicable)
- Alias support for boorus (`sb` for `safebooru.org`)
- Promises
- Types (using Typescript)
- Choose the amount of images to get
- Random support for all sites, using `order:random` on sites that support it and using custom code on those that don't
- Coming soon(-ish): Support for more than just searching

---

## Installation

```sh
npm add booru
# or
yarn add booru
```

---

## Usage

```js
const Booru = require('booru')

Booru.search('safebooru', ['glaceon'], { limit: 3, random: true }).then(
  posts => {
    for (let post of posts) console.log(post.fileUrl, post.postView)
  },
)

// or (using alias support and creating boorus)
const sb = Booru.forSite('sb')

sb.search(['cat', 'dog'], { limit: 2 })
```

See [example.js](./example.js) for more examples

---

## Docs

Available here: [https://booru.js.org](https://booru.js.org)

## Web support

booru was built for Node.js, and is only officially supported for Node.js. Issues relating to web are fine, although support might be limited.

It's possible to use booru on the web using webpack (or similar), although your experience may vary. Some websites don't have the proper CORS headers, meaning that API requests to those sites from a browser will fail! This is not an issue I can fix in the package, and requires either that booru to add proper support themselves or for you to find a workaround for CORS.

## FAQ

### What are the properties of a `Post`?

The basic structure of a `Post` object looks like:

```js
Post {
  _data: {/*...*/},                       // The raw data from the booru
  fileUrl: 'https://aaaa.com/img.jpg',    // The direct link to the image, ready to post
  id: '124125',                           // The image ID, as a string
  tags: ['cat', 'cute'],                  // The tags, split into an Array
  score: 5,                               // The score as a Number
  source: 'https://ex.com/aaa.png',       // Source of the image, if supplied
  rating: 's',                            // Rating of the image
  createdAt: Date,                        // The `Date` this image was created at
  postView: 'https://booru.ex/show/12345' // A URL to the post
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

### License?

[It's MIT](https://choosealicense.com/licenses/mit/)

---

## Contributors

[BobbyWibowo](https://github.com/BobbyWibowo/booru)

> [Change from request-promise-native to snek-fetch](https://github.com/AtoraSuunva/booru/pull/9)

[rubikscraft](https://github.com/rubikscraft/booru)

> [Add 2 new boorus (furry.booru.org/realbooru.com)](https://github.com/AtoraSuunva/booru/pull/17)  
> [Various Derpibooru fixes](https://github.com/AtoraSuunva/booru/pull/19)

[Favna](https://github.com/favna/)

> [Add TypeScript declarations](https://github.com/AtoraSuunva/booru/pull/21)  
> Improve TypeScript port  
> Various other small fixes

[negezor](https://github.com/negezor)

> [Add missing type information](https://github.com/AtoraSuunva/booru/pull/31)

---
