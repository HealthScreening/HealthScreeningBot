const {description} = require('../../package')

import type {DefaultThemeOptions} from 'vuepress'
import {defineUserConfig} from 'vuepress'

export default defineUserConfig<DefaultThemeOptions>({
    title: 'Health Screening Bot',
    description: description,
    themeConfig: {
        editLink: false,
        contributors: false,
        docsDir: 'docs',
        docsBranch: 'master',
        docsRepo: 'https://github.com/PythonCoderAS/HealthScreeningBot',
        lastUpdated: true,
        navbar: [
            {
                text: 'Quickstart',
                link: '/quickstart/',
            },
            {
                text: "Bot",
                children: [
                    {
                        text: "About",
                        link: "/about/",
                    },
                    {
                        text: "Commands",
                        link: "/commands/"
                    },
                    {
                        text: "Features",
                        link: "/features/"
                    },
                    {
                        text: 'Developer Documentation',
                        link: '/dev'
                    },
                    {
                        text: 'GitHub',
                        link: 'https://github.com/PythonCoderAS/HealthScreeningBot'
                    }
                ]
            },
            {
                text: 'Server',
                link: '/server/'
            },
        ],
        sidebar: {
            '/quickstart/': [
                {
                    text: 'Quickstart',
                    link: "/quickstart/",
                    children: [
                        'join-server',
                        'invite-bot',
                        'running-commands',
                        'auto-screening',
                        'configure-bot',
                    ]
                }
            ],
            '/commands': [
                {
                    text: "Commands",
                    link: "/commands/",
                    children: [
                        {
                            text: "Auto Commands",
                            children: [
                                "delete-auto",
                                "generate-auto",
                                "set-auto"
                            ]
                        },
                        {
                            text: "Other Commands",
                            children: [
                                "generate-once",
                                "set-device",
                                 "stats"
                            ]
                        },
                        {
                            text: "Owner Only Commands",
                            children: [
                                "send-to-all",
                                "stop",
                                "trigger-auto"
                            ]
                        }
                    ]
                }
            ]
        }
    },
    plugins: [
        '@vuepress/plugin-search',
    ]
})
