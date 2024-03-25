import { sqliteTable, int, text } from 'drizzle-orm/sqlite-core'

export const verses = sqliteTable('verses', {
  book_number: int('book_number'),
  chapter: int('chapter'),
  verse: int('verse'),
  text: text('text').default(''),
  id: text('id').primaryKey(),
  // story: text().relation({ fields: ['id'], references: ['id'], referencesTable: 'stories' })
})
