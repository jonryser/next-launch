import NextHead from 'next/head'
import React, { useEffect, useState } from 'react'
import { getLinkTags, getMetaTags, getScriptTags, getStyles, getTitleTag } from 'utils/Head'
// Components.
import HeadProps, { HeadData, PageTags } from './HeadProps'

/**
 * NOTE: keys should be generated in the following convention:
 * {tagName}-{{relValueIfAvailable}-}{srcWithProtocolRemovedOrFrontSlashesRemoved}
 */
export default function Head({
	children,
	data = {} as HeadData,
	defaultTags = {} as PageTags,
	root = ''
}: HeadProps) {
	const { link, meta, script, title } = data
	const {
		link: linkDefaults,
		meta: metaDefaults,
		script: scriptDefaults,
		style: styleDefaults
	} = defaultTags
	const [linkTags, setLinkTags] = useState<JSX.Element[]>(getLinkTags(root, link, linkDefaults))
	const [metaTags, setMetaTags] = useState<JSX.Element[]>(getMetaTags(meta, metaDefaults))
	const [scriptTags, setScriptTags] = useState<JSX.Element[]>(
		getScriptTags(root, script, scriptDefaults)
	)
	const [styles, setStyles] = useState<JSX.Element>(getStyles())
	const [titleTag, setTitleTag] = useState<JSX.Element>(getTitleTag(title))

	useEffect(() => {
		setLinkTags(getLinkTags(root, link, linkDefaults))
	}, [linkDefaults, link, root])

	useEffect(() => {
		setMetaTags(getMetaTags(meta, metaDefaults))
	}, [metaDefaults, meta])

	useEffect(() => {
		setScriptTags(getScriptTags(root, script, scriptDefaults))
	}, [root, scriptDefaults, script])

	useEffect(() => {
		setStyles(getStyles())
	}, [styleDefaults])

	useEffect(() => {
		setTitleTag(getTitleTag(title))
	}, [title])

	return data || defaultTags ? (
		<NextHead>
			{/* Meta tags MUST be first. DO NOT add anything above these. */}
			{metaTags}
			{/* Title MUST come after meta tags. DO NOT add anything above this. */}
			{titleTag}
			{linkTags}
			{styles}
			{children}
			{scriptTags}
		</NextHead>
	) : (
		<></>
	)
}
