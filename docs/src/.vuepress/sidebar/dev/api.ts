import {SidebarItem} from "@vuepress/theme-default/lib/shared/nav";

export type SidebarChildren = (SidebarItem | string);

function addRelativePathToItems(relativePath: string, items: SidebarChildren[]): SidebarChildren[] {
    return items.map(item => {
        if (typeof item === "string") {
            return {
                text: item,
                link: `${relativePath}/${item}`
            }
        }
        return item
    })
}

const apiItems: string[] = [
    "get-commands",
    "register-commands"
]

const utilsItems: string[] = [
    "multi-message-ts"
]

const moduleItems: (string | SidebarItem)[] = [
    "deploy-ts"
]

const utils: SidebarItem = {
    text: "Utils",
    link: "/dev/api/modules/utils",
    children: addRelativePathToItems("/dev/api/modules/utils", [
        ...utilsItems
    ])
}

const modules: SidebarItem = {
    text: "Module Reference",
    link: "/dev/api/modules",
    children: addRelativePathToItems("/dev/api/modules", [
        ...moduleItems,
        utils
    ])
}

const apiSidebar: SidebarItem = {
    text: "API Reference",
    link: "/dev/api",
    children: addRelativePathToItems("/dev/api", [
        ...apiItems,
        modules
    ])
}

export default apiSidebar;