import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAppContext } from '../context/AppContext'
import { useCommands } from '../hooks/useCommands'

const commandSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  command: z.string().min(1, 'Command is required')
})

type CommandFormData = z.infer<typeof commandSchema>

export function CommandForm(): React.JSX.Element {
  const { state, dispatch } = useAppContext()
  const { createCommand, updateCommand } = useCommands()
  const { isFormOpen, editingCommand, searchQuery } = state

  const {
    register,
    handleSubmit,
    reset,
    setFocus,
    formState: { errors, isSubmitting }
  } = useForm<CommandFormData>({
    resolver: zodResolver(commandSchema),
    defaultValues: {
      name: '',
      command: ''
    }
  })

  useEffect(() => {
    if (isFormOpen) {
      if (editingCommand) {
        reset({
          name: editingCommand.name,
          command: editingCommand.command
        })
      } else {
        reset({
          name: searchQuery,
          command: ''
        })
      }
      setTimeout(() => {
        setFocus(editingCommand ? 'name' : searchQuery ? 'command' : 'name')
      }, 0)
    }
  }, [isFormOpen, editingCommand, searchQuery, reset, setFocus])

  const onSubmit = async (data: CommandFormData): Promise<void> => {
    if (editingCommand) {
      await updateCommand(editingCommand.id, data.name, data.command)
    } else {
      await createCommand(data.name, data.command)
    }
    handleClose()
  }

  const handleClose = (): void => {
    dispatch({ type: 'SET_FORM_OPEN', payload: false })
    dispatch({ type: 'SET_EDITING_COMMAND', payload: null })
    reset()
  }

  return (
    <Dialog open={isFormOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{editingCommand ? 'Edit Command' : 'New Command'}</DialogTitle>
          <DialogDescription>
            {editingCommand ? 'Update your command shortcut' : 'Create a new command shortcut'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              placeholder="e.g., Open VS Code"
              {...register('name')}
              autoComplete="off"
            />
            {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="command">Command</Label>
            <Input
              id="command"
              placeholder="e.g., code ."
              {...register('command')}
              autoComplete="off"
            />
            {errors.command && <p className="text-sm text-destructive">{errors.command.message}</p>}
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {editingCommand ? 'Save' : 'Create'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
