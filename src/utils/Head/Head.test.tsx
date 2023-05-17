import { faker } from '@faker-js/faker'
import { render } from '@testing-library/react'
import React from 'react'
// Constants.
import {
	DNS_PREFETCH,
	FETCH,
	PRECONNECT,
	PRELOAD,
	ROOT_TOKEN,
	SCRIPT,
	STYLE
} from 'utils/constants'
import { ScriptAttr } from 'partials/Head/HeadProps'
// Components.
import {
	DEFAULT_SCRIPT_KEY_PREFIX,
	LD_JSON_TYPE,
	getLinkTags,
	getLinks,
	getMetaTags,
	getScriptTags,
	getScripts,
	getStyles,
	getTitleTag
} from './Head'

const domain = `${faker.internet.protocol}://${faker.internet.domainName}/`
const inlineJsType = `text/javascript`
const pageRoot = faker.system.directoryPath()
const path = faker.system.filePath()
const sampleJs = `console.log('Hello World!')`

describe(`getLinks `, () => {
	it(`should return built link elements.`, () => {
		const data = [`${domain}${path}`, `${domain}${ROOT_TOKEN}${path}`]
		const as = faker.lorem.word()
		const rel = faker.lorem.word()
		let elements: JSX.Element[] = getLinks(pageRoot, data, rel, as)

		expect(elements[0].props.children.props).toMatchObject({ href: data[0], rel })
		expect(elements[1].props.children.props).toMatchObject({
			href: `${domain}${pageRoot}${path}`,
			rel
		})

		elements = getLinks(pageRoot, data, PRELOAD, as)

		expect(elements[0].props.children.props).toMatchObject({ as, href: data[0], rel: PRELOAD })
		expect(elements[1].props.children.props).toMatchObject({
			as,
			href: `${domain}${pageRoot}${path}`,
			rel: PRELOAD
		})
	})

	it(`should return an empty list.`, () => {
		expect(getLinks()).toEqual([])
	})
})

describe(`getLinkTags `, () => {
	const defaultData = {
		preconnect: [`${domain}`],
		preloadFetch: [`${domain}`],
		preloadScript: [`${domain}`],
		preloadStyle: [`${domain}`]
	}
	it('returns an empty array when no data is passed', () => {
		const elements = getLinkTags()
		expect(elements).toEqual([])
	})

	it('returns an empty array when linkData is an empty array', () => {
		const elements = getLinkTags(pageRoot, [])
		expect(elements).toEqual([])
	})

	it('returns created link tags when linkData is present', () => {
		const data = [
			{
				rel: DNS_PREFETCH,
				href: faker.internet.url()
			},
			{
				rel: FETCH,
				href: faker.internet.url()
			}
		]
		const elements = getLinkTags(pageRoot, data, defaultData)
		expect(elements[0].props.children.props).toMatchObject({
			href: defaultData.preconnect[0],
			rel: PRECONNECT
		})
		expect(elements[1].props.children.props).toMatchObject({
			href: defaultData.preloadFetch[0],
			rel: PRELOAD,
			as: FETCH
		})
		expect(elements[2].props.children.props).toMatchObject({
			href: defaultData.preloadScript[0],
			rel: PRELOAD,
			as: SCRIPT
		})
		expect(elements[3].props.children.props).toMatchObject({
			href: defaultData.preloadStyle[0],
			rel: PRELOAD,
			as: STYLE
		})
		expect(elements[4].props.children.props).toMatchObject({ href: data[0].href, rel: data[0].rel })
		expect(elements[5].props.children.props).toMatchObject({ href: data[1].href, rel: data[1].rel })
	})
})

describe('getMetaTags', () => {
	const data = [
		{ name: faker.lorem.word(), content: faker.lorem.words(3) },
		{ property: faker.lorem.word(), content: faker.lorem.words(3) }
	]
	const defaults = [
		{ name: faker.lorem.word(), content: faker.lorem.words(3) },
		{ property: faker.lorem.word(), content: faker.lorem.words(3) }
	]

	it('returns an empty array when no data is passed', () => {
		const elements = getMetaTags()
		expect(elements).toEqual([])
	})

	it('returns tags with default metadata when no custom metadata is provided', () => {
		const elements = getMetaTags(undefined, defaults)
		expect(elements[0].props.children[0].props).toMatchObject({
			content: defaults[0].content,
			name: defaults[0].name
		})
		expect(elements[1].props.children[0].props).toMatchObject({
			content: defaults[1].content,
			property: defaults[1].property
		})
	})

	it('returns tags with custom metadata when provided', () => {
		const elements = getMetaTags(data)
		expect(elements[0].props.children[0].props).toMatchObject({
			content: data[0].content,
			name: data[0].name
		})
		expect(elements[1].props.children[0].props).toMatchObject({
			content: data[1].content,
			property: data[1].property
		})
	})

	it('merges default and custom metadata', () => {
		const elements = getMetaTags(data, defaults)
		expect(elements[0].props.children[0].props).toMatchObject({
			content: defaults[0].content,
			name: defaults[0].name
		})
		expect(elements[1].props.children[0].props).toMatchObject({
			content: defaults[1].content,
			property: defaults[1].property
		})
		expect(elements[2].props.children[0].props).toMatchObject({
			content: data[0].content,
			name: data[0].name
		})
		expect(elements[3].props.children[0].props).toMatchObject({
			content: data[1].content,
			property: data[1].property
		})
	})
})

describe('getScripts', () => {
	const data = [
		{ name: faker.lorem.word(), content: faker.lorem.words(3) },
		{ property: faker.lorem.word(), content: faker.lorem.words(3) }
	]
	const defaults = [
		{ name: faker.lorem.word(), content: faker.lorem.words(3) },
		{ property: faker.lorem.word(), content: faker.lorem.words(3) }
	]
	const jsFileName = faker.system.commonFileName('js')
	const expectedKey = `${DEFAULT_SCRIPT_KEY_PREFIX}0`

	it('should return an empty array when no data is passed', () => {
		const elements = getScripts('')
		expect(elements).toEqual([])
	})

	it('should generate script tags with default attributes when no custom attributes are provided', () => {
		const elements = getScripts(pageRoot, [
			{ [ScriptAttr.src]: { [ScriptAttr.src]: `${ROOT_TOKEN}${jsFileName}` } }
		])

		expect(elements).toEqual([
			<React.Fragment key={expectedKey}>
				<script src={`${pageRoot}${jsFileName}`} />
			</React.Fragment>
		])
	})

	it('should handle inline scripts', () => {
		const data = { inline: { type: inlineJsType, value: sampleJs } }
		const elements = getScripts(pageRoot, [data])

		expect(elements).toEqual([
			<React.Fragment key={expectedKey}>
				<script type={inlineJsType} dangerouslySetInnerHTML={{ __html: data.inline.value }} />
			</React.Fragment>
		])
	})

	it('should generate script tags with custom attributes', () => {
		const elements = getScripts(pageRoot, [
			{
				[ScriptAttr.src]: {
					[ScriptAttr.src]: jsFileName,
					[ScriptAttr.async]: true,
					[ScriptAttr.defer]: true
				}
			}
		])

		expect(elements).toEqual([
			<React.Fragment key={expectedKey}>
				<script src={jsFileName} async defer />
			</React.Fragment>
		])
	})

	it('should generate multiple script tags', () => {
		const jsFileName2 = faker.system.commonFileName('js')
		const data = [
			{ [ScriptAttr.src]: { [ScriptAttr.src]: jsFileName } },
			{ [ScriptAttr.src]: { [ScriptAttr.src]: jsFileName2 } }
		]
		const elements = getScripts('/', data)

		expect(elements).toEqual([
			<React.Fragment key={expectedKey}>
				<script src={jsFileName} />
			</React.Fragment>,
			<React.Fragment key={`${DEFAULT_SCRIPT_KEY_PREFIX}1`}>
				<script src={jsFileName2} />
			</React.Fragment>
		])
	})
})

