import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import BlogForm from './BlogForm'
import userEvent from '@testing-library/user-event'

test('Props are correctly formated', async () => {
  const user = userEvent.setup()
  const createBlog = jest.fn()

  render(<BlogForm createBlog={createBlog}/>)

  const titleInput = screen.getByPlaceholderText('titleInput')
  const authorInput = screen.getByTestId('authorInput')
  const URLInput = screen.getByPlaceholderText('URLInput')
  const saveButton = screen.getByText('save')

  await user.type(titleInput, 'testing title')
  await user.type(authorInput, 'testing author')
  await user.type(URLInput, 'testing url')
  await user.click(saveButton)

  expect(createBlog.mock.calls).toHaveLength(1)
  expect(createBlog.mock.calls[0][0].title).toBe('testing title')
  expect(createBlog.mock.calls[0][0].author).toBe('testing author')
  expect(createBlog.mock.calls[0][0].url).toBe('testing url')
})