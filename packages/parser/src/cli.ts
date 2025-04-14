import { input } from '@inquirer/prompts'
import {
	createReadStream,
	existsSync,
	fstat,
	readFileSync,
	writeFileSync,
} from 'node:fs'
import { isOsisFormat, parseOSISBible } from './osis.ts'
import { firstNLinesOfFile } from './utils/firstNLinesOfFile.ts'
import { join } from 'node:path'

console.clear()

const filePath = await input({
	message: 'Enter the path to your bible file.',
	required: true,
	transformer(value, { isFinal }) {
		if (isFinal) {
			return value
		}

		return value.replaceAll("'", '')
	},
	async validate(filePath) {
		if (!existsSync(filePath)) {
			return 'File does not exist'
		}

		// Read the first 10 lines of the file just to be safe
		const first10Lines = await firstNLinesOfFile(filePath, 10)

		if (!isOsisFormat(first10Lines)) {
			return 'Please enter a valid osis file'
		}

		return true
	},
})

const translation = await input({
	message: 'What should the file name be? (i.e. rsv).',
	required: true,
	transformer(value, { isFinal }) {
		if (isFinal) {
			return value
		}

		return value.endsWith('.json') ? value : `${value}.json`
	},
})

const verses = await parseOSISBible(filePath)
writeFileSync(
	`./packages/bibles/${translation}`,
	JSON.stringify(verses, null, 2)
)
