import { SQLocalDrizzle } from 'sqlocal/drizzle'
import { drizzle } from 'drizzle-orm/sqlite-proxy'

// eslint-disable-next-line @nx/enforce-module-boundaries
import nrsvce from '../../../../packages/bibles/nrsvce.sqlite?url'

const { driver, sql, overwriteDatabaseFile } = new SQLocalDrizzle(
  'database.sqlite3'
)
export const db = drizzle(driver)

async function importBible() {
  const exists =
    await sql`SELECT name FROM sqlite_master WHERE type='table' AND name='verses'`
  if (exists.length) return

  console.info('Importing Bible...')

  const blob = await fetch(nrsvce).then((res) => res.blob())
  await overwriteDatabaseFile(blob)
}

importBible()
