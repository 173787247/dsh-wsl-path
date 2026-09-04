import { detectWsl } from "./lib/wsl-host.js";
import {
  adviceFor,
  distroName,
  formatPathResult,
  pathTags,
  toLinuxPath,
  toWindowsPath,
} from "./lib/path.js";

export const name = "dsh-wsl-path";
export const inject = ["tools", "systemPrompt"];

export function apply(ctx) {
  const wsl = detectWsl();
  const distro = distroName();

  ctx.systemPrompt.section({
    name: "tool:path_convert",
    order: 119,
    text: [
      "Use path_convert to translate between Linux (/home, /mnt/c) and Windows (C:\\, \\\\wsl$\\) paths.",
      "Prefer Linux home for git/npm; treat /mnt/c as Windows NTFS with CRLF and permission caveats — pair with mnt_doctor / encoding_doctor.",
    ].join(" "),
  });

  ctx.tools.register({
    name: "path_convert",
    description: "Convert paths between WSL Linux and Windows forms and explain /mnt/c vs \\\\wsl$ caveats.",
    parameters: {
      type: "object",
      additionalProperties: false,
      required: ["path"],
      properties: {
        path: { type: "string", description: "Absolute Linux or Windows path." },
        direction: {
          type: "string",
          enum: ["auto", "toWindows", "toLinux"],
          description: "Default auto: detect by looking for drive letter or UNC vs leading /.",
        },
      },
    },
    output: {
      schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          ok: { type: "boolean" },
          direction: { type: "string" },
          kind: { type: "string" },
          input: { type: "string" },
          output: { type: "string" },
          advice: { type: "array", items: { type: "string" } },
          tags: { type: "array", items: { type: "string" } },
          error: { type: "string" },
        },
      },
      render: (_args, value) => [{ type: "text", text: formatPathResult(value) }],
    },
    timeoutMs: 5_000,
    isConcurrencySafe: () => true,
    async execute(args) {
      if (!wsl) return { ok: false, error: "not running in WSL" };
      const input = String(args?.path ?? "").trim();
      let direction = args?.direction === "toWindows" || args?.direction === "toLinux"
        ? args.direction
        : "auto";
      if (direction === "auto") {
        direction = /^[a-zA-Z]:[\\/]/.test(input) || /^\\\\/.test(input) ? "toLinux" : "toWindows";
      }
      if (direction === "toWindows") {
        const r = toWindowsPath(input, { distro });
        if (!r.ok) return r;
        return {
          ok: true,
          direction,
          kind: r.kind,
          input,
          output: r.windows,
          tags: pathTags(input),
          advice: adviceFor(r.kind, direction, { input, output: r.windows }),
        };
      }
      const r = toLinuxPath(input, { distro });
      if (!r.ok) return r;
      return {
        ok: true,
        direction,
        kind: r.kind,
        input,
        output: r.linux,
        tags: pathTags(r.linux),
        advice: adviceFor(r.kind, direction, { input, output: r.linux }),
      };
    },
    presentCall: () => ({ card: "generic", title: "Path convert" }),
    presentResult: (_args, result) => (
      result.isError
        ? { card: "generic", title: "Path convert failed", content: result.content }
        : { card: "generic", title: "Path convert", content: result.content }
    ),
  });
}
