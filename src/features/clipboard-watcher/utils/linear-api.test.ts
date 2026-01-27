import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mockFetch = vi.fn();

vi.mock("@tauri-apps/plugin-http", () => ({
  fetch: mockFetch,
}));

const { getIssue } = await import("./linear-api");

describe("getIssue", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it("throws error when token is missing", async () => {
    await expect(getIssue("ENG-123", undefined)).rejects.toThrow(
      "Linear token not found!",
    );
  });

  it("throws error when token is empty string", async () => {
    await expect(getIssue("ENG-123", "")).rejects.toThrow(
      "Linear token not found!",
    );
  });

  it("returns HistoryItem on successful fetch", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve({
          data: {
            issue: {
              title: "Fix payment flow",
              url: "https://linear.app/team/issue/ENG-123",
              state: { name: "In Progress" },
            },
          },
        }),
    });

    const result = await getIssue("ENG-123", "test-token");

    expect(result).toMatchObject({
      id: "ENG-123",
      type: "linear",
      label: "Fix payment flow",
      markdown:
        "[ENG-123 - Fix payment flow](https://linear.app/team/issue/ENG-123)",
      url: "https://linear.app/team/issue/ENG-123",
      branch_name: "ENG-123-fix-payment-flow",
      pr_name: "ENG-123 - Fix payment flow",
    });
    expect(result.date).toBeInstanceOf(Date);
  });

  it("generates branch name correctly with special characters", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve({
          data: {
            issue: {
              title: "Fix: bug (with special) chars! & stuff",
              url: "https://linear.app/team/issue/ENG-456",
              state: { name: "Todo" },
            },
          },
        }),
    });

    const result = await getIssue("ENG-456", "test-token");

    expect(result.branch_name).toBe(
      "ENG-456-fix-bug-with-special-chars-stuff",
    );
  });

  it("throws error on API failure", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 401,
      statusText: "Unauthorized",
    });

    await expect(getIssue("ENG-123", "bad-token")).rejects.toThrow(
      "Linear API error: 401 Unauthorized",
    );
  });

  it("throws error on GraphQL errors", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve({
          errors: [{ message: "Issue not found" }],
        }),
    });

    await expect(getIssue("ENG-999", "test-token")).rejects.toThrow(
      "Linear GraphQL error: Issue not found",
    );
  });

  it("throws error when issue is not found in response", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve({
          data: { issue: null },
        }),
    });

    await expect(getIssue("ENG-123", "test-token")).rejects.toThrow(
      "Invalid Linear API response: issue not found",
    );
  });

  it("sends correct request to Linear API", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve({
          data: {
            issue: {
              title: "Test",
              url: "https://linear.app/test",
              state: { name: "Todo" },
            },
          },
        }),
    });

    await getIssue("ENG-123", "my-linear-token");

    expect(mockFetch).toHaveBeenCalledWith("https://api.linear.app/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "my-linear-token",
      },
      body: expect.stringContaining("ENG-123"),
    });
  });
});
