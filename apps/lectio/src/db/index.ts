import { SQLocalDrizzle } from 'sqlocal/drizzle'
import { drizzle } from 'drizzle-orm/sqlite-proxy'
import { useLocalStorage } from '../hooks/useLocalStorage'

const { driver, sql, overwriteDatabaseFile } = new SQLocalDrizzle(
	'database.sqlite3',
)
export const db = drizzle(driver)

async function importBible(translation = 'nrsvce') {
	const url = new URL(
		`../../../../packages/bibles/${translation}.sqlite?url`,
		import.meta.url,
	).href

	const currentTranslation = localStorage.getItem('translation')

	const exists =
		await sql`SELECT name FROM sqlite_master WHERE type='table' AND name='verses'`
	if (exists.length && currentTranslation === translation) {
		return
	}

	console.info(`Importing Bible ${translation}...`)

	const blob = await fetch(url).then((res) => res.blob())
	await overwriteDatabaseFile(blob)
}

export function useBibleTranslation() {
	const [translation, setTranslation] = useLocalStorage<string>(
		'translation',
		'nrsvce',
	)

	function _setTranslation(translation: string) {
		importBible(translation).then(() => setTranslation(translation))
	}

	return [translation, _setTranslation] as const
}

importBible(localStorage.getItem('translation') || 'nrsvce')
