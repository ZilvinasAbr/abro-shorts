import { ipcMain } from 'electron'
import { loadCommands, saveCommand, deleteCommand } from '../storage/commands'
import type { Command } from '../../shared/types'

export function registerCommandHandlers(): void {
  ipcMain.handle('abroshorts:commands:load', async () => {
    return loadCommands()
  })

  ipcMain.handle('abroshorts:commands:save', async (_, command: Command) => {
    await saveCommand(command)
  })

  ipcMain.handle('abroshorts:commands:delete', async (_, id: string) => {
    await deleteCommand(id)
  })
}
