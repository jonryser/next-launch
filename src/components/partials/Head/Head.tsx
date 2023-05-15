import NextHead from 'next/head'
import React from 'react'
// Constants.
import { ROOT_TOKEN } from 'utils/constants'
// Utilities.
import { removeProtocolOrSlash } from 'utils/index'
// Components.
import HeadProps, {
	HeadData,
	LinkAttr,
	LinkData,
	LinkTags,
	MetaAttr,
	MetaData,
	ScriptAttr,
	ScriptData,
	ScriptTags
} from './HeadProps'
import HeadState from './HeadState'

/**
 * NOTE: keys should be generated in the following convention:
 * {tagName}-{{relValueIfAvailable}-}{srcWithProtocolRemovedOrFronSlasheRemoved}
 */
export default class Head extends React.PureComponent<HeadProps, HeadState> {
	constructor(props: HeadProps) {
		super(props)
		this.state = this.buildStateObject(props.data || {})
	}

	// This should be looked at and potentially updated to getDerivedStateFromProps in future versions.
	// UNSAFE_componentWillReceiveProps will go away in React version 17!!!
	UNSAFE_componentWillReceiveProps(nextProps: HeadProps) {
		const newData = nextProps.data || {}
		if (JSON.stringify(newData) !== JSON.stringify(this.props.data || {})) {
			this.setState(this.buildStateObject(newData))
		}
	}

	render() {
		const state: HeadState = this.state
		return this.props.data || this.props.default ? (
			<NextHead>
				{/* Meta tags MUST be first. DO NOT add anything above these. */}
				{state.meta}
				{/* Title MUST come after meta tags. DO NOT add anything above this. */}
				{state.title}
				{state.link}
				{state.style}
				{this.props.children}
				{state.script}
			</NextHead>
		) : null
	}

	private buildStateObject = (data: HeadData): HeadState => {
		return {
			link: this.getLinkTags(data.link || []),
			meta: this.getMetaTags(data.meta || []),
			script: this.getScriptTags(data.script || []),
			style: this.getStyles(),
			title: this.getTitleTag(data.title || '')
		}
	}

	private getLinks = (link: string[], rel: string, asValue?: string): JSX.Element[] => {
		const linkTags: string[] = link && Array.isArray(link) ? link : []
		const finalLinkTags: JSX.Element[] = []
		linkTags.forEach((linkTag: string, index: number) => {
			if (linkTag && typeof linkTag === 'string') {
				let props: LinkData = {
					[LinkAttr.href]: linkTag.replace(ROOT_TOKEN, this.props.root),
					[LinkAttr.rel]: rel
				}
				const key = `${rel}${asValue || ``}-${removeProtocolOrSlash(linkTag)}`
				if (asValue) {
					props = { ...props, ...{ [LinkAttr.as]: asValue } }
				}
				finalLinkTags.push(
					<React.Fragment key={`headLinkDefault${key}${index}`}>
						<link key={`link-${key}`} {...props} />
					</React.Fragment>
				)
			}
		})
		return finalLinkTags
	}

