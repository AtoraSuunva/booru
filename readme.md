# booru
### A mode package for searching various boorus (with promises!)

### Features

- Able to search 15 different boorus (check [sites.json](./sites.json))
- Promises because they're magical
- Little utility to convert xml to json (and add a .common prop to each image)
- Some other stuff I probably forgot

### Installation
```
npm i --save booru
```

### Usage
```js
const booru = require('booru')

booru.search(site, [tag1, tag2], limit)
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

**site** => Any supported site in [sites.json](./sites.json). You can use either the full url or an alias

**tags** => An array of tags to search with (optional, default `[]`)

**limit** => An int, the max amount of images to fetch (optional, default `1`)


#### What the ".common prop" do?
Calling `booru.commonfy` not only transforms all the xml into json, it adds a .common prop to each image

```js
common: {
  file_url: 'https://aaaa.com/image.jpg',  //The direct link to the image, ready to post
  id: '124125',                            //The image ID, as a string
  tags: ['cat', 'cute'],                   //The tags, split into an Array
  score: 5,                                //The score as a Number
  source: 'https://giraffedu.ck/aaaa.png', //source of the image, if supplied
  rating: 's'                              //rating of the image
}
```

#### Why?
Why not?

#### License
You can use the code wherever I guess. Just don't claim that it's yours.
¯\\\__(ツ)__/¯
