import { fetch } from "@tauri-apps/plugin-http";
import type { HistoryItem } from "../history-panel";

type LinearIssueResponse = {
  data?: {
    issue?: {
      title: string;
      url: string;
      state: {
        name: string;
      };
    };
  };
  errors?: Array<{ message: string }>;
};

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

  if (!response.ok) {
    throw new Error(
      `Linear API error: ${response.status} ${response.statusText}`,
    );
  }

  const data: LinearIssueResponse = await response.json();

  if (data.errors && data.errors.length > 0) {
    throw new Error(`Linear GraphQL error: ${data.errors[0].message}`);
  }

  const issue = data.data?.issue;

  if (!issue) {
    throw new Error("Invalid Linear API response: issue not found");
  }

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
