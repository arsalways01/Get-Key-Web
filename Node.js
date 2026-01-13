const { Octokit } = require("@octokit/rest");
const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

async function updateKey(keyName, newValue) {
  const { data: file } = await octokit.repos.getContent({
    owner: "username",
    repo: "api-keys-management",
    path: "keys.json",
  });

  const content = Buffer.from(file.content, "base64").toString();
  const json = JSON.parse(content);
  json[keyName] = newValue;

  await octokit.repos.createOrUpdateFileContents({
    owner: "username",
    repo: "api-keys-management",
    path: "keys.json",
    message: `Update ${keyName}`,
    content: Buffer.from(JSON.stringify(json, null, 2)).toString("base64"),
    sha: file.sha,
  });
}
