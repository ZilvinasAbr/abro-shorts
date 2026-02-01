import Fuse from 'fuse.js'
import { useMemo } from 'react'
import type { Command, UsageStats } from '../../../shared/types'

interface UseSearchOptions {
  commands: Command[]
  usageStats: UsageStats
  searchQuery: string
}

export function useSearch({ commands, usageStats, searchQuery }: UseSearchOptions): Command[] {
  const fuse = useMemo(() => {
    return new Fuse(commands, {
      keys: ['name', 'command'],
      threshold: 0.4,
      includeScore: true
    })
  }, [commands])

  const sortedByUsage = useMemo(() => {
    return [...commands].sort((a, b) => {
      const aUsage = usageStats[a.id]?.count || 0
      const bUsage = usageStats[b.id]?.count || 0
      if (bUsage !== aUsage) return bUsage - aUsage

      const aLastUsed = usageStats[a.id]?.lastUsed || ''
      const bLastUsed = usageStats[b.id]?.lastUsed || ''
      return bLastUsed.localeCompare(aLastUsed)
    })
  }, [commands, usageStats])

  return useMemo(() => {
    if (!searchQuery.trim()) {
      return sortedByUsage
    }

    const results = fuse.search(searchQuery)
    return results.map((result) => result.item)
  }, [fuse, searchQuery, sortedByUsage])
}
