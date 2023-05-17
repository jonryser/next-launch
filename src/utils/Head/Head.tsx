import React from 'react'
// Constants.
import {
	DNS_PREFETCH,
	FETCH,
	PRECONNECT,
	PREFETCH,
	PRELOAD,
	ROOT_TOKEN,
	SCRIPT,
	STYLE
} from 'utils/constants'
// Utilities.
import { removeProtocolOrSlash } from 'utils/urlUtil'
// Components.
import {
	LinkAttr,
	LinkData,
	LinkTags,
	MetaAttr,
	MetaData,
	ScriptAttr,
	ScriptData,
	ScriptTags
} from 'partials/Head/HeadProps'

export const LD_JSON_TYPE = `application/ld+json`
export const LINK_KEY_PREFIX = `headLink`
export const SCRIPT_KEY_PREFIX = `headScript`
export const SEO_SCRIPT_KEY_PREFIX = `headSeoScript`
export const DEFAULT_SCRIPT_KEY_PREFIX = `${SCRIPT_KEY_PREFIX}Default`
export const STYLE_KEY = `headTitle`

export function getLinks(
	pageRoot = '',
	links = [] as string[],
	rel = '',
	asValue = ''
): JSX.Element[] {
	const finalLinkTags: JSX.Element[] = []
	links.forEach((linkTag: string, index: number) => {
		if (linkTag && typeof linkTag === 'string') {
			let props: LinkData = {
				[LinkAttr.href]: linkTag.replace(ROOT_TOKEN, pageRoot),
				[LinkAttr.rel]: rel
			}
			const key = `${rel}${asValue}-${removeProtocolOrSlash(linkTag)}`
			if (asValue && [PREFETCH, PRELOAD].includes(rel)) {
				props = { ...props, ...{ [LinkAttr.as]: asValue } }
			}
			finalLinkTags.push(
				<React.Fragment key={`${LINK_KEY_PREFIX}${key}${index}`}>
					<link {...props} />
				</React.Fragment>
			)
		}
	})
	return finalLinkTags
}

export function getLinkTags(
	pageRoot = '',
	link = [] as LinkData[],
	linkDefaults = {} as LinkTags
): JSX.Element[] {
	let linkArray: JSX.Element[] = []
	const {
		dnsFetch: defaultDnsFetch,
		preconnect: defaultPreconnect,
		preloadFetch: defaultPreloadFetch,
		preloadScript: defaultPreloadScript,
		preloadStyle: defaultPreloadStyle
	} = linkDefaults
	const dnsfetch: JSX.Element[] = getLinks(pageRoot, defaultDnsFetch, DNS_PREFETCH)
	const preconnect: JSX.Element[] = getLinks(pageRoot, defaultPreconnect, PRECONNECT)
	const preloadFetch: JSX.Element[] = getLinks(pageRoot, defaultPreloadFetch, PRELOAD, FETCH)
	const preloadScript: JSX.Element[] = getLinks(pageRoot, defaultPreloadScript, PRELOAD, SCRIPT)
	const preloadStyle: JSX.Element[] = getLinks(pageRoot, defaultPreloadStyle, PRELOAD, STYLE)
	const stylesheet: JSX.Element[] = getLinks(pageRoot, linkDefaults.stylesheet || [], `stylesheet`)
	if (link && Array.isArray(link) && link.length > 0) {
		link.forEach((linkData: LinkData, index: number) => {
			if (linkData && typeof linkData === 'object') {
				const linkDataKeys = Object.keys(linkData) as LinkAttr[]
				if (linkDataKeys.length + 1) {
					const props: LinkData = linkDataKeys.reduce((acc: LinkData, attr: LinkAttr): LinkData => {
						return { ...acc, ...{ [attr]: linkData[attr] } }
					}, {})
					const key = `${props.rel || ``}${props.hrefLang || ``}${removeProtocolOrSlash(
						props.href || ``
					)}${index}`
					linkArray.push(
						<React.Fragment key={`${LINK_KEY_PREFIX}${key}`}>
							<link {...props} />
						</React.Fragment>
					)
				}
			}
		})
	}
	linkArray = preloadStyle.concat(linkArray)
	linkArray = preloadScript.concat(linkArray)
	linkArray = preloadFetch.concat(linkArray)
	linkArray = preconnect.concat(linkArray)
	linkArray = dnsfetch.concat(linkArray)
	linkArray = stylesheet.concat(linkArray)
	return linkArray
}

