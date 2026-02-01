import { promises as fs } from 'node:fs'
import path from 'node:path'
import { app } from 'electron'
import type { UsageStats } from '../../shared/types'

function getUsagePath(): string {
  return path.join(app.getPath('userData'), 'usage-stats.json')
}

export async function loadUsageStats(): Promise<UsageStats> {
  try {
    const content = await fs.readFile(getUsagePath(), 'utf-8')
    return JSON.parse(content)
  } catch {
    return {}
  }
}

export async function saveUsageStats(stats: UsageStats): Promise<void> {
  await fs.writeFile(getUsagePath(), JSON.stringify(stats, null, 2), 'utf-8')
}

export async function incrementUsage(commandId: string): Promise<void> {
  const stats = await loadUsageStats()
  const current = stats[commandId] || { count: 0, lastUsed: '' }
  stats[commandId] = {
    count: current.count + 1,
    lastUsed: new Date().toISOString()
  }
  await saveUsageStats(stats)
}
