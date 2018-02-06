# booru

>*A node package for searching various boorus (with promises!)*

## Features

- Able to search 17 different boorus (check [sites.json](./sites.json))
- Also alias support so you can be lazy (`sb` for `safebooru.org`)
- Promises because they're magical
- Little utility to convert xml to json (and add a .common prop to each image)
- Choose the amount of images to get
- Random support for all sites, using `order:random` on sites that support it and using a bit of magic on sites that don't
- Some other stuff I probably forgot

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
const booru = require('booru')

booru.search(site, [tag1, tag2], {limit: 1, random: false})
.then(booru.commonfy)
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

### booru.search(site, tags, options)

| Parameter | Type          | Optional | Default | Description |
|-----------|:-------------:|:--------:|:-------:|-------------|
| site      | string        |          | *none*  | The site to search, supports aliases
| tags      | string[]      |    X     | []      | The tags to search with
| options   | SearchOptions |    X     | {}      | For amount of images to fetch and if to return a random result or not (Check below table)


### SearchOptions ({limit: 1, random: false})

| Parameter | Type          | Optional | Default | Description |
|-----------|:-------------:|:--------:|:-------:|-------------|
| limit     | number        |    X     | 1       | The max amount of images to return
| random    | boolean       |    X     | false   | If the images returned should be random everytime

---

## Contributors

[BobbyWibowo](https://github.com/BobbyWibowo/booru)
> Change from request-promise-native to snek-fetch

---

## FAQ

### What the ".common prop" do?

Calling `booru.commonfy` not only transforms all the xml into json, it adds a .common prop to each image

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
