(async () => {
  const fs = require('fs').promises
  const [,,from,to] = process.argv
  if (!from || !to) throw new Error('No file to minify, or no output')
  const content = await fs.readFile(from, 'utf8')
  await fs.writeFile(to, JSON.stringify(JSON.parse(content)), 'utf8')
  console.log(`Minified ${from} to ${to}!`)
})()
