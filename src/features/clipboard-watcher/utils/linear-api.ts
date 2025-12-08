import { fetch } from "@tauri-apps/plugin-http";
import type { HistoryItem } from "../history-panel";

export const getIssue = async (
  key: string,
  token?: string,
): Promise<HistoryItem> => {
  if (!token) {
    throw new Error("Linear token not found!");
  }

  const query = `
    query {
      issue(id: "${key}") {
        title
        url
        state {
          name
        }
      }
    }
  `;
  const body = JSON.stringify({ query });

  const response = await fetch("https://api.linear.app/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
    body,
  });

  const data = await response.json();
  const issue = data.data.issue;

  return {
    id: key,
    type: "linear",
    label: issue.title,
    markdown: `[${key} - ${issue.title}](${issue.url})`,
    date: new Date(),
    url: issue.url,
    branch_name: `${key}-${issue.title
      .trim()
      .replace(/[^a-zA-Z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .toLowerCase()}`,
    pr_name: `${key} - ${issue.title}`,
  };
};
