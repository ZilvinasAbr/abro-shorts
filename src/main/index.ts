import { app, shell, BrowserWindow, globalShortcut, ipcMain, nativeTheme, screen } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import { registerAllHandlers } from './ipc'
import { loadSettings } from './storage/settings'

let mainWindow: BrowserWindow | null = null

function createWindow(): void {
  const { width: screenWidth, height: screenHeight } = screen.getPrimaryDisplay().workAreaSize

  mainWindow = new BrowserWindow({
    width: 680,
    height: 420,
    x: Math.floor((screenWidth - 680) / 2),
    y: Math.floor((screenHeight - 420) / 2 - 100), // Slightly above center
    show: false,
    frame: false,
    transparent: true,
    resizable: false,
    movable: false,
    alwaysOnTop: true,
    skipTaskbar: true,
    vibrancy: 'popover',
    visualEffectState: 'active',
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.on('blur', () => {
    hideWindow()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

function showWindow(): void {
  if (!mainWindow) return

  const { width: screenWidth, height: screenHeight } = screen.getPrimaryDisplay().workAreaSize
  mainWindow.setPosition(
    Math.floor((screenWidth - 680) / 2),
    Math.floor((screenHeight - 420) / 2 - 100)
  )

  mainWindow.show()
  mainWindow.focus()
  mainWindow.webContents.send('abroshorts:window:toggle')
}

function hideWindow(): void {
  if (!mainWindow) return
  mainWindow.hide()
}

function toggleWindow(): void {
  if (!mainWindow) return

  if (mainWindow.isVisible()) {
    hideWindow()
  } else {
    showWindow()
  }
}

async function registerGlobalShortcut(): Promise<void> {
  const settings = await loadSettings()
  const shortcut = settings.shortcut || 'Alt+Space'

  globalShortcut.unregisterAll()

  const registered = globalShortcut.register(shortcut, toggleWindow)
  if (!registered) {
    console.error(`Failed to register global shortcut: ${shortcut}`)
  }
}

function sendThemeToRenderer(): void {
  if (!mainWindow) return
  const theme = nativeTheme.shouldUseDarkColors ? 'dark' : 'light'
  mainWindow.webContents.send('abroshorts:theme:change', theme)
}

app.whenReady().then(async () => {
  electronApp.setAppUserModelId('com.abroshorts')

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  registerAllHandlers()

  ipcMain.on('abroshorts:window:hide', () => {
    hideWindow()
  })

  createWindow()
  await registerGlobalShortcut()

  // Send initial theme
  if (mainWindow) {
    mainWindow.webContents.on('did-finish-load', () => {
      sendThemeToRenderer()
    })
  }

  // Watch for theme changes
  nativeTheme.on('updated', () => {
    sendThemeToRenderer()
  })

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('will-quit', () => {
  globalShortcut.unregisterAll()
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
