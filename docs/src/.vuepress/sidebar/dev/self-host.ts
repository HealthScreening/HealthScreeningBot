import { SidebarItem } from "@vuepress/theme-default/lib/shared/nav";

const configuration: SidebarItem = {
  text: "Configuration",
  link: "/dev/self-host/configuration",
  children: [],
};

const selfHostSidebar: SidebarItem = {
  text: "Self Host the Bot",
  link: "/dev/self-host",
  children: [
    "/dev/self-host/requirements",
    "/dev/self-host/installation",
    configuration,
  ],
};

export default selfHostSidebar;
