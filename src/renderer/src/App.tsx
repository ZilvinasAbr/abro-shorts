import { useRef, useEffect } from 'react'
import { AppProvider, useAppContext } from './context/AppContext'
import { SearchInput } from './components/SearchInput'
import { CommandList } from './components/CommandList'
import { CommandForm } from './components/CommandForm'
import { useSearch } from './hooks/useSearch'
import { useKeyboard } from './hooks/useKeyboard'

function Launcher(): React.JSX.Element {
  const inputRef = useRef<HTMLInputElement>(null)
  const { state } = useAppContext()
  const { commands, usageStats, searchQuery, isLoading, theme } = state

  const filteredCommands = useSearch({ commands, usageStats, searchQuery })
  useKeyboard({ filteredCommands, inputRef })

  // Apply theme class to document
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }, [theme])

  if (isLoading) {
    return (
      <div className="flex h-[420px] items-center justify-center rounded-xl bg-background/80 backdrop-blur-xl">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    )
  }

  return (
    <div className="flex h-[420px] flex-col overflow-hidden rounded-xl bg-background/80 shadow-2xl backdrop-blur-xl">
      <SearchInput ref={inputRef} />
      <CommandList commands={filteredCommands} />
      <CommandForm />
      <div className="flex items-center justify-between border-t border-border px-4 py-2 text-xs text-muted-foreground">
        <div className="flex gap-3">
          <span>
            <kbd className="rounded border bg-muted px-1 py-0.5">Enter</kbd> Run
          </span>
          <span>
            <kbd className="rounded border bg-muted px-1 py-0.5">Tab</kbd> Edit
          </span>
          <span>
            <kbd className="rounded border bg-muted px-1 py-0.5">Cmd+N</kbd> New
          </span>
        </div>
        <span>{filteredCommands.length} commands</span>
      </div>
    </div>
  )
}

function App(): React.JSX.Element {
  return (
    <AppProvider>
      <Launcher />
    </AppProvider>
  )
}

export default App
