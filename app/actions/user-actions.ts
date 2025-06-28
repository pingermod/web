'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import bcrypt from 'bcryptjs'

export async function createUser(formData: FormData) {
  const email = formData.get('email') as string
  const name = formData.get('name') as string
  const password = formData.get('password') as string

  if (!email || !name || !password) {
    return { success: false, error: 'Tous les champs sont requis' }
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10)
    
    const user = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
      },
    })
    
    revalidatePath('/')
    return { success: true, user: { id: user.id, email: user.email, name: user.name } }
  } catch (error) {
    return { success: false, error: 'Failed to create user' }
  }
}

export async function getUsers() {
  try {
    const users = await prisma.user.findMany({
      include: {
        posts: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })
    return users
  } catch (error) {
    console.error('Failed to fetch users:', error)
    return []
  }
}