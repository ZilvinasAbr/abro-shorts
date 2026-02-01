import { useEffect, useCallback } from 'react'
import type { Command } from '../../../shared/types'
import { useAppContext } from '../context/AppContext'
import { useCommands } from './useCommands'

interface UseKeyboardOptions {
  filteredCommands: Command[]
  inputRef: React.RefObject<HTMLInputElement | null>
}

export function useKeyboard({ filteredCommands, inputRef }: UseKeyboardOptions): void {
  const { state, dispatch } = useAppContext()
  const { executeCommand, deleteCommand } = useCommands()
  const { selectedIndex, isFormOpen, searchQuery } = state

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (isFormOpen) return

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
            dispatch({ type: 'SET_FORM_OPEN', payload: true })
          }
          break

        case 'Escape':
          e.preventDefault()
          window.abroshorts.window.hide()
          break

        case 'Tab':
          e.preventDefault()
          if (filteredCommands[selectedIndex]) {
            dispatch({ type: 'SET_EDITING_COMMAND', payload: filteredCommands[selectedIndex] })
            dispatch({ type: 'SET_FORM_OPEN', payload: true })
          }
          break

        case 'n':
          if (e.metaKey) {
            e.preventDefault()
            dispatch({ type: 'SET_EDITING_COMMAND', payload: null })
            dispatch({ type: 'SET_FORM_OPEN', payload: true })
          }
          break

        case 'e':
          if (e.metaKey && filteredCommands[selectedIndex]) {
            e.preventDefault()
            dispatch({ type: 'SET_EDITING_COMMAND', payload: filteredCommands[selectedIndex] })
            dispatch({ type: 'SET_FORM_OPEN', payload: true })
          }
          break

        case 'Backspace':
          if (e.metaKey && filteredCommands[selectedIndex]) {
            e.preventDefault()
            deleteCommand(filteredCommands[selectedIndex].id)
          }
          break
      }
    },
    [
      isFormOpen,
      selectedIndex,
      filteredCommands,
      searchQuery,
      dispatch,
      executeCommand,
      deleteCommand
    ]
  )

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  // Auto-focus input on mount and when form closes
  useEffect(() => {
    if (!isFormOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isFormOpen, inputRef])
}
