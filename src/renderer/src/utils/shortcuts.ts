// Generate single-key shortcuts for commands (a-z, skipping 'f' which is reserved for search)
export function generateShortcuts(count: number): string[] {
  const keys = 'abcdeghijklmnopqrstuvwxyz'.split('') // All except 'f'
  return Array.from({ length: Math.min(count, keys.length) }, (_, i) => keys[i])
}

// Create a map of shortcut key to command index
export function createShortcutMap(count: number): Map<string, number> {
  const shortcuts = generateShortcuts(count)
  const map = new Map<string, number>()
  for (const [index, key] of shortcuts.entries()) {
    map.set(key, index)
  }
  return map
}
