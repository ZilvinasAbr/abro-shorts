import { PlusIcon } from 'lucide-react'
import { useEffect, useMemo, useRef } from 'react'
import { ScrollArea } from '@/components/ui/scroll-area'
import type { Command } from '../../../shared/types'
import { useAppContext } from '../context/AppContext'
import { generateShortcuts } from '../utils/shortcuts'
import { CommandItem } from './CommandItem'

interface CommandListProps {
  commands: Command[]
}

export function CommandList({ commands }: CommandListProps): React.JSX.Element {
  const { state, dispatch } = useAppContext()
  const { selectedIndex, searchQuery } = state
  const listRef = useRef<HTMLDivElement>(null)

  // Generate shortcuts for visible commands
  const shortcuts = useMemo(() => generateShortcuts(commands.length), [commands.length])

  // Create a map of shortcut key to command for quick lookup
  const shortcutMap = useMemo(() => {
    const map = new Map<string, number>()
    for (const [index, key] of shortcuts.entries()) {
      map.set(key, index)
    }
    return map
  }, [shortcuts])

  // Expose shortcut map to window for keyboard handler to access
  useEffect(() => {
    window.__shortcutMap = shortcutMap
  }, [shortcutMap])

  // Scroll selected item into view
  useEffect(() => {
    if (!listRef.current) return
    const selectedElement = listRef.current.querySelector(`[data-index="${selectedIndex}"]`)
    selectedElement?.scrollIntoView({ block: 'nearest' })
  }, [selectedIndex])

  if (commands.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-2 py-8 text-center text-muted-foreground">
        {searchQuery.trim() ? (
          <>
            <div>No commands found</div>
            <button
              type="button"
              onClick={() => dispatch({ type: 'SET_FORM_OPEN', payload: true })}
              className="flex items-center gap-1 text-sm text-primary hover:underline"
            >
              <PlusIcon className="size-4" />
              Create &ldquo;{searchQuery}&rdquo;
            </button>
          </>
        ) : (
          <>
            <div>No commands yet</div>
            <div className="text-sm">
              Press <kbd className="rounded border bg-muted px-1.5 py-0.5 text-xs">Cmd+N</kbd> to
              add one
            </div>
          </>
        )}
      </div>
    )
  }

  return (
    <ScrollArea className="flex-1">
      <div ref={listRef} className="space-y-1 p-2">
        {commands.map((command, index) => (
          <div key={command.id} data-index={index}>
            <CommandItem
              command={command}
              isSelected={index === selectedIndex}
              onSelect={() => dispatch({ type: 'SET_SELECTED_INDEX', payload: index })}
              shortcut={shortcuts[index]}
            />
          </div>
        ))}
      </div>
    </ScrollArea>
  )
}
