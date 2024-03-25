type SQLFunction = <T extends Record<string, unknown>[]>(
  queryTemplate: TemplateStringsArray,
  ...params: unknown[]
) => Promise<T>

const migrations = import.meta.glob('./migrations/*.sql?raw', { eager: true })

export async function migrate(sql: SQLFunction) {
  for (const [, sqlCommand] of Object.entries(migrations)) {
    await sql([sqlCommand] as unknown as TemplateStringsArray)
  }
}
