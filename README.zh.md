# dsh-wsl-path
> **套件安装：** 见 [dsh-wsl-kit](https://github.com/173787247/dsh-wsl-kit)。推荐 `KIT_SET=daily` | `llm` | `github` | `full`。故障树：[TROUBLESHOOTING.zh.md](https://github.com/173787247/dsh-wsl-kit/blob/master/docs/TROUBLESHOOTING.zh.md)。


DeepSeek Harness 工具：**`path_convert`** — 在 Linux（`/home`、`/mnt/c`）与 Windows（`C:\`、`\\wsl$\`）路径之间互转，并附带 `/mnt/c` 注意点。

属于 **[dsh-wsl-kit](https://github.com/173787247/dsh-wsl-kit)**。

[English → README.md](./README.md)

---

## 为什么需要

Agent 和人经常把 `/mnt/c/Users/...` 与 `C:\Users\...` 混用，或需要 `\\wsl$\Ubuntu\home\...` 给 Windows 程序用。本工具做转换，并说明 **drvfs 与 Linux 文件系统** 的取舍（CRLF、chmod、git）。

Windows 盘（drvfs）上慎用 chmod / 重型 git；日常开发优先 Linux 家目录。

## 工具

| 参数 | 默认 | 含义 |
|------|------|------|
| `path` | （必填） | 绝对 Linux 或 Windows 路径 |
| `direction` | `auto` | `auto` / `toWindows` / `toLinux` |

## 安装

```sh
dsh plugin --profile web add github:173787247/dsh-wsl-path
```

## 配置

```yaml
- id: dsh-wsl-path
  name: dsh-wsl-path
  config: {}
```

## 测试

```sh
npm test
```

## 许可

MIT
