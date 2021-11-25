const {description} = require('../../package')

import type {DefaultThemeOptions} from 'vuepress'
import {defineUserConfig} from 'vuepress'

export default defineUserConfig<DefaultThemeOptions>({
    title: 'Health Screening Bot',
    description: description,
    themeConfig: {
        editLinks: false,
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
                "text": "Bot",
                children: [
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
            '/guide/': [
                {
                    text: 'Guide',
                    children: [
                        '',
                        'using-vue',
                    ]
                }
            ],
        }
    },
    plugins: [
        '@vuepress/plugin-search',
    ]
})
