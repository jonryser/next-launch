import { PageTags } from './../../components/partials/Head/HeadProps'

export const pageTags: PageTags = {
	link: {
		stylesheet: [
			'https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=optional'
		]
	},
	meta: [
		{
			charSet: 'utf-8'
		},
		{
			content: `IE=edge`,
			httpEquiv: `X-UA-Compatible`
		},
		{
			content: `user-scalable=no, initial-scale=1.0, maximum-scale=1, minimum-scale=1, width=device-width`,
			name: `viewport`
		}
	]
}
