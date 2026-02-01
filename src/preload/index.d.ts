import { ElectronAPI } from '@electron-toolkit/preload'
import type { AbroShortsAPI } from '../shared/types'

declare global {
  interface Window {
    electron: ElectronAPI
    abroshorts: AbroShortsAPI
  }
}
