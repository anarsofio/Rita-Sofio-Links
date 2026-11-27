import { describe, expect, it } from "vitest";
import { describeError } from "./error-capture";

describe("describeError", () => {
  it("includes the message for a plain Error", () => {
    const err = new Error("boom");
    expect(describeError(err)).toContain("boom");
  });

  it("walks the cause chain and labels nested causes", () => {
    const root = new Error("root cause");
    const wrapped = new Error("outer failure", { cause: root });
    const result = describeError(wrapped);
    expect(result).toContain("outer failure");
    expect(result).toContain("caused by:");
    expect(result).toContain("root cause");
  });

  it("stringifies non-Error values instead of throwing", () => {
    expect(describeError("just a string")).toBe("just a string");
    expect(describeError({ a: 1 })).toBe('{"a":1}');
  });

  it("handles circular non-Error values without throwing", () => {
    const circular: Record<string, unknown> = {};
    circular["self"] = circular;
    expect(() => describeError(circular)).not.toThrow();
  });

  it("appends the status code when present on the error", () => {
    const err = Object.assign(new Error("not found"), { status: 404 });
    expect(describeError(err)).toContain("(status 404)");
  });

  it("truncates very long output", () => {
    const err = new Error("x".repeat(20_000));
    expect(describeError(err).length).toBeLessThanOrEqual(8_000);
  });
});
