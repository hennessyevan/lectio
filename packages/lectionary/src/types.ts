export type BibleReference = {
	originalReference: string
	reference: {
		book: string
		chapter: number
		verses: number[]
	}[]
}

export type Season =
	| 'ADVENT'
	| 'CHRISTMAS'
	| 'ORDINARY_TIME'
	| 'LENT'
	| 'EASTER'

export type Year = 'A' | 'B' | 'C' | 'I' | 'II'

export type Data = {
	'First Reading'?: BibleReference[]
	'Responsorial Psalm'?: BibleReference[]
	'Second Reading'?: BibleReference[]
	Gospel?: BibleReference[]
	romcalId: string
	year?: Year
	season?: Season
	Week?: number
	Day?:
		| 'Monday'
		| 'Tuesday'
		| 'Wednesday'
		| 'Thursday'
		| 'Friday'
		| 'Saturday'
		| 'Sunday'
}

export type ISO8601Date = `${number}-${number}-${number}`
