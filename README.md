# dsh-wsl-path
> **Install set:** part of [dsh-wsl-kit](https://github.com/173787247/dsh-wsl-kit). Prefer `KIT_SET=daily` | `llm` | `github` | `full` (see kit README). Fault tree: [TROUBLESHOOTING.md](https://github.com/173787247/dsh-wsl-kit/blob/master/docs/TROUBLESHOOTING.md).


DeepSeek Harness tool: **`path_convert`** — convert between Linux (`/home`, `/mnt/c`) and Windows (`C:\`, `\\wsl$\`) paths, with `/mnt/c` caveats.

Part of **[dsh-wsl-kit](https://github.com/173787247/dsh-wsl-kit)**.

[中文说明 → README.zh.md](./README.zh.md)

---
## Compatibility

| Field | Value |
|-------|-------|
| **Plugin** | `dsh-wsl-path` **0.2.0** |
| **Minimum dsh** | ≥ **0.1.2** (web UI one-shot `?token=` on Windows relay `:3081`) |
| **Latest verified** | See [dsh-wsl-kit Compatibility](https://github.com/173787247/dsh-wsl-kit#compatibility-2026-09) (currently **`0.1.5-rc.1`**) — single source of truth for the suite |
| **Kit set** | `daily` (also in `github` / `full`; fetch+net also in `llm`) |
| **Cloud Flash** | Use model id **`deepseek-flash`** (V4.1 Flash) in `~/.dsh/settings.yaml` / `llm-deepseek` — not configured by this plugin |
| **Agent Teams** | Upstream experimental; not required here |

Suite floor versions: kit [`check-plugin-versions.sh`](https://github.com/173787247/dsh-wsl-kit/blob/master/scripts/check-plugin-versions.sh). Fault tree: [TROUBLESHOOTING.md](https://github.com/173787247/dsh-wsl-kit/blob/master/docs/TROUBLESHOOTING.md).

## Why

Agents and humans constantly mix `/mnt/c/Users/...` and `C:\Users\...`, or need `\\wsl$\Ubuntu\home\...` for Windows apps. This tool does the conversion and explains **drvfs vs Linux FS** trade-offs (CRLF, chmod, git).

## Tool

| Arg | Default | Meaning |
|-----|---------|---------|
| `path` | (required) | Absolute Linux or Windows path |
| `direction` | `auto` | `auto` / `toWindows` / `toLinux` |

## Install

```sh
dsh plugin --profile web add github:173787247/dsh-wsl-path
```

## Config

```yaml
- id: dsh-wsl-path
  name: dsh-wsl-path
  config: {}
```

## Test

```sh
npm test
```

## License

MIT
