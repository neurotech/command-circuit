import type { HistoryItem } from "../history-panel";

export const getGitHubMetadata = (text: string) => {
  const url = new URL(text);
  const owner = url.pathname.split("/")[1];
  const repo = url.pathname.split("/")[2];
  const id = url.pathname.split("/")[4];

  return {
    owner,
    repo,
    id,
  };
};

export const getPR = async (
  text: string,
  token?: string,
): Promise<HistoryItem> => {
  const { owner, repo, id } = getGitHubMetadata(text);

  if (!token) {
    throw new Error("GitHub token not found!");
  }

  const response = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/pulls/${id}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/vnd.github+json",
        Authorization: `Bearer ${token}`,
        "X-GitHub-Api-Version": "2022-11-28",
      },
    },
  );

  const pr = await response.json();

  return {
    id: `PR-${id}`,
    type: "github",
    label: pr.title,
    markdown: `[PR #${id} - ${pr.title}](${pr.html_url})`,
    date: new Date(),
    url: pr.html_url,
  };
};
