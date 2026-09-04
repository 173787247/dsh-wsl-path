import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { adviceFor, pathTags, toWindowsPath, toLinuxPath } from "../lib/path.js";

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
    assert.equal(toLinuxPath("\\\\wsl.localhost\\Ubuntu-24.04\\home\\a").linux, "/home/a");
  });

  it("tags Desktop on drvfs and points to mnt_doctor", () => {
    const tags = pathTags("/mnt/c/Users/a/Desktop/proj");
    assert.ok(tags.includes("windows_user_folder"));
    const tips = adviceFor("drvfs", "toWindows", { input: "/mnt/c/Users/a/Desktop/proj" });
    assert.ok(tips.some((t) => /mnt_doctor/i.test(t)));
    assert.ok(tips.some((t) => /encoding_doctor/i.test(t)));
  });
});
