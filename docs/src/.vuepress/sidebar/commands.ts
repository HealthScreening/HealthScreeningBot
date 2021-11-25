import {SidebarConfigArray, SidebarItem} from "@vuepress/theme-default/lib/shared/nav";

const autoCommands: SidebarItem = {
    text: "Auto Commands",
    children: [
        "delete-auto",
        "generate-auto",
        "set-auto"
    ]
}

const otherCommands: SidebarItem = {
    text: "Other Commands",
    children: [
        "generate-once",
        "set-device",
        "stats"
    ]
}

const ownerCommands: SidebarItem = {
    text: "Owner Only Commands",
    children: [
        "send-to-all",
        "stop",
        "trigger-auto"
    ]
}

const commandsSidebar: SidebarConfigArray = [
    {
        text: "Commands",
        link: "/commands/",
        children: [
            autoCommands,
            otherCommands,
            ownerCommands
        ]
    }
]

export default commandsSidebar;