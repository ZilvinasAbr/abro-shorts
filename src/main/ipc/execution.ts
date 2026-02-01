import { ipcMain } from 'electron'
import { exec } from 'child_process'
import type { Command } from '../../shared/types'

export function registerExecutionHandlers(): void {
  ipcMain.handle(
    'abroshorts:commands:execute',
    async (_, command: Command): Promise<{ success: boolean; error?: string }> => {
      return new Promise((resolve) => {
        exec(
          command.command,
          {
            shell: '/bin/zsh',
            env: { ...process.env, PATH: '/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin' }
          },
          (error) => {
            if (error) {
              resolve({ success: false, error: error.message })
            } else {
              resolve({ success: true })
            }
          }
        )
      })
    }
  )
}
