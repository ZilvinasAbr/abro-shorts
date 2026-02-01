import { app } from 'electron'
import { promises as fs } from 'fs'
import path from 'path'
import type { Command } from '../../shared/types'

function getCommandsDir(): string {
  return path.join(app.getPath('userData'), 'commands')
}

export async function ensureCommandsDir(): Promise<void> {
  const dir = getCommandsDir()
  await fs.mkdir(dir, { recursive: true })
}

export async function loadCommands(): Promise<Command[]> {
  await ensureCommandsDir()
  const dir = getCommandsDir()

  try {
    const files = await fs.readdir(dir)
    const jsonFiles = files.filter((f) => f.endsWith('.json'))

    const commands: Command[] = []
    for (const file of jsonFiles) {
      try {
        const content = await fs.readFile(path.join(dir, file), 'utf-8')
        commands.push(JSON.parse(content))
      } catch {
        // Skip invalid files
      }
    }

    return commands
  } catch {
    return []
  }
}

export async function saveCommand(command: Command): Promise<void> {
  await ensureCommandsDir()
  const filePath = path.join(getCommandsDir(), `${command.id}.json`)
  await fs.writeFile(filePath, JSON.stringify(command, null, 2), 'utf-8')
}

export async function deleteCommand(id: string): Promise<void> {
  const filePath = path.join(getCommandsDir(), `${id}.json`)
  try {
    await fs.unlink(filePath)
  } catch {
    // File may not exist
  }
}
