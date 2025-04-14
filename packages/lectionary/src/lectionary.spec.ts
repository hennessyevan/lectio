import { Lectionary } from './lectionary'

describe('lectionary', () => {
	it('should work', async () => {
		const lectionary = new Lectionary({ locale: 'Canada_En' })

		console.log(await lectionary.lectionaryData('advent_1_sunday'))

		expect('lectionary').toEqual('lectionary')
	})
})
