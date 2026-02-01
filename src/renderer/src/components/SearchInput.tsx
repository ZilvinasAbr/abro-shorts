import { forwardRef } from 'react'
import { SearchIcon } from 'lucide-react'
import { useAppContext } from '../context/AppContext'

interface SearchInputProps {
  placeholder?: string
}

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  ({ placeholder = 'Search commands...' }, ref) => {
    const { state, dispatch } = useAppContext()

    return (
      <div className="flex items-center gap-3 border-b border-border px-4 py-3">
        <SearchIcon className="size-5 shrink-0 text-muted-foreground" />
        <input
          ref={ref}
          type="text"
          value={state.searchQuery}
          onChange={(e) => dispatch({ type: 'SET_SEARCH_QUERY', payload: e.target.value })}
          placeholder={placeholder}
          className="flex-1 bg-transparent text-base outline-none placeholder:text-muted-foreground"
          autoFocus
        />
      </div>
    )
  }
)

SearchInput.displayName = 'SearchInput'
