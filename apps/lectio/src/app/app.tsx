import { useQuery } from '@tanstack/react-query'
import { eq } from 'drizzle-orm'
import { db } from '../db'
import { verses } from '../db/verses'

async function getVerse() {
  const data = (
    await db.select().from(verses).where(eq(verses.id, 'GEN 1:1')).limit(1)
  ).at(0)
  return data
}

export function App() {
  const { data, error, isLoading } = useQuery({
    queryKey: ['verse'],
    queryFn: getVerse,
  })

  return (
    <div className="text-blue-500">
      {isLoading ? <div>Loading...</div> : null}
      {data?.text}
      {error?.message}
    </div>
  )
}

export default App
