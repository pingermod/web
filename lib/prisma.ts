import { PrismaClient } from '@prisma/client'
import { PrismaD1 } from '@prisma/adapter-d1'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

function createPrismaClient() {
  // En développement, utiliser SQLite
  if (process.env.NODE_ENV !== 'production') {
    return new PrismaClient()
  }
  
  // En production sur Cloudflare, utiliser D1
  if (typeof globalThis !== 'undefined' && 'DB' in globalThis) {
    const adapter = new PrismaD1(globalThis.DB as any)
    return new PrismaClient({ adapter })
  }
  
  // Fallback pour SQLite
  return new PrismaClient()
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma