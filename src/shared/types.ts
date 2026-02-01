export interface Command {
  id: string
  name: string
  command: string
  createdAt: string
  updatedAt: string
}

export interface UsageStats {
  [commandId: string]: {
    count: number
    lastUsed: string
  }
}

export interface Settings {
  shortcut: string // Default: "Alt+Space"
  theme: 'light' | 'dark' | 'system'
}

export const DEFAULT_SETTINGS: Settings = {
  shortcut: 'Alt+Space',
  theme: 'system'
}

export interface AbroShortsAPI {
  commands: {
    load: () => Promise<Command[]>
    save: (command: Command) => Promise<void>
    delete: (id: string) => Promise<void>
    execute: (command: Command) => Promise<{ success: boolean; error?: string }>
  }
  usage: {
    get: () => Promise<UsageStats>
    increment: (commandId: string) => Promise<void>
  }
  settings: {
    get: () => Promise<Settings>
    save: (settings: Settings) => Promise<void>
  }
  window: {
    hide: () => void
  }
  onWindowToggle: (callback: () => void) => () => void
  onThemeChange: (callback: (theme: 'light' | 'dark') => void) => () => void
}
