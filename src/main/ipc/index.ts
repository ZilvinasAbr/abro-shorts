import { ipcMain } from 'electron'
import type { Settings } from '../../shared/types'
import { loadSettings, saveSettings } from '../storage/settings'
import { incrementUsage, loadUsageStats } from '../storage/usage'
import { registerCommandHandlers } from './commands'
import { registerExecutionHandlers } from './execution'

export function registerAllHandlers(): void {
  registerCommandHandlers()
  registerExecutionHandlers()

  ipcMain.handle('abroshorts:settings:get', async () => {
    return loadSettings()
  })

  ipcMain.handle('abroshorts:settings:save', async (_, settings: Settings) => {
    await saveSettings(settings)
  })

  ipcMain.handle('abroshorts:usage:get', async () => {
    return loadUsageStats()
  })

  ipcMain.handle('abroshorts:usage:increment', async (_, commandId: string) => {
    await incrementUsage(commandId)
  })
}
