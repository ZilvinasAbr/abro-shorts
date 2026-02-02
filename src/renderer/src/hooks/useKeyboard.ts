import { useCallback, useEffect } from 'react'
import type { Command } from '../../../shared/types'
import { useAppContext } from '../context/AppContext'
import { useCommands } from './useCommands'

interface UseKeyboardOptions {
  filteredCommands: Command[]
  inputRef: React.RefObject<HTMLInputElement | null>
}

// Valid shortcut keys (a-z, excluding 'f' which is reserved for search)
const SHORTCUT_KEYS = new Set('abcdeghijklmnopqrstuvwxyz'.split(''))

export function useKeyboard({ filteredCommands, inputRef }: UseKeyboardOptions): void {
  const { state, dispatch } = useAppContext()
  const { executeCommand, deleteCommand } = useCommands()
  const { selectedIndex, isFormOpen, searchQuery } = state

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (isFormOpen) return

      // When search input is focused, allow navigation but ignore other shortcuts
      const isInputFocused = document.activeElement === inputRef.current

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault()
          dispatch({
            type: 'SET_SELECTED_INDEX',
            payload: Math.min(selectedIndex + 1, filteredCommands.length - 1)
          })
          break

        case 'ArrowUp':
          e.preventDefault()
          dispatch({
            type: 'SET_SELECTED_INDEX',
            payload: Math.max(selectedIndex - 1, 0)
          })
          break

        case 'Enter':
          e.preventDefault()
          if (filteredCommands[selectedIndex]) {
            executeCommand(filteredCommands[selectedIndex])
          } else if (searchQuery.trim() && filteredCommands.length === 0) {
            // Create new command from search query
            dispatch({ type: 'SET_EDITING_COMMAND', payload: null })
            dispatch({ type: 'SET_FORM_OPEN', payload: true })
          }
          break

        case 'Escape':
          if (isInputFocused) {
            e.preventDefault()
            inputRef.current?.blur()
            return
          }
          e.preventDefault()
          window.abroshorts.window.hide()
          break

        case 'f':
          // Don't focus if already focused
          if (isInputFocused) return
          e.preventDefault()
          inputRef.current?.focus()
          break

        case 'n':
          if (e.metaKey && !isInputFocused) {
            e.preventDefault()
            dispatch({ type: 'SET_EDITING_COMMAND', payload: null })
            dispatch({ type: 'SET_FORM_OPEN', payload: true })
          }
          break

        case 'e':
          if (e.metaKey && !isInputFocused && filteredCommands[selectedIndex]) {
            e.preventDefault()
            dispatch({ type: 'SET_EDITING_COMMAND', payload: filteredCommands[selectedIndex] })
            dispatch({ type: 'SET_FORM_OPEN', payload: true })
          }
          break

        case 'Backspace':
          if (e.metaKey && !isInputFocused && filteredCommands[selectedIndex]) {
            e.preventDefault()
            deleteCommand(filteredCommands[selectedIndex].id)
          }
          break

        default:
          // Handle single-key shortcuts (a-z, excluding 'f') - only when input is not focused
          if (
            !isInputFocused &&
            SHORTCUT_KEYS.has(e.key) &&
            !e.metaKey &&
            !e.ctrlKey &&
            !e.altKey
          ) {
            e.preventDefault()
            const shortcutMap = window.__shortcutMap
            if (shortcutMap) {
              const commandIndex = shortcutMap.get(e.key)
              if (commandIndex !== undefined && filteredCommands[commandIndex]) {
                executeCommand(filteredCommands[commandIndex])
              }
            }
          }
          break
      }
    },
    [
      isFormOpen,
      selectedIndex,
      filteredCommands,
      searchQuery,
      inputRef,
      dispatch,
      executeCommand,
      deleteCommand
    ]
  )

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])
}
