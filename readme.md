# booru
### A node package for searching various boorus (with promises!)

**What is this fork about?**  
This fork was made to make booru use Snekfetch instead of Request and use Standard for linting. and maybe some other stuff.

**Why Snekfetch?**  
Mainly because this fork was intended for Lightbringer, a Discord self-bot written with discord.js, which uses Snekfetch for all kind of HTTP requests. So instead of unnecessarily adding more dependency (which is Request), I forked booru to make it use Snekfetch instead.

On a side note, all modifications were made in `snek-standard` branch, which is the default branch in this fork, if you have not noticed.

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
```
npm i --save booru
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
  if (err.name === 'booruError') {
    //It's a custom error thrown by the package
    console.log(err.message)
  } else {
    //This means I messed up. Whoops.
    console.log(err)
  }
})
```
---
## Some docs
#### booru.search(site, tags, options)
| Parameter | Type          | Optional | Default | Description |
|-----------|:-------------:|:--------:|:-------:|-------------|
| site      | string        |          | *none*  | The site to search, supports aliases
| tags      | string[]      |    X     | []      | The tags to search with
| options   | SearchOptions |    X     | {}      | For amount of images to fetch and if to return a random result or not (Check below table)

#### SearchOptions ({limit: 1, random: false})
| Parameter | Type          | Optional | Default | Description |
|-----------|:-------------:|:--------:|:-------:|-------------|
| limit     | number        |    X     | 1       | The max amount of images to return
| random    | boolean       |    X     | false   | If the images returned should be random everytime

---
## FAQ
who am i kidding nobody asks me questions
#### What the ".common prop" do?
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

#### Why?
Why not?

#### This is terrible code
me too thanks

#### License?
[It's GPLv3](http://choosealicense.com/licenses/gpl-3.0/)
