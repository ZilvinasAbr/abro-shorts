import { app } from 'electron'
import { promises as fs } from 'fs'
import path from 'path'
import type { Settings } from '../../shared/types'
import { DEFAULT_SETTINGS } from '../../shared/types'

function getSettingsPath(): string {
  return path.join(app.getPath('userData'), 'settings.json')
}

export async function loadSettings(): Promise<Settings> {
  try {
    const content = await fs.readFile(getSettingsPath(), 'utf-8')
    return { ...DEFAULT_SETTINGS, ...JSON.parse(content) }
  } catch {
    return DEFAULT_SETTINGS
  }
}

export async function saveSettings(settings: Settings): Promise<void> {
  await fs.writeFile(getSettingsPath(), JSON.stringify(settings, null, 2), 'utf-8')
}
