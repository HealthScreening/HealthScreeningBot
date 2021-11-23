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
                text: 'Guide',
                link: '/guide/',
            },
            {
                text: 'Config',
                link: '/config/'
            },
            {
                text: 'VuePress',
                link: 'https://v1.vuepress.vuejs.org'
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
