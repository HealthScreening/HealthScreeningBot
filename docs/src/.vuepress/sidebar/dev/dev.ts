import {SidebarConfigArray} from "@vuepress/theme-default/lib/shared/nav";
import selfHostSidebar from "./self-host";

const devSidebar: SidebarConfigArray = [
    {
        text: "Development",
        link: "/dev/",
        children: [
            selfHostSidebar,
            "/dev/contribute",
        ]
    }
]

export default devSidebar;