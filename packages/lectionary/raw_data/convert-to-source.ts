import Bun from 'bun'
import AJV from 'ajv'
import path from 'path'
import addFormats from 'ajv-formats'
import { Temporal } from 'temporal-polyfill'
import osisToUSFM from 'bible-reference-formatter/es6/osisToParatext'
import schema from '../source.schema.json'
import { snakeCase } from 'lodash'

const bcv =
	require('bible-passage-reference-parser/js/en_bcv_parser').bcv_parser

export const bibleParser = new bcv()
bibleParser.include_apocrypha(true)
bibleParser.set_options({
	consecutive_combination_strategy: 'separate',
	sequence_combination_strategy: 'separate',
	osis_compaction_strategy: 'bcv',
	passage_existence_strategy: 'none',
})

const ajv = new AJV()
addFormats(ajv)
const validate = ajv.compile(schema)

const glob = new Bun.Glob('**/*.json')

const data = {
	url: 'https://catholic-resources.org/Lectionary/1998USL.htm',
	name: 'Catholic Resources',
	lastUpdated: Temporal.Now.plainDateTimeISO('UTC').toString(),
	data: [] as NewData[],
}

const ISOWeekday = {
	Monday: 1,
	Tuesday: 2,
	Wednesday: 3,
	Thursday: 4,
	Friday: 5,
	Saturday: 6,
	Sunday: 7,
} as const

type OldData = {
	id?: string
	Week?: number
	Day?: string
	'First Reading'?: string
	'Second Reading'?: string
	'Responsorial Psalm'?: string
	Gospel?: string
}[]

type FileName = `YEAR_${number}-${string}.json`

const YEAR_MAP = {
	1: 'I',
	2: 'II',
}

function getReferences(reference?: string): BibleReference | undefined {
	if (!reference) return undefined

	const entities = bibleParser.parse(reference).parsed_entities()

	return {
		originalReference: reference,
		reference: entities.map((entity) => {
			const book = osisToUSFM(entity.start.b)
			const chapter = entity.start.c
			const verses = Array.from(
				{ length: entity.end.v - entity.start.v + 1 },
				(_, i) => entity.start.v + i
			)

			return {
				book,
				chapter,
				verses,
			}
		}),
	}
}

// Scans the current working directory and each of its sub-directories recursively
for await (const fileName of glob.scan(
	path.join(__dirname, '.')
) as unknown as FileName[]) {
	let year = fileName.match(/YEAR_(.+)-\w+\.json/)?.[1]
	if (!year) throw new Error('Year not found')
	if (year in YEAR_MAP) {
		year = YEAR_MAP[year]
	}

	const season = fileName.match(/YEAR_.+-(\w+)\.json/)?.[1]

	const oldData = (await Bun.file(
		path.join(__dirname, fileName)
	).json()) as OldData

	for (const item of oldData) {
		data.data.push({
			year,
			season,
			romcalId: getRomcalId({ ...item, season }),
			week: item.Week ? Number(item.Week) : undefined,
			day: item.Day ? ISOWeekday[item.Day] : undefined,
			first_reading: getReferences(item['First Reading']),
			second_reading: getReferences(item['First Reading']),
			responsorial_psalm: getReferences(item['Responsorial Psalm']),
			gospel: getReferences(item.Gospel),
		})
	}
}

const isValid = validate(data)
if (isValid) {
	console.log('Data is valid, saving')

	await Bun.write(
		path.join(__dirname, '../locale/Canada_En.json'),
		JSON.stringify(data, null, 2)
	)
} else {
	console.error(validate.errors)
}

function getRomcalId(item: {
	id?: string
	Week?: number
	Day?: string
	season?: Season
	year?: Year
}): string {
	if (item.id) return item.id
	if (!item.season || !item.Day || !item.Week) {
		throw new Error('Season not found', item)
	}
	return `${snakeCase(item.season)}_${item.Week}_${snakeCase(item.Day)}`
}
