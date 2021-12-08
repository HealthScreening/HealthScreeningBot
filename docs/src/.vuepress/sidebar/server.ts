import {
    SidebarConfigArray,
    SidebarItem,
} from "@vuepress/theme-default/lib/shared/nav";

const serverSections: SidebarItem = {
    text: "Server Categories",
    children: ["suggestions", "fun-bots", "starboard", "school-specific"],
};

const serverSidebar: SidebarConfigArray = [
    {
        text: "Server",
        link: "/server/",
        children: ["rules", "roles", serverSections],
    },
];

export default serverSidebar;
