import { useQuery } from '@tanstack/react-query'
import { Romcal } from 'romcal'

// @ts-expect-error -- no types
import { Canada_En } from '@romcal/calendar.canada'
const romcal = new Romcal({ localizedCalendar: Canada_En })

export function useLiturgicalDay({ date = new Date() }: { date?: Date } = {}) {
  const { data: calendar } = useQuery({
    queryKey: ['liturgicalDay'],
    queryFn: async () => romcal.generateCalendar(),
  })

  date.setDate(date.getDate() - 1)
  const today = calendar?.[date.toISOString().slice(0, 10)]?.[0]

  return { calendar, today }
}
