import {SidebarConfigArray} from "@vuepress/theme-default/lib/shared/nav";
import selfHostSidebar from "./self-host";
import apiSidebar from "./api";

const devSidebar: SidebarConfigArray = [
    {
        text: "Development",
        link: "/dev/",
        children: [
            selfHostSidebar,
            "/dev/contribute",
            apiSidebar
        ]
    }
]

export default devSidebar;