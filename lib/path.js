/**
 * Path conversion and /mnt/c caveats for agents in WSL.
 */
export function distroName({ env = process.env } = {}) {
  return env.WSL_DISTRO_NAME || "WSL";
}

export function toWindowsPath(linuxPath, { distro = distroName() } = {}) {
  const normalized = String(linuxPath || "").trim().replace(/\\/g, "/");
  if (!normalized.startsWith("/")) return { ok: false, error: "linux path must be absolute" };

  const mnt = normalized.match(/^\/mnt\/([a-zA-Z])\/(.*)$/);
  if (mnt) {
    const rest = mnt[2].replace(/\//g, "\\");
    return { ok: true, windows: `${mnt[1].toUpperCase()}:\\${rest}`, kind: "drvfs" };
  }
  const mntRoot = normalized.match(/^\/mnt\/([a-zA-Z])\/?$/);
  if (mntRoot) {
    return { ok: true, windows: `${mntRoot[1].toUpperCase()}:\\`, kind: "drvfs" };
  }
  const trimmed = normalized.replace(/^\//, "").replace(/\//g, "\\");
  return { ok: true, windows: `\\\\wsl$\\${distro}\\${trimmed}`, kind: "wsl$" };
}

export function toLinuxPath(windowsPath, { distro = distroName() } = {}) {
  const raw = String(windowsPath || "").trim();
  if (!raw) return { ok: false, error: "empty windows path" };

  const drive = raw.match(/^([a-zA-Z]):[\\/]?(.*)$/);
  if (drive) {
    const rest = drive[2].replace(/\\/g, "/").replace(/^\/+/, "");
    return {
      ok: true,
      linux: rest ? `/mnt/${drive[1].toLowerCase()}/${rest}` : `/mnt/${drive[1].toLowerCase()}`,
      kind: "drvfs",
    };
  }

  // \\wsl$\Distro\... or \\wsl.localhost\Distro\...
  const unc = raw.match(/^\\\\wsl(?:\$|\.localhost)\\([^\\/]+)[\\/]?(.*)$/i);
  if (unc) {
    const name = unc[1];
    const rest = unc[2].replace(/\\/g, "/").replace(/^\/+/, "");
    return { ok: true, linux: rest ? `/${rest}` : "/", kind: "wsl$", distro: name };
  }

  return { ok: false, error: "unrecognized windows path" };
}

export function pathTags(linuxOrWinPath) {
  const s = String(linuxOrWinPath || "").replace(/\\/g, "/");
  const tags = [];
  if (/\/mnt\/[a-zA-Z](\/|$)/i.test(s) || /^[a-zA-Z]:\//.test(s)) tags.push("drvfs");
  if (/\/(Desktop|Downloads|Documents)(\/|$)/i.test(s)) tags.push("windows_user_folder");
  if (/\/Users\//i.test(s)) tags.push("windows_users");
  if (/^\/home\//.test(s) || /\\\\wsl/i.test(String(linuxOrWinPath || ""))) tags.push("linux_fs");
  return tags;
}

export function adviceFor(kind, direction, { input = "", output = "" } = {}) {
  const tips = [];
  const tags = pathTags(direction === "toWindows" ? input : output || input);

  if (kind === "drvfs") {
    tips.push("Path is on /mnt/<drive> (Windows NTFS). Prefer not to chmod/chown or run heavy git metadata ops here.");
    tips.push("Line endings may be CRLF; set git core.autocrlf carefully. Use encoding_doctor path=… on .sh files.");
    tips.push("For workspace hygiene run mnt_doctor on this path — prefer cloning under /home.");
  }
  if (kind === "wsl$") {
    tips.push("Path lives on the Linux filesystem (\\\\wsl$\\…). Best place for git, npm, and chmod.");
    if (direction === "toWindows") {
      tips.push("Windows apps open this via \\\\wsl$\\<distro>\\… — Explorer and some editors support it. Chat click-open: dsh-wsl-open.");
    }
  }
  if (tags.includes("windows_user_folder")) {
    tips.push("Desktop/Downloads/Documents: fine to open files with dsh-wsl-open; avoid as the agent git/npm root.");
  }
  if (direction === "toLinux" && kind === "drvfs") {
    tips.push(`Linux form: ${output || "(see output)"} — use this in WSL shells, not C:\\…`);
  }
  return tips;
}

export function formatPathResult(value) {
  if (!value.ok) return `path_convert failed: ${value.error}`;
  const lines = [
    `direction: ${value.direction}`,
    `kind: ${value.kind}`,
    `input: ${value.input}`,
    `output: ${value.output}`,
  ];
  if (value.tags?.length) lines.push(`tags: ${value.tags.join(",")}`);
  for (const tip of value.advice || []) lines.push(`- ${tip}`);
  return lines.join("\n");
}
