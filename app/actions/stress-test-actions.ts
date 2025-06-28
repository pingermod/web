'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export interface StressTestConfig {
  name: string
  targetUrl: string
  method: string
  threads: number
  duration: number
  rateLimit: number
  payload?: string
  headers?: Record<string, string>
  followRedirects: boolean
  timeout: number
  userId: string
}

export async function createStressTest(config: StressTestConfig) {
  try {
    const stressTest = await prisma.stressTest.create({
      data: {
        name: config.name,
        targetUrl: config.targetUrl,
        method: config.method,
        threads: config.threads,
        duration: config.duration,
        rateLimit: config.rateLimit,
        payload: config.payload,
        headers: config.headers ? JSON.stringify(config.headers) : null,
        followRedirects: config.followRedirects,
        timeout: config.timeout,
        userId: config.userId,
        status: 'idle'
      },
      include: {
        createdBy: true
      }
    })
    
    revalidatePath('/stress-test')
    return { success: true, stressTest }
  } catch (error) {
    console.error('Failed to create stress test:', error)
    return { success: false, error: 'Failed to create stress test' }
  }
}

export async function getStressTests(userId?: string) {
  try {
    const tests = await prisma.stressTest.findMany({
      where: userId ? { userId } : undefined,
      include: {
        createdBy: true,
        results: {
          orderBy: { createdAt: 'desc' },
          take: 1
        },
        logs: {
          orderBy: { createdAt: 'desc' },
          take: 10
        }
      },
      orderBy: { createdAt: 'desc' }
    })
    return tests
  } catch (error) {
    console.error('Failed to fetch stress tests:', error)
    return []
  }
}

export async function updateStressTestStatus(testId: string, status: string) {
  try {
    const test = await prisma.stressTest.update({
      where: { id: testId },
      data: { status }
    })
    
    revalidatePath('/stress-test')
    return { success: true, test }
  } catch (error) {
    return { success: false, error: 'Failed to update test status' }
  }
}

export async function addTestLog(testId: string, type: string, message: string, details?: any) {
  try {
    const log = await prisma.testLog.create({
      data: {
        testId,
        type,
        message,
        details: details ? JSON.stringify(details) : null
      }
    })
    
    revalidatePath('/stress-test')
    return { success: true, log }
  } catch (error) {
    return { success: false, error: 'Failed to add log' }
  }
}

export async function updateTestResults(testId: string, results: {
  requestsSent: number
  responsesReceived: number
  successRate: number
  avgResponseTime: number
  bandwidth: number
  errors: number
  statusCodes: Record<string, number>
}) {
  try {
    const testResult = await prisma.testResult.upsert({
      where: { testId: testId },
      update: {
        requestsSent: results.requestsSent,
        responsesReceived: results.responsesReceived,
        successRate: results.successRate,
        avgResponseTime: results.avgResponseTime,
        bandwidth: results.bandwidth,
        errors: results.errors,
        statusCodes: JSON.stringify(results.statusCodes)
      },
      create: {
        testId,
        requestsSent: results.requestsSent,
        responsesReceived: results.responsesReceived,
        successRate: results.successRate,
        avgResponseTime: results.avgResponseTime,
        bandwidth: results.bandwidth,
        errors: results.errors,
        statusCodes: JSON.stringify(results.statusCodes)
      }
    })
    
    revalidatePath('/stress-test')
    return { success: true, testResult }
  } catch (error) {
    return { success: false, error: 'Failed to update test results' }
  }
}

export async function deleteStressTest(testId: string) {
  try {
    await prisma.stressTest.delete({
      where: { id: testId }
    })
    
    revalidatePath('/stress-test')
    return { success: true }
  } catch (error) {
    return { success: false, error: 'Failed to delete stress test' }
  }
}

export async function getTestLogs(testId: string) {
  try {
    const logs = await prisma.testLog.findMany({
      where: { testId },
      orderBy: { createdAt: 'desc' },
      take: 100
    })
    return logs
  } catch (error) {
    console.error('Failed to fetch test logs:', error)
    return []
  }
}