describe('getScriptTags', () => {
	const data1 = {
		src: faker.internet.url(),
		type: inlineJsType,
		async: true
	}

	const data2 = {
		src: faker.internet.url(),
		type: inlineJsType,
		defer: true
	}

	const data3 = {
		value: sampleJs,
		type: inlineJsType
	}

	const data4 = {
		value: JSON.stringify({
			'@context': faker.internet.url(),
			'@type': 'WebPage'
		}),
		type: LD_JSON_TYPE
	}

	const data5 = {
		src: faker.internet.url()
	}

	const defaultData = [
		{
			analytics: {
				src: `${faker.internet.url({ appendSlash: false })}${faker.system.filePath()}`,
				async: true,
				defer: true
			}
		}
	]

	test('should create script tag based on script data with src and type', () => {
		const scripts = [data1]
		const elements = getScriptTags('', scripts)
		expect(elements).toHaveLength(1)
		const element = elements[0]
		expect(element.props).toHaveProperty('type', data1.type)
		expect(element.props).toHaveProperty('src', data1.src)
		expect(element.props).toHaveProperty('async', data1.async)
	})

	test('should create script tag based on script data with src and defer', () => {
		const scripts = [data2]
		const elements = getScriptTags('', scripts)
		expect(elements).toHaveLength(1)
		const element = elements[0]
		expect(element.props).toHaveProperty('type', data2.type)
		expect(element.props).toHaveProperty('src', data2.src)
		expect(element.props).toHaveProperty('defer', data2.defer)
	})

	test('should create inline script tag based on script data with value and type', () => {
		const scripts = [data3]
		const elements = getScriptTags('', scripts)
		expect(elements).toHaveLength(1)
		const element = elements[0]
		expect(element.props).toHaveProperty('type', data3.type)
		expect(element.props).toHaveProperty('dangerouslySetInnerHTML.__html', data3.value)
	})

	test('should create script tag for JSON-LD script data', () => {
		const scripts = [data4]
		const elements = getScriptTags('', scripts)
		expect(elements).toHaveLength(1)
		const element = elements[0]
		expect(element.props).toHaveProperty('type', data4.type)
		expect(element.props).toHaveProperty('dangerouslySetInnerHTML.__html', data4.value)
	})

	test('should create script tag based on script data with only src', () => {
		const scripts = [data5]
		const elements = getScriptTags('', scripts)
		expect(elements).toHaveLength(1)
		const element = elements[0]
		expect(element.props).toHaveProperty('src', data5.src)
	})

	test('should include default script tags', () => {
		const elements = getScriptTags('', [], defaultData)
		expect(elements).toHaveLength(1)
		const element = elements[0]
		expect(element.props.children.props).toHaveProperty('async', defaultData[0].analytics.async)
		expect(element.props.children.props).toHaveProperty('defer', defaultData[0].analytics.defer)
		expect(element.props.children.props).toHaveProperty('src', defaultData[0].analytics.src)
	})
})

describe('getStyles', () => {
	const styles = [`:root{color:black}`, `body{color:red}`]
	const defaultStyles = [`:root{color:green}`, `body{color:blue}`]

	it('should return expected style tag with styles', () => {
		const element = getStyles(styles, defaultStyles)
		expect(element).toEqual(
			<style>{`${defaultStyles[0]}${defaultStyles[1]}${styles[0]}${styles[1]}`}</style>
		)
	})

	it('should return expected style tag with only defaultStyles', () => {
		const element = getStyles([], defaultStyles)
		expect(element).toEqual(<style>{`${defaultStyles[0]}${defaultStyles[1]}`}</style>)
	})

	it('should return expected style tag with only styles', () => {
		const element = getStyles(styles, [])
		expect(element).toEqual(<style>{`${styles[0]}${styles[1]}`}</style>)
	})

	it('should return empty JSX with no styles', () => {
		const element = getStyles([], [])
		expect(element).toEqual(<></>)
	})
})

describe('getTitle', () => {
	const title = faker.lorem.words(5)

	it('should return expected title tag with passed title', () => {
		const element = getTitleTag(title)
		expect(element).toEqual(
			<React.Fragment>
				<title>{title}</title>
				{'\n'}
			</React.Fragment>
		)
	})

	it('should return empty JSX with no passed title', () => {
		const element = getTitleTag()
		expect(element).toEqual(<></>)
	})
})
