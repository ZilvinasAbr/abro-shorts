# AbroShorts

A macOS command launcher with global keyboard activation, fuzzy search, and silent command execution. Think of it as your personal Spotlight for shell commands.

## Features

- **Global Shortcut**: Press `Option+Space` from any application to instantly open the launcher
- **Fuzzy Search**: Find commands quickly with intelligent fuzzy matching
- **Silent Execution**: Commands run in the background without opening terminal windows
- **Usage Tracking**: Frequently-used commands automatically appear first
- **System Theme**: Automatically follows your macOS dark/light mode
- **Native Feel**: Frameless window with macOS vibrancy effect

## Installation

### Prerequisites

- Node.js 18+
- pnpm

### Setup

```bash
pnpm install
```

### Development

```bash
pnpm dev
```

### Build

```bash
# For macOS
pnpm build:mac

# For Windows
pnpm build:win

# For Linux
pnpm build:linux
```

## Usage

### Opening the Launcher

Press `Option+Space` (Alt+Space) from anywhere to toggle the launcher. The window appears centered on your screen.

### Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Option+Space` | Toggle launcher (global) |
| `Enter` | Execute selected command |
| `Escape` | Close launcher |
| `↑` / `↓` | Navigate command list |
| `Tab` | Edit selected command |
| `Cmd+N` | Create new command |
| `Cmd+E` | Edit selected command |
| `Cmd+Backspace` | Delete selected command |

### Creating Commands

1. Open the launcher with `Option+Space`
2. Press `Cmd+N` to open the new command dialog
3. Enter a **Name** (e.g., "Open VS Code")
4. Enter the **Command** (e.g., `code .`)
5. Click **Create** or press `Enter`

You can also type a search query and click "Create" when no matches are found - the search text becomes the command name.

### Editing Commands

- Select a command and press `Tab` or `Cmd+E`
- Or right-click a command and select **Edit**

### Deleting Commands

- Select a command and press `Cmd+Backspace`
- Or right-click a command and select **Delete**

### Searching

Just start typing to filter commands. The fuzzy search matches against both command names and the actual shell commands.

## Data Storage

All data is stored in `~/Library/Application Support/AbroShorts/`:

```
~/Library/Application Support/AbroShorts/
├── commands/           # Individual JSON files per command
│   ├── abc123.json
│   └── def456.json
├── settings.json       # App settings (shortcut, theme)
└── usage-stats.json    # Command usage statistics
```

Command files are human-readable JSON, so you can edit them directly if needed:

```json
{
  "id": "abc123",
  "name": "Open VS Code",
  "command": "code .",
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

## Configuration

### Changing the Global Shortcut

Edit `~/Library/Application Support/AbroShorts/settings.json`:

```json
{
  "shortcut": "Alt+Space",
  "theme": "system"
}
```

Supported modifiers: `Cmd`, `Ctrl`, `Alt`, `Shift`

## Example Commands

Here are some useful commands to get you started:

| Name | Command |
|------|---------|
| Open VS Code | `code .` |
| Open Terminal | `open -a Terminal` |
| Start Dev Server | `cd ~/projects/myapp && pnpm dev` |
| Git Status | `cd ~/projects/myapp && git status` |
| Kill Port 3000 | `lsof -ti:3000 \| xargs kill -9` |
| Open Finder | `open .` |
| Clear DNS Cache | `sudo dscacheutil -flushcache` |

## Tech Stack

- **Electron** - Cross-platform desktop app framework
- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **shadcn/ui** - UI components
- **Fuse.js** - Fuzzy search
- **electron-vite** - Build tooling

## Development

### Project Structure

```
src/
├── main/           # Electron main process
│   ├── index.ts    # Window management, shortcuts
│   ├── ipc/        # IPC handlers
│   └── storage/    # File persistence
├── preload/        # Context bridge
├── renderer/src/   # React UI
│   ├── components/ # UI components
│   ├── context/    # App state
│   └── hooks/      # Custom hooks
└── shared/         # Shared types
```

### Scripts

```bash
pnpm dev         # Start development
pnpm build       # Type-check and build
pnpm lint        # Run ESLint
pnpm format      # Run Prettier
pnpm typecheck   # TypeScript check only
```

## License

MIT
