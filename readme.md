# `booru`

> _A node package to search boorus_

[![Lint and Test](https://github.com/AtoraSuunva/booru/actions/workflows/lint-and-test.yml/badge.svg)](https://github.com/AtoraSuunva/booru/actions/workflows/lint-and-test.yml) ![npm](https://img.shields.io/npm/v/booru.svg) ![GitHub](https://img.shields.io/github/license/AtoraSuunva/booru.svg) ![Typescript typings](https://img.shields.io/badge/Typings-Typescript-informational.svg)

Only [non-EoL](https://nodejs.org/en/about/previous-releases) versions of Node.js are tested and officially supported. EoL versions are unsupported. Other runtimes (like web, Deno, and Bun) aren't _officially_ supported but issues and PRs are accepted for them.

## Features

- Search posts on 15 different boorus (check [sites.json](./src/sites.json))
- Search tags on 12 different boorus
- Normalizes all received data into `Post` objects that are consistent no matter which booru you use
- Access to the raw data received from the booru as well (transformed from XML to JSON, if applicable)
- Alias support for boorus (`sb` for `safebooru.org`)
- Promises
- Types (using Typescript)
- Choose the amount of images to get
- Random support for all sites, using `order:random` on sites that support it and using custom code on those that don't

---

## Installation

Booru is available on [npm](https://www.npmjs.com/package/booru):

```sh
# Pick your favorite package manager
npm add booru
pnpm add booru
yarn add booru
```

And available on [jsr](https://jsr.io/@atorasuunva/booru):

```sh
# Pick your favorite runtime
pnpm i jsr:@atorasuunva/booru
deno add jsr:@atorasuunva/booru
bunx jsr add @atorasuunva/booru
```

---

## Usage

```js
import { search, forSite } from 'booru'

const posts = await search('safebooru', ['glaceon'], {
  limit: 3,
})

for (const post of posts) {
  console.log(post.fileUrl, post.postView)
}

// Or, using alias support and creating 

const Booru = require('booru')

Booru.search('safebooru', ['glaceon'], { limit: 3, random: true }).then(
  posts => {
    for (let post of posts) console.log(post.fileUrl, post.postView)
  },
)

// or (using alias support and creating boorus)
const sb = forSite('sb')

const petPosts = await sb.search(['cat', 'dog'], { limit: 2 })
```

See [example.js](./example.js) for more examples

---

## Docs

Available here: [https://jsr.io/@atorasuunva/booru/doc](https://jsr.io/@atorasuunva/booru/doc)

## Web support

booru was built for Node.js, and is only officially supported for Node.js. Issues relating to web are fine, although support might be limited.

It's possible to use booru on the web using webpack (or similar), although your experience may vary. Some websites don't have the proper CORS headers, meaning that API requests to those sites from a browser will fail! This is not an issue I can fix in the package, and requires either that booru to add proper support themselves or for you to find a workaround for CORS.

## FAQ

### What are the properties of a `Post`?

The basic structure of a `Post` object looks like:

```js
Post {
  data: {/*...*/},                       // The raw data from the booru
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

I'll accept PR based on what they do. Make sure your changes pass the lint (`pnpm run lint:fix`) and tests (`pnpm run test`).

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

[iguessthislldo](https://github.com/iguessthislldo)

> [Copy tags argument so it's not modified](https://github.com/AtoraSuunva/booru/pull/103)

[ColonelBologna](https://github.com/ColonelBologna)

> [Tag list](https://github.com/AtoraSuunva/booru/pull/114)
---
