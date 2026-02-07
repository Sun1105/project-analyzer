const fs = require('fs');
const path = require('path');

const targetFile = path.join(__dirname, 'node_modules', 'hexo-admin', 'www', 'index.html');

try {
  if (fs.existsSync(targetFile)) {
    let content = fs.readFileSync(targetFile, 'utf8');
    
    if (!content.includes('// Simple translation hack')) {
      const inject = `<script>
        // Simple translation hack
        const dict = {
          'Posts': '文章列表',
          'New Post': '新建文章',
          'Settings': '设置',
          'Deploy': '部署',
          'Publish': '发布',
          'Unpublish': '取消发布',
          'Save': '保存',
          'Saving...': '保存中...',
          'Saved': '已保存',
          'Rename': '重命名',
          'Delete': '删除',
          'Author': '作者',
          'Date': '日期',
          'Tags': '标签',
          'Categories': '分类',
          'Title': '标题',
          'Slug': '链接名',
          'Layout': '布局',
          'Content': '内容',
          'Logout': '退出登录',
          'About': '关于',
          'Dashboard': '仪表盘',
          'Are you sure you want to remove this post?': '确定要删除这篇文章吗？',
          'paste me': '粘贴图片到这里'
        };

        function translate() {
          // Translate text nodes
          const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);
          let node;
          while(node = walker.nextNode()) {
            const val = node.nodeValue.trim();
            if (dict[val]) {
              node.nodeValue = dict[val];
            }
          }
          
          // Translate placeholders
          document.querySelectorAll('input[placeholder], textarea[placeholder]').forEach(el => {
            if (dict[el.placeholder]) {
              el.placeholder = dict[el.placeholder];
            }
          });
          
          // Translate specific elements by selector if needed
          document.querySelectorAll('.mobile-header .site-name').forEach(el => {
             if(el.innerText === 'Hexo Admin') el.innerText = '后台管理';
          });
        }

        // Run periodically to handle React updates
        setInterval(translate, 500);
      </script>`;
      
      content = content.replace('</body>', inject + '</body>');
      fs.writeFileSync(targetFile, content);
      console.log('Successfully injected Chinese translation script into hexo-admin.');
    } else {
      console.log('Translation script already injected.');
    }
  } else {
    console.error('Target file not found:', targetFile);
  }
} catch (e) {
  console.error('Error injecting script:', e);
}
