'use client'

import { getPosts, togglePublishPost } from '@/app/actions/post-actions'
import { useEffect, useState } from 'react'

export default function PostList() {
  const [posts, setPosts] = useState<any[]>([])

  useEffect(() => {
    async function fetchPosts() {
      const data = await getPosts()
      setPosts(data)
    }
    fetchPosts()
  }, [])

  async function handleTogglePublish(postId: string, currentStatus: boolean) {
    const result = await togglePublishPost(postId, !currentStatus)
    if (result.success) {
      const updatedPosts = await getPosts()
      setPosts(updatedPosts)
    }
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Posts</h2>
      
      {posts.length === 0 ? (
        <p className="text-gray-500">No posts yet. Create one above!</p>
      ) : (
        <ul className="space-y-4">
          {posts.map((post) => (
            <li key={post.id} className="border-b pb-4 last:border-b-0">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{post.title}</h3>
                  {post.content && (
                    <p className="text-gray-700 mt-1">{post.content}</p>
                  )}
                  <p className="text-sm text-gray-500 mt-2">
                    By {post.author.name || post.author.email}
                  </p>
                </div>
                <button
                  onClick={() => handleTogglePublish(post.id, post.published)}
                  className={`ml-4 px-3 py-1 rounded text-sm font-medium transition duration-200 ${
                    post.published
                      ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                      : 'bg-green-100 text-green-800 hover:bg-green-200'
                  }`}
                >
                  {post.published ? 'Unpublish' : 'Publish'}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}