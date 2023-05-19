import { render, screen } from '@testing-library/react'
import '__mocks__/index'
import { about } from 'client.config'
import { Home } from 'pages/Home'

describe('Home', () => {
	it('renders a heading', () => {
		const title = about.title

		render(<Home />)

		const heading = screen.getByRole('heading', {
			name: new RegExp(title, 'i')
		})

		expect(heading).toBeInTheDocument()
	})
})
