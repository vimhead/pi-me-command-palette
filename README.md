# pi-me-command-palette

Find and run Pi slash commands from a searchable keyboard palette.

## Install

```sh
pi install git:github.com/vimhead/pi-me
pi install git:github.com/vimhead/pi-me-command-palette
```

Run **`/reload`**. Enabled by default in [Vipi](https://github.com/vimhead/vipi).

## Use

Press **Esc**, then **Space Space** in the prompt. Type to filter commands, use the displayed selection keys, and press **Enter** to choose. Supply arguments when prompted; Pi provides completion suggestions.

Query and argument fields support modal editing. **Esc** leaves insert mode; another **Esc** closes or goes back. In normal mode, **j/k** select and **i** returns to typing.

Disable in `/vipi` and sync, or run `pi remove git:github.com/vimhead/pi-me-command-palette` and reload.
