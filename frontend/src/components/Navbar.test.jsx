import { describe, test, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Navbar from './Navbar'

function renderNavbar() {
  return render(
    <MemoryRouter>
      <Navbar />
    </MemoryRouter>
  )
}

describe('Navbar', () => {
  test('renders the portal title', () => {
    renderNavbar()
    expect(screen.getByText('School Portal')).toBeInTheDocument()
  })

  test('renders links to Classes and Teachers', () => {
    renderNavbar()

    const classesLink = screen.getByRole('link', { name: 'Classes' })
    const teachersLink = screen.getByRole('link', { name: 'Teachers' })

    expect(classesLink).toHaveAttribute('href', '/classes')
    expect(teachersLink).toHaveAttribute('href', '/teachers')
  })
})
