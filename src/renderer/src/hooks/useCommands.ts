import { useCallback } from 'react'
import { v4 as uuidv4 } from 'uuid'
import type { Command } from '../../../shared/types'
import { useAppContext } from '../context/AppContext'

interface UseCommandsReturn {
  createCommand: (name: string, command: string) => Promise<void>
  updateCommand: (id: string, name: string, command: string) => Promise<void>
  deleteCommand: (id: string) => Promise<void>
  executeCommand: (command: Command) => Promise<void>
}

export function useCommands(): UseCommandsReturn {
  const { loadCommands } = useAppContext()

  const createCommand = useCallback(
    async (name: string, command: string): Promise<void> => {
      const now = new Date().toISOString()
      const newCommand: Command = {
        id: uuidv4(),
        name,
        command,
        createdAt: now,
        updatedAt: now
      }
      await window.abroshorts.commands.save(newCommand)
      await loadCommands()
    },
    [loadCommands]
  )

  const updateCommand = useCallback(
    async (id: string, name: string, command: string): Promise<void> => {
      const commands = await window.abroshorts.commands.load()
      const existing = commands.find((c) => c.id === id)
      if (!existing) return

      const updated: Command = {
        ...existing,
        name,
        command,
        updatedAt: new Date().toISOString()
      }
      await window.abroshorts.commands.save(updated)
      await loadCommands()
    },
    [loadCommands]
  )

  const deleteCommand = useCallback(
    async (id: string): Promise<void> => {
      await window.abroshorts.commands.delete(id)
      await loadCommands()
    },
    [loadCommands]
  )

  const executeCommand = useCallback(async (command: Command): Promise<void> => {
    await window.abroshorts.usage.increment(command.id)
    await window.abroshorts.commands.execute(command)
    window.abroshorts.window.hide()
  }, [])

  return { createCommand, updateCommand, deleteCommand, executeCommand }
}
