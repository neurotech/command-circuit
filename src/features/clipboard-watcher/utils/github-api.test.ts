import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { getGitHubMetadata, getPR } from "./github-api";

describe("getGitHubMetadata", () => {
  it("extracts owner, repo, and id from PR URL", () => {
    const result = getGitHubMetadata("https://github.com/owner/repo/pull/123");
    expect(result).toEqual({ owner: "owner", repo: "repo", id: "123" });
  });

  it("handles repos with hyphens and underscores", () => {
    const result = getGitHubMetadata(
      "https://github.com/my-org/my_repo-name/pull/456",
    );
    expect(result).toEqual({
      owner: "my-org",
      repo: "my_repo-name",
      id: "456",
    });
  });
});

describe("getPR", () => {
  const mockFetch = vi.fn();

  beforeEach(() => {
    vi.stubGlobal("fetch", mockFetch);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.resetAllMocks();
  });

  it("throws error when token is missing", async () => {
    await expect(
      getPR("https://github.com/owner/repo/pull/123", undefined),
    ).rejects.toThrow("GitHub token not found!");
  });

  it("throws error when token is empty string", async () => {
    await expect(
      getPR("https://github.com/owner/repo/pull/123", ""),
    ).rejects.toThrow("GitHub token not found!");
  });

  it("returns HistoryItem on successful fetch", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve({
          title: "Fix bug in login",
          html_url: "https://github.com/owner/repo/pull/123",
        }),
    });

    const result = await getPR(
      "https://github.com/owner/repo/pull/123",
      "test-token",
    );

    expect(result).toMatchObject({
      id: "PR-123",
      type: "github",
      label: "Fix bug in login",
      markdown:
        "[PR #123 - Fix bug in login](https://github.com/owner/repo/pull/123)",
      url: "https://github.com/owner/repo/pull/123",
    });
    expect(result.date).toBeInstanceOf(Date);
  });

  it("throws error on API failure", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 404,
      statusText: "Not Found",
    });

    await expect(
      getPR("https://github.com/owner/repo/pull/123", "test-token"),
    ).rejects.toThrow("GitHub API error: 404 Not Found");
  });

  it("throws error when response is missing required fields", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ message: "Not Found" }),
    });

    await expect(
      getPR("https://github.com/owner/repo/pull/123", "test-token"),
    ).rejects.toThrow("Invalid GitHub API response: missing required fields");
  });

  it("sends correct headers with request", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve({
          title: "Test PR",
          html_url: "https://github.com/owner/repo/pull/123",
        }),
    });

    await getPR("https://github.com/owner/repo/pull/123", "my-token");

    expect(mockFetch).toHaveBeenCalledWith(
      "https://api.github.com/repos/owner/repo/pulls/123",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/vnd.github+json",
          Authorization: "Bearer my-token",
          "X-GitHub-Api-Version": "2022-11-28",
        },
      },
    );
  });
});
