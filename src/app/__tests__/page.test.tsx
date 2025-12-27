import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import Home from '../page'

describe('Home Page', () => {
  it('renders without crashing', () => {
    render(<Home />)
    expect(screen.getByRole('main')).toBeInTheDocument()
  })

  it('displays welcome message', () => {
    render(<Home />)
    expect(screen.getByText(/welcome/i)).toBeInTheDocument()
  })
})
