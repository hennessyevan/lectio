import { useQuery } from '@tanstack/react-query'
import { eq } from 'drizzle-orm'
import { db } from '../db'
import { verses } from '../db/verses'
import { Separator } from '@lectio/ui'

async function getVerse() {
  const data = (
    await db.select().from(verses).where(eq(verses.id, 'GEN 1:1')).limit(1)
  ).at(0)
  return data
}

export function App() {
  const { data, isLoading } = useQuery({
    queryKey: ['verse'],
    queryFn: getVerse,
  })

  return (
    <div className="hidden space-y-6 p-10 pb-16 md:block">
      <div className="space-y-0.5">
        <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground">
          Manage your account settings and set e-mail preferences.
        </p>
      </div>
      <Separator className="my-6" />
      <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
        <aside className="-mx-4 lg:w-1/5">
          {/* <SidebarNav items={sidebarNavItems} /> */}
        </aside>
        <div className="flex-1 lg:max-w-2xl">
          {/* <Outlet /> */}
          {isLoading ? 'Loading' : data?.text}
        </div>
      </div>
    </div>
  )
}

export default App
