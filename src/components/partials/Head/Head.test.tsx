import { faker } from '@faker-js/faker'
import { render } from '@testing-library/react'
import React from 'react'
// Components.
import Head from './Head'

const headData1 = {
	link: [
		{
			href: faker.internet.url(),
			hrefLang: `en`,
			rel: faker.lorem.words()
		},
		{
			href: faker.internet.url(),
			hrefLang: `fr`,
			rel: faker.lorem.words()
		}
	],
	script: [
		{
			type: faker.lorem.words(),
			value: faker.lorem.words()
		},
		{
			type: faker.lorem.words(),
			value: faker.lorem.words()
		}
	],
	scriptCall: [
		{
			async: true,
			defer: true,
			src: faker.internet.url(),
			type: `application/javascript`
		},
		{
			src: faker.internet.url()
		}
	],
	title: faker.lorem.words(5)
}

const headData2 = {
	link: [
		{
			href: faker.internet.url(),
			hrefLang: `fr`,
			rel: faker.lorem.words()
		},
		{
			href: faker.internet.url(),
			hrefLang: `en`,
			rel: faker.lorem.words()
		}
	],
	script: [
		{
			type: faker.lorem.words(),
			value: faker.lorem.words()
		},
		{
			type: faker.lorem.words(),
			value: faker.lorem.words()
		}
	],
	title: faker.lorem.words(5)
}

const headData3 = {}

const headData4 = {
	link: [
		{
			hrefLang: `es`
		}
	],
	script: [
		{
			value: faker.lorem.words()
		},
		{
			type: faker.lorem.words()
		}
	],
	title: faker.lorem.words(5)
}

describe(`Head `, () => {
	it(`should render correctly initially and then when the passed data changes and again when no data is passed.`, () => {
		const { rerender } = render(<Head data={headData1} root={''} />)
		expect(document.head.querySelector(`link[href="${headData1.link[0].href}"]`)).toBeDefined()
		expect(document.head.querySelector(`link[href="${headData1.link[1].href}"]`)).toBeDefined()
		expect(document.head.querySelector(`script[type="${headData1.script[0].type}"]`)).toBeDefined()
		expect(document.head.querySelector(`script[type="${headData1.script[1].type}"]`)).toBeDefined()

		rerender(<Head data={headData2} root={''} />)
		expect(document.head.querySelector(`link[href="${headData2.link[0].href}"]`)).toBeDefined()
		expect(document.head.querySelector(`link[href="${headData2.link[1].href}"]`)).toBeDefined()
		expect(document.head.querySelector(`script[type="${headData2.script[0].type}"]`)).toBeDefined()
		expect(document.head.querySelector(`script[type="${headData2.script[1].type}"]`)).toBeDefined()

		rerender(<Head data={headData3} root={''} />)
		expect(document.head.querySelector(`link[href]`)).toBeNull()
		expect(document.head.querySelector(`script[type]`)).toBeNull()
	})

	it(`should render correctly initially and then when new data is passed that is identical.`, () => {
		const { rerender } = render(<Head data={headData1} root={''} />)
		expect(document.head.querySelector(`link[href="${headData1.link[0].href}"]`)).toBeDefined()

		rerender(<Head data={headData1} root={''} />)
		expect(document.head.querySelector(`link[href="${headData1.link[0].href}"]`)).toBeDefined()
	})

	it(`should render correctly when data is passed does not contain complete or valid content.`, () => {
		render(<Head data={headData4} root={''} />)
		expect(
			document.head.querySelector(`link[hrefLang="${headData4.link[0].hrefLang}"]`)
		).toBeDefined()
	})

	it(
		`should NOT render when NO data is passed and ` +
			`should render when props are updated with data.`,
		() => {
			const { rerender } = render(<Head data={{}} root={''} />)
			expect(document.head.querySelector(`link[href]`)).toBeNull()
			expect(document.head.querySelector(`script[type]`)).toBeNull()

			rerender(<Head data={headData2} root={''} />)
			expect(document.head.querySelector(`link[href="${headData2.link[0].href}"]`)).toBeDefined()
			expect(document.head.querySelector(`link[href="${headData2.link[1].href}"]`)).toBeDefined()
			expect(
				document.head.querySelector(`script[type="${headData2.script[0].type}"]`)
			).toBeDefined()
			expect(
				document.head.querySelector(`script[type="${headData2.script[1].type}"]`)
			).toBeDefined()
		}
	)

	it(
		`should NOT render when NO data is passed and ` +
			`should still not render when props are updated with no data.`,
		() => {
			const { rerender } = render(<Head data={{}} root={''} />)
			expect(document.head.querySelector(`link[href]`)).toBeNull()
			expect(document.head.querySelector(`script[type]`)).toBeNull()

			rerender(<Head data={{}} root={''} />)
			expect(document.head.querySelector(`link[href]`)).toBeNull()
			expect(document.head.querySelector(`script[type]`)).toBeNull()
		}
	)
})
