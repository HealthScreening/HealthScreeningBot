const {description} = require('../../package')

import type {DefaultThemeOptions} from 'vuepress'
import {defineUserConfig} from 'vuepress'

export default defineUserConfig<DefaultThemeOptions>({
    title: 'Health Screening Bot',
    description: description,
    themeConfig: {
        repo: 'https://github.com/PythonCoderAS/HealthScreeningBot',
        editLinks: false,
        docsDir: 'docs',
        docsBranch: 'master',
        lastUpdated: true,
        navbar: [
            {
                text: 'Quickstart',
                link: '/quickstart/',
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
                text: 'Server',
                link: '/server/'
            },
            {
                text: 'Developer Documentation',
                link: '/dev'
            }
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
