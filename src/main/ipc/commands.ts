import { ipcMain } from 'electron'
import type { Command } from '../../shared/types'
import { deleteCommand, loadCommands, saveCommand } from '../storage/commands'

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