	private getLinkTags = (link: LinkData[]): JSX.Element[] => {
		let linkArray: JSX.Element[] = []
		const linkDefaults: LinkTags =
			this.props.default && this.props.default.link ? this.props.default.link : {}
		const dnsfetch: JSX.Element[] = this.getLinks(linkDefaults.dnsFetch || [], `dns-prefetch`)
		const preconnect: JSX.Element[] = this.getLinks(linkDefaults.preconnect || [], `preconnect`)
		const preloadFetch: JSX.Element[] = this.getLinks(
			linkDefaults.preloadFetch || [],
			`preload`,
			`fetch`
		)
		const preloadScript: JSX.Element[] = this.getLinks(
			linkDefaults.preloadScript || [],
			`preload`,
			`script`
		)
		const preloadStyle: JSX.Element[] = this.getLinks(
			linkDefaults.preloadStyle || [],
			`preload`,
			`style`
		)
		const stylesheet: JSX.Element[] = this.getLinks(linkDefaults.stylesheet || [], `stylesheet`)
		if (link && Array.isArray(link) && link.length > 0) {
			link.forEach((linkData: LinkData, index: number) => {
				if (linkData && typeof linkData === 'object') {
					const linkDataKeys = Object.keys(linkData) as LinkAttr[]
					if (linkDataKeys.length + 1) {
						const props: LinkData = linkDataKeys.reduce(
							(acc: LinkData, attr: LinkAttr): LinkData => {
								return { ...acc, ...{ [attr]: linkData[attr] } }
							},
							{}
						)
						const key = `${props.rel || ``}${props.hrefLang || ``}${removeProtocolOrSlash(
							props.href || ``
						)}`
						linkArray.push(
							<React.Fragment key={`headLink${index}`}>
								<link key={`link-${key || index}`} {...props} />
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

	private getMetaTags = (meta: MetaData[]): JSX.Element[] => {
		const metaDefaults: MetaData[] =
			this.props.default && this.props.default.meta ? this.props.default.meta : []
		const metaTags: MetaData[] = meta && Array.isArray(meta) ? meta : []
		const allMetaTags: MetaData[] = metaDefaults.concat(metaTags)
		const finalMetaTags: JSX.Element[] = []
		allMetaTags.forEach((metaData: MetaData, index: number) => {
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
						props.name
							? props.name
							: props.property
							? props.property
							: props.httpEquiv
							? props.httpEquiv
							: props.charSet
							? props.charSet
							: index
					}`
					finalMetaTags.push(
						<React.Fragment key={`headLink${index}`}>
							<meta {...props} key={`meta-${key}`} />
							<>{'\n'}</>
						</React.Fragment>
					)
				}
			}
		})
		return finalMetaTags
	}

	/**
	 * Processes the default script data.
	 * This script data has a different structure than the data returned from the CMS.
	 */
	private getScripts = (scripts: ScriptTags[]): JSX.Element[] => {
		const scriptTags: ScriptTags[] = scripts && Array.isArray(scripts) ? scripts : []
		return scriptTags.reduce(
			(accumulator: JSX.Element[], scriptTag: ScriptTags, index: number): JSX.Element[] => {
				if (scriptTag && typeof scriptTag === 'object') {
					for (const script in scriptTag) {
						const scriptTagKeys = Object.prototype.hasOwnProperty.call(scriptTag, script)
						if (scriptTagKeys) {
							const currentScript: ScriptData = scriptTag[script]
							const props: ScriptData = {
								[ScriptAttr.src]: script.replace(ROOT_TOKEN, this.props.root)
							}
							if (script === 'inline' && currentScript.type && currentScript.value) {
								accumulator.push(
									<React.Fragment key={`headScriptDefault${index}`}>
										<script
											key={`script-${currentScript.type}${index}`}
											type={currentScript.type}
											dangerouslySetInnerHTML={{ __html: currentScript.value }}
										/>
									</React.Fragment>
								)
								return accumulator
							}
							if (currentScript.async) {
								props[ScriptAttr.async] = currentScript.async
							}
							if (currentScript.defer) {
								props[ScriptAttr.defer] = currentScript.defer
							}
							accumulator.push(
								<React.Fragment key={`headScriptDefault${index}`}>
									<script
										key={`script-${removeProtocolOrSlash(props[ScriptAttr.src] || ``) || index}`}
										{...props}
									/>
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
	 * This script data has a different structure than the default data.
	 */
	private getScriptTags = (script: ScriptData[]): JSX.Element[] => {
		let scriptArray: JSX.Element[] = []
		let seoTags: JSX.Element[] = []
		const scriptDeafults: ScriptTags[] =
			this.props.default && this.props.default.script ? this.props.default.script : []
		const defaultTags: JSX.Element[] = this.getScripts(scriptDeafults)
		if (script.length > 0) {
			scriptArray = script.map((scriptData: ScriptData, index: number) => {
				const { src, type, value } = scriptData
				if (type && value) {
					if (type === 'application/ld+json') return
					return (
						<script
							key={`headScript${index}-script-${type}${index}`}
							type={type}
							dangerouslySetInnerHTML={{ __html: value }}
						/>
					)
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
						return <script key={`headScript${index}-script-${key || index}`} {...props} />
					}
				}
			}) as JSX.Element[]
			seoTags = script.map(({ type, value }: ScriptData, index: number) => {
				if (type && type === 'application/ld+json' && value) {
					return (
						<React.Fragment key={`headSeoScript${index}`}>
							<script
								key={`script-${type}${index}`}
								type={type}
								dangerouslySetInnerHTML={{ __html: value }}
							/>
						</React.Fragment>
					)
				}
			}) as JSX.Element[]
		}
		return seoTags.concat(defaultTags.concat(scriptArray))
	}

	private getStyles = (styles?: string[]): JSX.Element => {
		const initialStyles: string[] =
			this.props.default && this.props.default.style ? this.props.default.style : []
		const styleTags: string[] = styles && Array.isArray(styles) ? styles : []
		const allStyleTags: string[] = initialStyles.concat(styleTags)
		const content: string = allStyleTags.reduce((acc: string, style: string) => {
			if (!style) return acc
			return (acc += style)
		}, '')
		return <React.Fragment key={`headStyle`}>{content && <style>{content}</style>}</React.Fragment>
	}

	private getTitleTag = (title: string): JSX.Element => {
		if (!title) return <></>
		return (
			<React.Fragment key={`headTitle`}>
				<title key={`title-${title}`}>{title}</title>
				{'\n'}
			</React.Fragment>
		)
	}
}
