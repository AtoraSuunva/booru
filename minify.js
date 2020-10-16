// Modified version of https://github.com/terser/terser/issues/544#issuecomment-680113112
// Changed to add .json compression support, work using async promises (for speed?)
// Original is under no specified license
// This file is also under no license (unlike the rest of booru.) Use/modify it however.

const { minify } = require('terser')
const { join, resolve, extname } = require('path')
const { stat, readdir, readFile, writeFile } = require('fs').promises

async function getAllFiles({ path }) {
  const files = await readdir(path)

  const fPromises = files.map(async file => {
    if ((await stat(`${path}/${file}`)).isDirectory()) {
      return getAllFiles({ path: `${path}/${file}` })
    } else if (file.match(/\.js(on)?$/)) {
      return join(resolve(), path, file)
    }
    return []
  })

  return (await Promise.all(fPromises)).flat()
}


async function minifyFiles(filePaths) {
  const fPromises = filePaths.map(async path => {
    switch(extname(path)) {
      case '.js':
        const miniJS = await minify(await readFile(path, 'utf8'))
        return writeFile(path, miniJS.code, 'utf8')

      case '.json':
        const content = (await readFile(path, 'utf8')).trim()
        const miniJSON = JSON.stringify(JSON.parse(content))
        return writeFile(path, miniJSON, 'utf8')
      }
    })

  return Promise.all(fPromises)
}

(async () => {
  const files = await getAllFiles({ path: "./dist" })
  console.log('Minifying files: ')
  console.log(files.join('\n'))
  await minifyFiles(files)
  console.log('Done!')
})()
