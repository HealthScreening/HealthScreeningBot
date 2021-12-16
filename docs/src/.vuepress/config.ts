import type { DefaultThemeOptions } from "vuepress";
import { defineUserConfig } from "vuepress";

import { description } from "../../package.json";

import quickstartSidebar from "./sidebar/quickstart";
import commandsSidebar from "./sidebar/commands";
import serverSidebar from "./sidebar/server";
import devSidebar from "./sidebar/dev/dev";

export default defineUserConfig<DefaultThemeOptions>({
  title: "Health Screening Bot",
  description: description,
  themeConfig: {
    editLink: false,
    contributors: false,
    docsDir: "docs",
    docsBranch: "master",
    docsRepo: "https://github.com/PythonCoderAS/HealthScreeningBot",
    lastUpdated: true,
    navbar: [
      {
        text: "Quickstart",
        link: "/quickstart/",
      },
      {
        text: "Bot",
        children: [
          {
            text: "About",
            link: "/about/",
          },
          {
            text: "Rules",
            link: "/bot-rules",
          },
          {
            text: "Commands",
            link: "/commands/",
          },
          {
            text: "Features",
            link: "/features/",
          },
          {
            text: "Developer Documentation",
            link: "/dev/",
          },
          {
            text: "GitHub",
            link: "https://github.com/PythonCoderAS/HealthScreeningBot",
          },
        ],
      },
      {
        text: "Server",
        link: "/server/",
      },
    ],
    sidebar: {
      "/quickstart/": quickstartSidebar,
      "/commands/": commandsSidebar,
      "/server/": serverSidebar,
      "/dev/": devSidebar,
    },
  },
  plugins: ["@vuepress/plugin-search"],
});