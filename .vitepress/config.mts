import { withSidebar } from 'vitepress-sidebar'

// https://vitepress.dev/reference/site-config
export default withSidebar({
  title: "Savepoint",
  description: "A Personal Notes",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Wiki', link: '/wiki' }
    ],
    // sidebarは自動生成するため省略
    socialLinks: [
      { icon: 'github', link: 'https://github.com/hondazn/savepoint' }
    ]
  }
})
