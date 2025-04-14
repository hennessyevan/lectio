import nlp from 'compromise'
import { writeFile, readFile } from 'fs/promises'
import { XMLParser } from 'fast-xml-parser'

const parser = new XMLParser({
	ignoreAttributes: false,
	allowBooleanAttributes: true,
	alwaysCreateTextNode: true,
	isArray: (tagName) => tagName === 'chapter' || tagName === 'verse',
})

async function parseOSISBible(path: string) {
	const xml = await readFile(path, 'utf-8')
	const json = parser.parse(xml)
	const books = json['osis']['osisText']['div']

	const versesWithParts: Record<string, string[]> = {}

	for (const book of books) {
		if (book['@_type'] !== 'book') continue
		const chapters = book['chapter']

		for (const chapter of chapters) {
			const verses = chapter['verse']

			for (const verse of verses) {
				const verseNumber = verse['@_osisID']
				const text = verse['#text']
				console.info(verseNumber)

				const tokens = nlp(text).sentences().out('array')
				versesWithParts[verseNumber] = tokens
			}
		}
	}

	return versesWithParts
}

const verses = await parseOSISBible('./rsv.xml')

writeFile('./verses.json', JSON.stringify(verses, null, 2))
