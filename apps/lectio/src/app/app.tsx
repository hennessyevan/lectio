import {
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Separator,
} from '@lectio/ui'
import { useQuery } from '@tanstack/react-query'
import { and, eq } from 'drizzle-orm'
import { db, importBible, useBibleTranslation } from '../db'
import { books } from '../db/books'
import { verses } from '../db/verses'
import { useLiturgicalDay } from '../hooks/useLiturgicalDay'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { TEXT_COLORS } from '../components/constants'

async function getVerse({
  queryKey,
}: {
  queryKey: [type: string, book: number, chapter: number, translation: string]
}) {
  const [, book, chapter] = queryKey

  const data = await db
    .select()
    .from(verses)
    .where(and(eq(verses.book_number, book), eq(verses.chapter, chapter)))

  return data
}

const translations = import.meta.glob('../../../../packages/bibles/*.sqlite')

export function App() {
  const { today } = useLiturgicalDay({})

  const [currentTranslation, setTranslation] = useBibleTranslation()
  const [currentBook, setCurrentBook] = useLocalStorage<string | number>(
    'book',
    10
  )
  const [chapter, setChapter] = useLocalStorage<string | number>('chapter', 1)

  const verseQuery = useQuery({
    queryKey: ['verse', +currentBook, +chapter, currentTranslation],
    queryFn: getVerse,
  })

  const booksQuery = useQuery({
    queryKey: ['books', currentTranslation],
    queryFn: async () => {
      const data = await db.select().from(books).all()

      return data
    },
  })

  const chaptersQuery = useQuery({
    queryKey: ['chapters', +currentBook, currentTranslation],
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

  const textColor =
    TEXT_COLORS[
      (today?.colors.at(0) as keyof typeof TEXT_COLORS) ?? TEXT_COLORS.BLACK
    ]

  return (
    <div className="space-y-6 p-10 pb-16 block">
      <div className="space-y-0.5">
        <h2 className="text-2xl font-bold tracking-tight uppercase">
          {currentTranslation}
        </h2>
        <p className="text-muted-foreground">Read the bible offline</p>
      </div>
      <Separator className="my-6" />
      <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
        <aside className="lg:w-1/5 flex flex-col gap-5 strok">
          <span className={textColor}>{today?.name}</span>
          <Select
            value={currentTranslation}
            onValueChange={(value) => setTranslation(value)}
          >
            <Label>Translation</Label>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select a chapter" />
            </SelectTrigger>
            <SelectContent>
              {Object.keys(translations)
                .map((key) => /\/(\w+)\.sqlite/.exec(key)?.[1])
                .filter(Boolean)
                .map((translation) => (
                  <SelectItem key={translation} value={translation}>
                    {translation}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
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
            <span id={verse.id} key={verse.id}>
              <span className="text-xs relative -top-2 pr-1 text-gray-500">
                {verse.verse}
              </span>
              {verse.text + ' '}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

export default App
