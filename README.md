# dsh-wsl-path

DeepSeek Harness tool: **`path_convert`** — convert between Linux (`/home`, `/mnt/c`) and Windows (`C:\`, `\\wsl$\`) paths, with `/mnt/c` caveats.

Part of **[dsh-wsl-kit](https://github.com/173787247/dsh-wsl-kit)**.

[中文说明 ↓](#中文)

---

## English

### Why

Agents and humans constantly mix `/mnt/c/Users/...` and `C:\Users\...`, or need `\\wsl$\Ubuntu\home\...` for Windows apps. This tool does the conversion and explains **drvfs vs Linux FS** trade-offs (CRLF, chmod, git).

### Tool

| Arg | Default | Meaning |
|-----|---------|---------|
| `path` | (required) | Absolute Linux or Windows path |
| `direction` | `auto` | `auto` / `toWindows` / `toLinux` |

### Install

```sh
dsh plugin --profile web add github:173787247/dsh-wsl-path
```

### Config

```yaml
- id: dsh-wsl-path
  name: dsh-wsl-path
  config: {}
```

### Test

```sh
npm test
```

### License

MIT

---

## 中文

### 为什么需要

频繁在 `/mnt/c/...`、`C:\...`、`\\wsl$\...` 之间互转，并提醒：Windows 盘（drvfs）上慎用 chmod / 重型 git；日常开发优先 Linux 家目录。

### 安装

```sh
dsh plugin --profile web add github:173787247/dsh-wsl-path
```

### 许可

MIT
