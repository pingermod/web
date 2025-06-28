'use client'

import { createPost } from '@/app/actions/post-actions'
import { useState } from 'react'

interface PostFormProps {
  users: Array<{ id: string; email: string; name: string | null }>
}

export default function PostForm({ users }: PostFormProps) {
  const [message, setMessage] = useState('')

  async function handleSubmit(formData: FormData) {
    const result = await createPost(formData)
    if (result.success) {
      setMessage('Post created successfully!')
      const form = document.getElementById('post-form') as HTMLFormElement
      form.reset()
    } else {
      setMessage(result.error || 'Something went wrong')
    }
  }

  return (
    <form
      id="post-form"
      action={handleSubmit}
      className="space-y-4 bg-white p-6 rounded-lg shadow-md"
    >
      <h2 className="text-xl font-semibold mb-4">Create New Post</h2>
      
      <div>
        <label htmlFor="title" className="block text-sm font-medium mb-1">
          Title
        </label>
        <input
          type="text"
          id="title"
          name="title"
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      
      <div>
        <label htmlFor="content" className="block text-sm font-medium mb-1">
          Content
        </label>
        <textarea
          id="content"
          name="content"
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      
      <div>
        <label htmlFor="authorId" className="block text-sm font-medium mb-1">
          Author
        </label>
        <select
          id="authorId"
          name="authorId"
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select an author</option>
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.name || user.email}
            </option>
          ))}
        </select>
      </div>
      
      <button
        type="submit"
        className="w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition duration-200"
      >
        Create Post
      </button>
      
      {message && (
        <p className={`text-sm ${message.includes('success') ? 'text-green-600' : 'text-red-600'}`}>
          {message}
        </p>
      )}
    </form>
  )
}