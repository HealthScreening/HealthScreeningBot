/**
 * Copyright (C) 2021 PythonCoderAS
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */
import axios, { AxiosResponse } from "axios";

import { github } from "../../config";
import logError from "./logError";
import issueSets from "../data/githubIssueSets.json"

export default async function postToGithub(
  title: string,
  body: string,
  issueSet: keyof typeof issueSets,
): Promise<number | null> {
  const {labels, projectColumn} = issueSets[issueSet];
  const postData = {
    title: title,
    body: body,
    assignees: ["PythonCoderAS"],
    labels: labels,
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
  const data = response.data;
  const id = data.id;
  const number = data.number;
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
