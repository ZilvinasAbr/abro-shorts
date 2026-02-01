import { MoreHorizontalIcon, PencilIcon, TerminalIcon, TrashIcon } from 'lucide-react'
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger
} from '@/components/ui/context-menu'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import type { Command } from '../../../shared/types'
import { useAppContext } from '../context/AppContext'
import { useCommands } from '../hooks/useCommands'

interface CommandItemProps {
  command: Command
  isSelected: boolean
  onSelect: () => void
}

export function CommandItem({
  command,
  isSelected,
  onSelect
}: CommandItemProps): React.JSX.Element {
  const { dispatch } = useAppContext()
  const { executeCommand, deleteCommand } = useCommands()

  const handleEdit = (): void => {
    dispatch({ type: 'SET_EDITING_COMMAND', payload: command })
    dispatch({ type: 'SET_FORM_OPEN', payload: true })
  }

  const handleDelete = (): void => {
    deleteCommand(command.id)
  }

  const handleDoubleClick = (): void => {
    executeCommand(command)
  }

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <div
          onClick={onSelect}
          onDoubleClick={handleDoubleClick}
          className={`group flex cursor-default items-center gap-3 rounded-md px-3 py-2 transition-colors ${
            isSelected ? 'bg-accent text-accent-foreground' : 'hover:bg-accent/50'
          }`}
        >
          <TerminalIcon className="size-4 shrink-0 text-muted-foreground" />
          <div className="min-w-0 flex-1">
            <div className="truncate font-medium">{command.name}</div>
            <div className="truncate text-xs text-muted-foreground">{command.command}</div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger
              onClick={(e) => e.stopPropagation()}
              className="rounded p-1 opacity-0 transition-opacity hover:bg-accent group-hover:opacity-100"
            >
              <MoreHorizontalIcon className="size-4 shrink-0 text-muted-foreground" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleEdit}>
                <PencilIcon className="mr-2 size-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleDelete} variant="destructive">
                <TrashIcon className="mr-2 size-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem onClick={handleEdit}>
          <PencilIcon className="mr-2 size-4" />
          Edit
        </ContextMenuItem>
        <ContextMenuItem onClick={handleDelete} className="text-destructive">
          <TrashIcon className="mr-2 size-4" />
          Delete
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  )
}
