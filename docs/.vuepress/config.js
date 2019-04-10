module.exports = {
    title: 'sdu mirrors',
    description: 'Just playing around',
    head: [
        ['link', { rel: 'icon', href: '/logo.ico' }]
    ],
    themeConfig: {
        search: false,
        nav: [
            { text: '主页', link: '/' },
            { text: '帮助', link: '/guide/' },
            { text: '博客', link: '/blog/' }
        ],
        sidebar: {
            sidebarDepth: 1,
            '/guide/': [
                // '',
                'Ubuntu.md',
                'Windows-iso.md'
            ],
            '/blog/': [
                // ''
            ]
        },
        activeHeaderLinks: false,
    },
    markdown: {
        lineNumbers: true
    }
}