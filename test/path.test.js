import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { toWindowsPath, toLinuxPath, adviceFor } from "../lib/path.js";

describe("path_convert", () => {
  it("maps /mnt/c and linux home", () => {
    assert.equal(toWindowsPath("/mnt/c/Users/a", { distro: "Ubuntu" }).windows, "C:\\Users\\a");
    assert.equal(
      toWindowsPath("/home/a/x", { distro: "Ubuntu-24.04" }).windows,
      "\\\\wsl$\\Ubuntu-24.04\\home\\a\\x",
    );
  });

  it("maps Windows drive and UNC back", () => {
    assert.equal(toLinuxPath("C:\\Users\\a").linux, "/mnt/c/Users/a");
    assert.equal(toLinuxPath("\\\\wsl$\\Ubuntu\\home\\a").linux, "/home/a");
  });

  it("gives drvfs caveats", () => {
    assert.ok(adviceFor("drvfs", "toWindows").some((t) => /NTFS|CRLF|chmod/i.test(t)));
  });
});
