'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function createPost(formData: FormData) {
  const title = formData.get('title') as string
  const content = formData.get('content') as string
  const authorId = formData.get('authorId') as string

  try {
    const post = await prisma.post.create({
      data: {
        title,
        content,
        authorId,
      },
    })
    
    revalidatePath('/')
    return { success: true, post }
  } catch (error) {
    return { success: false, error: 'Failed to create post' }
  }
}

export async function togglePublishPost(postId: string, published: boolean) {
  try {
    const post = await prisma.post.update({
      where: { id: postId },
      data: { published },
    })
    
    revalidatePath('/')
    return { success: true, post }
  } catch (error) {
    return { success: false, error: 'Failed to update post' }
  }
}

export async function getPosts() {
  try {
    const posts = await prisma.post.findMany({
      include: {
        author: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })
    return posts
  } catch (error) {
    console.error('Failed to fetch posts:', error)
    return []
  }
}