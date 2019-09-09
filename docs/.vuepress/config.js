module.exports = {
    base: '/',
    title: '山东大学镜像站',
    // description: 'Just playing around',
    head: [
        ['link', { rel: 'icon', href: '/favicon.ico' }],
        ['meta', { 'http-equiv': "X-UA-Compatible", content: "IE=edge" }],
        ['meta', { name: 'renderer', content: 'webkit' }]
    ],
    themeConfig: {

        search: false,
        nav: [
            { text: '主页', link: '/' },
            { text: '帮助', link: '/guide/' },
            { text: '博客', link: '/blog/' }
        ],
        sidebarDepth: 0,
        sidebar: {

            '/guide/': [
                // '',
                "TurnOffRebindProtection.md",
                'ArchLinux.md',
                'Ubuntu.md',
                'Debian.md',
                'Windows-iso.md'

            ],
            '/blog/': [
                // '',
                '2019-4-21.md',
                'BackendConfigJournal.md'
            ]
        },
        // activeHeaderLinks: false,
        // 假定是 GitHub. 同时也可以是一个完整的 GitLab URL
        repo: 'https://github.com/oops-sdu/SDU-Mirrors-Frontend',
        // 自定义仓库链接文字。默认从 `themeConfig.repo` 中自动推断为
        // "GitHub"/"GitLab"/"Bitbucket" 其中之一，或是 "Source"。
        repoLabel: 'GitHub',

        // 以下为可选的编辑链接选项

        // 假如你的文档仓库和项目本身不在一个仓库：
        // docsRepo: 'vuejs/vuepress',
        // 假如文档不是放在仓库的根目录下：
        docsDir: 'docs',
        // 假如文档放在一个特定的分支下：
        docsBranch: 'master',
        // 默认是 false, 设置为 true 来启用
        editLinks: true,
        // 默认为 "Edit this page"
        // editLinkText: '帮助我们改善此页面！'
    },
    markdown: {
        // lineNumbers: true
    }
}