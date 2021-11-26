import {SidebarItem} from "@vuepress/theme-default/lib/shared/nav";
import {readdirSync} from 'fs';
import {join} from "path";

export type SidebarChildren = (SidebarItem | string);

function getItemURL(item: SidebarChildren): string {
    if (typeof item === 'string') {
        return item;
    }
    return item.link;
}

function customSortSidebarChildren(items: SidebarChildren[], stringFirst: boolean = true): SidebarChildren[] {
    const stringItems = items.filter(item => typeof item === 'string').sort();
    const otherItems = items.filter(item => typeof item !== 'string').sort((a, b) => getItemURL(a).localeCompare(getItemURL(b)));
    if (stringFirst) {
        return stringItems.concat(otherItems);
    } else {
        return otherItems.concat(stringItems);
    }
}

function addRelativePathToItems(relativePath: string, items: SidebarChildren[]): SidebarChildren[] {
    return items.map(item => {
        if (typeof item === "string") {
            return `${relativePath}/${item}`
        }
        return item
    })
}

const apiItems: SidebarChildren[] = customSortSidebarChildren(
    readdirSync(join(__dirname, '../../../dev/api'))
        .filter(item => item.endsWith(".md") && item !== "index.md")
        .map(item => item.replace('.md', '')));

const utilsItems: SidebarChildren[] = [
    "multi-message-ts"
]

const moduleItems: SidebarChildren[] = customSortSidebarChildren([
    "deploy-ts"
], false)

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