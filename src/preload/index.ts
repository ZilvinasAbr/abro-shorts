import { electronAPI } from '@electron-toolkit/preload'
import { contextBridge, ipcRenderer } from 'electron'
import type { AbroShortsAPI, Command, Settings } from '../shared/types'

const abroshorts: AbroShortsAPI = {
  commands: {
    load: () => ipcRenderer.invoke('abroshorts:commands:load'),
    save: (command: Command) => ipcRenderer.invoke('abroshorts:commands:save', command),
    delete: (id: string) => ipcRenderer.invoke('abroshorts:commands:delete', id),
    execute: (command: Command) => ipcRenderer.invoke('abroshorts:commands:execute', command)
  },
  usage: {
    get: () => ipcRenderer.invoke('abroshorts:usage:get'),
    increment: (commandId: string) => ipcRenderer.invoke('abroshorts:usage:increment', commandId)
  },
  settings: {
    get: () => ipcRenderer.invoke('abroshorts:settings:get'),
    save: (settings: Settings) => ipcRenderer.invoke('abroshorts:settings:save', settings)
  },
  window: {
    hide: () => ipcRenderer.send('abroshorts:window:hide')
  },
  onWindowToggle: (callback: () => void) => {
    const handler = (): void => callback()
    ipcRenderer.on('abroshorts:window:toggle', handler)
    return () => ipcRenderer.removeListener('abroshorts:window:toggle', handler)
  },
  onThemeChange: (callback: (theme: 'light' | 'dark') => void) => {
    const handler = (_: unknown, theme: 'light' | 'dark'): void => callback(theme)
    ipcRenderer.on('abroshorts:theme:change', handler)
    return () => ipcRenderer.removeListener('abroshorts:theme:change', handler)
  }
}

if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('abroshorts', abroshorts)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-expect-error (define in dts)
  window.electron = electronAPI
  // @ts-expect-error (define in dts)
  window.abroshorts = abroshorts
}
