import readline from 'node:readline'
import { createReadStream } from 'node:fs'

export async function firstNLinesOfFile(
	filePath: string,
	n: number
): Promise<string> {
	const fileStream = createReadStream(filePath)
	const rl = readline.createInterface({
		input: fileStream,
		crlfDelay: Infinity,
	})

	let lines = ''
	let i = 0
	for await (const line of rl) {
		lines += line + '\n'
		i++
		if (i === n) {
			break
		}
	}

	return lines
}
