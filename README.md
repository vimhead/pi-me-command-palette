# vipir-palette

Find and run Pi slash commands from a searchable keyboard palette.

## Install

```sh
pi install git:github.com/vimhead/vipir-editor
pi install git:github.com/vimhead/vipir-palette
```

Run **`/reload`**. Enabled by default in [Vipir](https://github.com/vimhead/vipir).

## Use

Press **Esc**, then **Space Space** in the prompt. Type to filter commands, use the displayed selection keys, and press **Enter** to choose. Supply arguments when prompted; Pi provides completion suggestions.

Query and argument fields support modal editing. **Esc** leaves insert mode; another **Esc** closes or goes back. In normal mode, **j/k** select and **i** returns to typing.

Disable in `/vipir` and sync, or run `pi remove git:github.com/vimhead/vipir-palette` and reload.
