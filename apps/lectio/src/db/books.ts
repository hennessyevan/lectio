import { sqliteTable, int, text } from 'drizzle-orm/sqlite-core'

export const books = sqliteTable('books', {
	book_number: int('book_number').notNull(),
	long_name: text('long_name'),
	id: text('id').primaryKey().notNull(),
})
