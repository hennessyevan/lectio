import { BaseRomcalBundle, LiturgicalCalendar, Romcal } from 'romcal'
import { Temporal } from 'temporal-polyfill'
import { Data, ISO8601Date } from './types'

type SupportedLocales = 'Canada_En'

function isISO8601Date(date: string): date is ISO8601Date {
	try {
		return Temporal.PlainDate.from(date).toString() === date
	} catch (error) {
		return false
	}
}

export class Lectionary {
	#locale: SupportedLocales
	#localeBundle?: BaseRomcalBundle
	#lectionaryData?: { data: Data[] }
	#romcal?: LiturgicalCalendar

	constructor(options: { locale: SupportedLocales }) {
		this.#locale = options.locale
	}

	async #loadBundle() {
		const bundle = await import('@romcal/calendar.canada')
		this.#localeBundle = bundle[this.#locale]
		this.#romcal = await new Romcal({
			localizedCalendar: this.#localeBundle,
		}).generateCalendar(Temporal.Now.plainDateISO().year)
		this.#lectionaryData = await import(`../locale/${this.#locale}.json`)
	}

	async lectionaryData(
		identifier: ISO8601Date | string
	): Promise<Data | undefined> {
		if (!this.#romcal || !this.#lectionaryData) {
			await this.#loadBundle()
		}

		if (!this.#romcal || !this.#lectionaryData) {
			throw new Error('Failed to load lectionary data')
		}

		let id = identifier
		if (isISO8601Date(identifier)) {
			id = this.#romcal[identifier]?.[0]?.id
			if (!id) return
		}

		const data = this.#lectionaryData.data.find((d) => d.romcalId === id)

		return data
	}
}
