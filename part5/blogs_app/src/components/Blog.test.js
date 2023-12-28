import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

test('renders content, but not url and likes', () => {
  const blog = {
    title: 'Title works',
    author: 'Author works',
    url: 'www.url.com',
  }

  render(<Blog blog={blog} />)

  const rendered_title = screen.getByText(/Title works/)
  const rendered_author = screen.getByText(/Author works/)
  const rendered_url = screen.queryByText(/www.url.com/)
  expect(rendered_title).toBeDefined()
  expect(rendered_author).toBeDefined()
  expect(rendered_url).toBeNull()
})

test('renders all after view', async () => {

  const blog = {
    title: 'Title works',
    author: 'Author works',
    url: 'www.url.com',
  }

  render(<Blog blog={blog} />)

  const rendered_title = screen.getByText(/Title works/)
  const rendered_author = screen.getByText(/Author works/)
  const rendered_url = screen.queryByText(/www.url.com/)
  const rendered_likes = screen.queryByText(/likes/)
  const user = userEvent.setup()
  const button = screen.getByText('View')
  await user.click(button)
  expect(rendered_title).toBeDefined()
  expect(rendered_author).toBeDefined()
  expect(rendered_likes).toBeDefined()
  expect(rendered_url).toBeDefined()

})

test('Props are called', async () => {

  const blog = {
    title: 'Title works',
    author: 'Author works',
    url: 'www.url.com',
  }

  const mockHandler = jest.fn()

  render(<Blog blog={blog} addLike={mockHandler} />)

  const rendered_title = screen.getByText(/Title works/)
  const user = userEvent.setup()
  const view = screen.getByText('View')
  await user.click(view)
  const like = screen.getByText('Like')
  await user.click(like)
  expect(mockHandler.mock.calls).toHaveLength(1)
  await user.click(like)
  expect(mockHandler.mock.calls).toHaveLength(2)

})