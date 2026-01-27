import { describe, expect, it } from "vitest";
import { parseClipboard } from "./parse-clipboard";

describe("parseClipboard", () => {
  describe("Linear issue keys", () => {
    it("parses ENG- issue keys from Linear URLs", () => {
      const result = parseClipboard(
        "https://linear.app/team/issue/ENG-123/some-issue-title",
      );
      expect(result).toEqual({ type: "linear", id: "ENG-123" });
    });

    it("parses PAY- issue keys from Linear URLs", () => {
      const result = parseClipboard(
        "https://linear.app/team/issue/PAY-456/payment-issue",
      );
      expect(result).toEqual({ type: "linear", id: "PAY-456" });
    });

    it("handles issue keys with large numbers", () => {
      const result = parseClipboard(
        "https://linear.app/team/issue/ENG-99999/big-number",
      );
      expect(result).toEqual({ type: "linear", id: "ENG-99999" });
    });
  });

  describe("GitHub PR URLs", () => {
    it("parses GitHub PR URLs", () => {
      const result = parseClipboard("https://github.com/owner/repo/pull/123");
      expect(result).toEqual({ type: "github", id: "PR-123" });
    });

    it("handles repos with hyphens and underscores", () => {
      const result = parseClipboard(
        "https://github.com/some-owner/my_repo-name/pull/456",
      );
      expect(result).toEqual({ type: "github", id: "PR-456" });
    });

    it("handles large PR numbers", () => {
      const result = parseClipboard(
        "https://github.com/facebook/react/pull/99999",
      );
      expect(result).toEqual({ type: "github", id: "PR-99999" });
    });
  });

  describe("invalid inputs", () => {
    it("returns null for non-URL text", () => {
      expect(parseClipboard("just some text")).toBeNull();
    });

    it("returns null for empty string", () => {
      expect(parseClipboard("")).toBeNull();
    });

    it("returns null for non-https URLs", () => {
      expect(
        parseClipboard("http://github.com/owner/repo/pull/123"),
      ).toBeNull();
    });

    it("returns null for unrecognized URLs", () => {
      expect(parseClipboard("https://example.com/some/path")).toBeNull();
    });

    it("returns null for GitHub non-PR URLs", () => {
      expect(
        parseClipboard("https://github.com/owner/repo/issues/123"),
      ).toBeNull();
    });

    it("returns null for malformed GitHub PR URLs", () => {
      expect(parseClipboard("https://github.com/owner/pull/123")).toBeNull();
    });
  });
});
