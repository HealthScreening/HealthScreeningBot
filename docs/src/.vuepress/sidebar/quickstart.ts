import { SidebarConfigArray } from "@vuepress/theme-default/lib/shared/nav";

const quickstartSidebar: SidebarConfigArray = [
  {
    text: "Quickstart",
    link: "/quickstart/",
    children: [
      "join-server",
      "invite-bot",
      "running-commands",
      "auto-screening",
      "configure-bot",
    ],
  },
];

export default quickstartSidebar;
