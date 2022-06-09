import axios, { AxiosResponse } from "axios";

import { github } from "../../config";
import issueSets from "../data/githubIssueSets.json";
import logError from "./logError";

export default async function postToGithub(
  title: string,
  body: string,
  issueSet: keyof typeof issueSets
): Promise<number | null> {
  const { labels, projectColumn } = issueSets[issueSet];
  const postData = {
    title,
    body,
    assignees: ["PythonCoderAS"],
    labels,
  };
  let response: AxiosResponse;
  try {
    response = await axios.post(
      `https://api.github.com/repos/${github.owner}/${github.repo}/issues`,
      postData,
      {
        headers: {
          Authorization: `token ${github.token}`,
          Accept: "application/vnd.github.v3.raw+json",
          "Content-Type": "application/json",
        },
      }
    );
    if (response.status / 100 >= 4) {
      await logError(
        new Error(response.statusText),
        "github::postIssue::errorStatusCode",
        {
          reqData: postData,
          respData: response.data,
        }
      );
      return null;
    }
  } catch (e) {
    await logError(e, "github::postIssue", {
      reqData: postData,
    });
    return null;
  }

  const { data } = response;
  const { id } = data;
  const { number } = data;
  const postResponse2 = {
    note: null,
    content_id: id,
    content_type: "Issue",
  };
  let response2: AxiosResponse;
  try {
    response2 = await axios.post(
      `https://api.github.com/projects/columns/${projectColumn}/cards`,
      postResponse2,
      {
        headers: {
          Authorization: `token ${github.token}`,
          Accept: "application/vnd.github.v3+json",
          "Content-Type": "application/json",
        },
      }
    );
    if (response2.status / 100 >= 4) {
      await logError(
        new Error(response2.statusText),
        "github::assignIssueToProject::errorStatusCode",
        {
          reqData: postResponse2,
          respData: response2.data,
        }
      );
      return null;
    }
  } catch (e) {
    await logError(e, "github::assignIssueToProject", {
      reqData: postResponse2,
    });
    return null;
  }

  return number;
}