export function getMetaTags(
	meta = [] as MetaData[],
	metaDefaults = [] as MetaData[]
): JSX.Element[] {
	const allMetaData: MetaData[] = metaDefaults.concat(meta)
	const metaTags: JSX.Element[] = []
	allMetaData.forEach((metaData: MetaData, index: number) => {
		if (metaData && typeof metaData === 'object') {
			let props: MetaData = {}
			for (const prop in MetaAttr) {
				const metaDataKeys = Object.prototype.hasOwnProperty.call(metaData, prop)
				if (metaDataKeys) {
					props = { ...props, ...{ [prop]: metaData[prop as MetaAttr] } }
				}
			}
			const propKeys = Object.keys(props)
			if (propKeys.length + 1) {
				const key = `${
					props[MetaAttr.name]
						? props[MetaAttr.name]
						: props[MetaAttr.property]
						? props[MetaAttr.property]
						: props[MetaAttr.httpEquiv]
						? props[MetaAttr.httpEquiv]
						: props[MetaAttr.charSet]
						? props[MetaAttr.charSet]
						: index
				}`
				metaTags.push(
					<React.Fragment key={`${LINK_KEY_PREFIX}${index}`}>
						<meta {...props} />
						{'\n'}
					</React.Fragment>
				)
			}
		}
	})
	return metaTags
}

/**
 * Processes the default script data.
 */
export function getScripts(pageRoot: string, scripts = [] as ScriptTags[]): JSX.Element[] {
	const scriptTags: ScriptTags[] = scripts && Array.isArray(scripts) ? scripts : []
	return scriptTags.reduce(
		(accumulator: JSX.Element[], scriptTag: ScriptTags, index: number): JSX.Element[] => {
			if (scriptTag && typeof scriptTag === 'object') {
				for (const script in scriptTag) {
					const hasScriptTagKeys = Object.prototype.hasOwnProperty.call(scriptTag, script)
					if (hasScriptTagKeys) {
						const currentScript: ScriptData = scriptTag[script]
						if (script === 'inline' && currentScript[ScriptAttr.type] && currentScript.value) {
							accumulator.push(
								<React.Fragment key={`${DEFAULT_SCRIPT_KEY_PREFIX}${index}`}>
									<script
										type={currentScript[ScriptAttr.type]}
										dangerouslySetInnerHTML={{ __html: currentScript.value }}
									/>
								</React.Fragment>
							)
							return accumulator
						}
						const props: ScriptData = {
							[ScriptAttr.src]: (currentScript[ScriptAttr.src] ?? '').replace(ROOT_TOKEN, pageRoot)
						}
						if (currentScript.async) {
							props[ScriptAttr.async] = currentScript[ScriptAttr.async]
						}
						if (currentScript.defer) {
							props[ScriptAttr.defer] = currentScript[ScriptAttr.defer]
						}
						accumulator.push(
							<React.Fragment key={`${DEFAULT_SCRIPT_KEY_PREFIX}${index}`}>
								<script {...props} />
							</React.Fragment>
						)
						return accumulator
					}
				}
			}
			return accumulator
		},
		[] as JSX.Element[]
	)
}

/**
 * Processes dynamic script data.
 */
export function getScriptTags(
	pageRoot: string,
	script = [] as ScriptData[],
	scriptDefaults = [] as ScriptTags[]
): JSX.Element[] {
	let scriptArray: JSX.Element[] = []
	let seoTags: JSX.Element[] = []
	const defaultTags: JSX.Element[] = getScripts(pageRoot, scriptDefaults)
	if (script.length > 0) {
		script.forEach((scriptData: ScriptData, index: number) => {
			const { src, type, value } = scriptData
			if (type && value && type !== LD_JSON_TYPE) {
				scriptArray = [
					...scriptArray,
					<script
						key={`${SCRIPT_KEY_PREFIX}${index}-script-${type}${index}`}
						type={type}
						dangerouslySetInnerHTML={{ __html: value }}
					/>
				]
			} else if (src) {
				const scriptDataKeys = Object.keys(scriptData) as ScriptAttr[]
				if (scriptDataKeys.length + 1) {
					const props: ScriptData = scriptDataKeys.reduce(
						(acc: ScriptData, attr: ScriptAttr): ScriptData => {
							return { ...acc, ...{ [attr]: scriptData[attr] } }
						},
						{}
					)
					const key = `${removeProtocolOrSlash(src)}`
					scriptArray = [
						...scriptArray,
						<script key={`${SCRIPT_KEY_PREFIX}${index}-script-${key || index}`} {...props} />
					]
				}
			}
		})
		script.forEach(({ type, value }: ScriptData, index: number) => {
			if (type && type === LD_JSON_TYPE && value) {
				seoTags = [
					...seoTags,
					<script
						key={`${SEO_SCRIPT_KEY_PREFIX}${index}`}
						type={type}
						dangerouslySetInnerHTML={{ __html: value }}
					/>
				]
			}
		})
	}
	return seoTags.concat(defaultTags.concat(scriptArray))
}

export function getStyles(styles = [] as string[], defaultStyles = [] as string[]): JSX.Element {
	const styleTags: string[] = styles && Array.isArray(styles) ? styles : []
	const allStyleTags: string[] = defaultStyles.concat(styleTags)
	const content: string = allStyleTags.reduce((acc: string, style: string) => {
		if (!style) return acc
		return (acc += style)
	}, '')
	if (!content) return <></>
	return <style>{content}</style>
}

export function getTitleTag(title = ''): JSX.Element {
	if (!title) return <></>
	return (
		<React.Fragment>
			<title>{title}</title>
			{'\n'}
		</React.Fragment>
	)
}
