import { e621 } from './e621'

const e6 = new e621()

async function main() {
  const posts = await e6.search({
    tags: ['avali'],
    limit: 1,
  })

  console.log(posts)
}

main().catch(console.error)
