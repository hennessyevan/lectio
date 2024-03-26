import {
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
  Separator,
} from '@lectio/ui'
import { useQuery } from '@tanstack/react-query'
import { and, eq } from 'drizzle-orm'
import { useState } from 'react'
import { db } from '../db'
import { books } from '../db/books'
import { verses } from '../db/verses'

async function getVerse({
  queryKey,
}: {
  queryKey: [type: string, book: number, chapter: number]
}) {
  const [, book, chapter] = queryKey

  const data = await db
    .select()
    .from(verses)
    .where(and(eq(verses.book_number, book), eq(verses.chapter, chapter)))

  return data
}

export function App() {
  const [currentBook, setCurrentBook] = useState<string | number>(10)
  const [chapter, setChapter] = useState<string | number>(1)

  const verseQuery = useQuery({
    queryKey: ['verse', +currentBook, +chapter],
    queryFn: getVerse,
  })

  const booksQuery = useQuery({
    queryKey: ['books'],
    queryFn: async () => {
      const data = await db.select().from(books).all()

      return data
    },
  })

  const chaptersQuery = useQuery({
    queryKey: ['chapters', +currentBook],
    queryFn: async () => {
      const data = await db
        .select()
        .from(verses)
        .where(eq(verses.book_number, +currentBook))
        .groupBy(verses.chapter)
        .all()

      return [...new Set(data.map((verse) => verse.chapter))]
    },
  })

  return (
    <div className="hidden space-y-6 p-10 pb-16 md:block">
      <div className="space-y-0.5">
        <h2 className="text-2xl font-bold tracking-tight">NRSVCE</h2>
        <p className="text-muted-foreground">Read the bible offline</p>
      </div>
      <Separator className="my-6" />
      <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
        <aside className="-mx-4 lg:w-1/5 flex flex-col gap-5">
          <Select
            value={String(currentBook)}
            onValueChange={(value) => setCurrentBook(+value)}
          >
            <Label>Book</Label>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select a book" />
            </SelectTrigger>
            <SelectContent>
              {booksQuery.data?.map((book) => (
                <SelectItem key={book.id} value={String(book.book_number)}>
                  {book.long_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={String(chapter)}
            onValueChange={(value) => setChapter(+value)}
          >
            <Label>Chapter</Label>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select a chapter" />
            </SelectTrigger>
            <SelectContent>
              {chaptersQuery.data?.map((chapter) => (
                <SelectItem key={chapter} value={String(chapter)}>
                  {chapter}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </aside>
        <div className="flex-1 lg:max-w-2xl font-serif">
          {verseQuery.data?.map((verse) => (
            <span id={verse.id} key={verse.id} data-number={verse.verse}>
              {verse.text + ' '}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

export default App
