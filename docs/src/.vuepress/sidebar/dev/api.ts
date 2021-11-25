import {SidebarItem} from "@vuepress/theme-default/lib/shared/nav";

const apiItems: string[] = [
    "get-commands",
    "register-commands"
]

const moduleItems: string[] = [
    "deploy-ts"
]

const modules: SidebarItem = {
    text: "Module Reference",
    link: "/dev/api/modules",
    children: moduleItems.map(item => "/dev/api/modules/" + item)
}

const apiSidebar: SidebarItem = {
    text: "API Reference",
    link: "/dev/api",
    children: [
        ...apiItems.map(item => "/dev/api/" + item),
        modules
    ]
}

export default apiSidebar;