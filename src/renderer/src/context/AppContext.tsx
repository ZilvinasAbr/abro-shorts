import { createContext, type ReactNode, useContext, useEffect, useReducer } from 'react'
import type { Command, UsageStats } from '../../../shared/types'

interface AppState {
  commands: Command[]
  usageStats: UsageStats
  searchQuery: string
  selectedIndex: number
  isLoading: boolean
  editingCommand: Command | null
  isFormOpen: boolean
  theme: 'light' | 'dark'
}

type AppAction =
  | { type: 'SET_COMMANDS'; payload: Command[] }
  | { type: 'SET_USAGE_STATS'; payload: UsageStats }
  | { type: 'SET_SEARCH_QUERY'; payload: string }
  | { type: 'SET_SELECTED_INDEX'; payload: number }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_EDITING_COMMAND'; payload: Command | null }
  | { type: 'SET_FORM_OPEN'; payload: boolean }
  | { type: 'SET_THEME'; payload: 'light' | 'dark' }
  | { type: 'RESET_UI' }

const initialState: AppState = {
  commands: [],
  usageStats: {},
  searchQuery: '',
  selectedIndex: 0,
  isLoading: true,
  editingCommand: null,
  isFormOpen: false,
  theme: 'light'
}

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_COMMANDS':
      return { ...state, commands: action.payload }
    case 'SET_USAGE_STATS':
      return { ...state, usageStats: action.payload }
    case 'SET_SEARCH_QUERY':
      return { ...state, searchQuery: action.payload, selectedIndex: 0 }
    case 'SET_SELECTED_INDEX':
      return { ...state, selectedIndex: action.payload }
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload }
    case 'SET_EDITING_COMMAND':
      return { ...state, editingCommand: action.payload }
    case 'SET_FORM_OPEN':
      return { ...state, isFormOpen: action.payload }
    case 'SET_THEME':
      return { ...state, theme: action.payload }
    case 'RESET_UI':
      return { ...state, searchQuery: '', selectedIndex: 0 }
    default:
      return state
  }
}

interface AppContextValue {
  state: AppState
  dispatch: React.Dispatch<AppAction>
  loadCommands: () => Promise<void>
}

const AppContext = createContext<AppContextValue | null>(null)

export function AppProvider({ children }: { children: ReactNode }): React.JSX.Element {
  const [state, dispatch] = useReducer(appReducer, initialState)

  const loadCommands = async (): Promise<void> => {
    try {
      const [commands, usageStats] = await Promise.all([
        window.abroshorts.commands.load(),
        window.abroshorts.usage.get()
      ])
      dispatch({ type: 'SET_COMMANDS', payload: commands })
      dispatch({ type: 'SET_USAGE_STATS', payload: usageStats })
    } catch (error) {
      console.error('Failed to load commands:', error)
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }

  useEffect(() => {
    loadCommands()

    const unsubscribeToggle = window.abroshorts.onWindowToggle(() => {
      dispatch({ type: 'RESET_UI' })
    })

    const unsubscribeTheme = window.abroshorts.onThemeChange((theme) => {
      dispatch({ type: 'SET_THEME', payload: theme })
    })

    return () => {
      unsubscribeToggle()
      unsubscribeTheme()
    }
  }, [loadCommands])

  return (
    <AppContext.Provider value={{ state, dispatch, loadCommands }}>{children}</AppContext.Provider>
  )
}

export function useAppContext(): AppContextValue {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider')
  }
  return context
}
