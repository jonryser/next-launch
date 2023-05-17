import { favicon } from 'client.config'
import { defaultMetaTitle } from 'client.config'
import { Provider } from 'hooks-for-redux'
import LogRocket from 'logrocket'
import { SessionProvider } from 'next-auth/react'
import type { AppProps } from 'next/app'
import { useEffect } from 'react'
import { QueryClientProvider } from 'react-query'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.min.css'
import { reactQueryClient } from 'utils/client/react-query'
import { IdleTimer } from 'common/IdleTimer'
import { RoleManager } from 'common/RoleManager'
import 'styles/globals.scss'
import '../store'
import Head from './../components/partials/Head'
// Content.
import { pageTags } from './../utils/constants'

function CustomApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
	useEffect(() => {
		if (process.env.NEXT_PUBLIC_ENV === 'staging') {
			LogRocket.init('eog9r1/test-logrocket')
		}
	}, [])

	const headData = {
		link: [
			{
				href: favicon,
				rel: 'shortcut icon',
				size: 'any',
				type: 'image/svg+xml'
			}
		],
		title: defaultMetaTitle
	}

	return (
		<>
			<Head data={headData} defaultTags={pageTags} />
			<Provider>
				<SessionProvider session={session} refetchInterval={5}>
					<QueryClientProvider client={reactQueryClient}>
						<RoleManager>
							<Component {...pageProps} />
							<ToastContainer />
							<IdleTimer />
						</RoleManager>
					</QueryClientProvider>
				</SessionProvider>
			</Provider>
		</>
	)
}

export default CustomApp
