import type { Config } from 'drizzle-kit'

export default {
	schema: './apps/lectio/src/db/schema.ts',
	out: './apps/lectio/src/db/migrations',
	driver: 'better-sqlite',
} satisfies Config
