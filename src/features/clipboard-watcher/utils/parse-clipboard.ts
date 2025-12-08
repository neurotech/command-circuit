import { getGitHubMetadata } from "./github-api";

type Result = {
  type: "linear" | "github";
  id: string;
};

const linearRegex = /(ENG-|PAY-)\d+/;
const gitHubRegex =
  /https:\/\/github\.com\/[a-zA-Z0-9_-]+\/[a-zA-Z0-9_-]+\/pull\/[0-9]+/;

export const parseClipboard = (text: string): Result | null => {
  if (!text.startsWith("https://")) return null;

  const linearMatch = text.match(linearRegex);
  const gitHubMatch = text.match(gitHubRegex);

  if (linearMatch && linearMatch.length > 0) {
    return {
      type: "linear",
      id: linearMatch[0],
    };
  }
  if (gitHubMatch && gitHubMatch.length > 0) {
    const { id } = getGitHubMetadata(gitHubMatch[0]);

    return {
      type: "github",
      id: `PR-${id}`,
    };
  }

  return null;
};
