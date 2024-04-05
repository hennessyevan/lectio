import { useQuery } from '@tanstack/react-query'
import { Romcal } from 'romcal'
import { Temporal } from 'temporal-polyfill'

// @ts-expect-error -- no types
import { Canada_En } from '@romcal/calendar.canada'

const romcal = new Romcal({ localizedCalendar: Canada_En })

export function useLiturgicalDay({
	date = Temporal.Now.plainDateISO(),
}: { date?: Temporal.PlainDate } = {}) {
	const { data: calendar } = useQuery({
		queryKey: ['liturgicalDay'],
		queryFn: async () => romcal.generateCalendar(),
	})

	const today = calendar?.[date.toString()]?.[0]

	return { calendar, today }
}
