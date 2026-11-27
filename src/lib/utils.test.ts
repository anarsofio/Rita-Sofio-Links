import { describe, expect, it } from "vitest";
import { cn } from "./utils";

describe("cn", () => {
  it("joins plain class strings", () => {
    expect(cn("a", "b", "c")).toBe("a b c");
  });

  it("drops falsy values", () => {
    expect(cn("a", false, undefined, null, "", "b")).toBe("a b");
  });

  it("applies conditional classes via objects", () => {
    expect(cn("a", { b: true, c: false })).toBe("a b");
  });

  it("resolves conflicting tailwind utilities, keeping the last one", () => {
    expect(cn("px-2 py-2", "px-4")).toBe("py-2 px-4");
  });

  it("lets an explicit override win over a variant's default", () => {
    expect(cn("text-sm text-ink", "text-lg")).toBe("text-ink text-lg");
  });
});
