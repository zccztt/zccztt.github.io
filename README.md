# ZTT's Blog - 张兔兔的小博客

![Blog Preview](img/readme-home.png)

> Life has no rehearsals, every day is a live broadcast.


# wiki

[wiki](https://github.com/zccztt/zccztt.github.io/wiki)

## 📖 项目简介

这是一个基于 Jekyll 构建的个人技术博客，采用现代化的设计理念，注重用户体验、无障碍访问和性能优化。博客支持响应式设计，在各种设备上都能提供优秀的浏览体验。


## 📁 项目结构

```
zccztt.github.io-main/
├── _config.yml                 # Jekyll配置文件
├── _includes/                  # 包含文件
│   ├── head.html              # 头部模板
│   ├── nav.html               # 导航栏模板
│   └── footer.html            # 页脚模板
├── _layouts/                   # 布局模板
│   ├── default.html           # 默认布局
│   ├── post.html              # 文章布局
│   └── page.html              # 页面布局
├── _posts/                     # 博客文章
├── css/                        # 样式文件
│   ├── bootstrap.min.css      # Bootstrap样式
│   ├── hux-blog.min.css       # 主题样式
│   ├── custom-beauty.css      # 自定义美化样式
│   ├── accessibility.css      # 无障碍优化样式
│   └── syntax.css             # 代码高亮样式
├── js/                         # JavaScript文件
│   ├── custom-effects.js      # 交互效果
│   └── performance-optimization.js # 性能优化
├── img/                        # 图片资源
├── sw.js                       # Service Worker
├── offline.html                # 离线页面
├── index.html                  # 首页
├── about.html                  # 关于页面
├── tags.html                   # 标签页面
└── README.md                   # 项目说明
```

## 🚀 快速开始

### 环境要求
- Ruby 2.4.0 或更高版本
- Jekyll 3.0 或更高版本
- Git

### 安装步骤

1. **克隆项目**
   ```bash
   git clone https://github.com/zccztt/zccztt.github.io.git
   cd zccztt.github.io
   ```

2. **安装依赖**
   ```bash
   bundle install
   ```

3. **本地运行**
   ```bash
   bundle exec jekyll serve
   ```

4. **访问博客**
   打开浏览器访问 `http://localhost:4000`

### 部署到GitHub Pages

1. **推送代码**
   ```bash
   git add .
   git commit -m "Update blog"
   git push origin main
   ```

2. **自动部署**
   GitHub Pages 会自动构建和部署你的博客

## 📝 写作指南

### 创建新文章

1. 在 `_posts/` 目录下创建新的 Markdown 文件
2. 文件名格式：`YYYY-MM-DD-title.md`
3. 添加 Front Matter：

```yaml
---
layout: post
title: "文章标题"
subtitle: "文章副标题"
date: 2024-01-01
author: "ZTT"
header-img: "img/post-bg.jpg"
catalog: true
tags:
  - 技术
  - 编程
---
```

### 文章格式

- 使用 Markdown 语法
- 支持代码高亮
- 支持数学公式
- 支持图片和视频

### 标签管理

- 在文章 Front Matter 中添加 `tags`
- 标签会自动生成标签页面
- 支持标签云显示

## 🎯 功能特性

### 文章功能
- ✅ 文章列表和分页
- ✅ 文章分类和标签
- ✅ 文章搜索
- ✅ 相关文章推荐
- ✅ 文章目录导航

### 交互功能
- ✅ 评论系统 (Utterances)
- ✅ 访问统计
- ✅ 社交分享
- ✅ 回到顶部
- ✅ 夜间模式

### 性能功能
- ✅ 图片懒加载
- ✅ 资源压缩
- ✅ 缓存优化
- ✅ 离线支持
- ✅ 性能监控

### 浏览器支持
- ✅ Chrome 60+
- ✅ Firefox 55+
- ✅ Safari 12+
- ✅ Edge 79+

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request！

### 贡献流程

1. Fork 本项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

### 代码规范

- 遵循现有的代码风格
- 添加必要的注释
- 确保代码通过测试
- 更新相关文档

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🙏 致谢

- **Hux Blog**: 基于 Hux Blog 主题开发
- **Bootstrap**: 响应式框架
- **Jekyll**: 静态站点生成器
- **GitHub Pages**: 免费托管服务

</div>

---

## 📞 联系方式

- **邮箱**: yczh.0601@gmail.com
- **GitHub**: [@zccztt](https://github.com/zccztt)
- **知乎**: [@zccztt](https://www.zhihu.com/people/zccztt)
- **CSDN**: [zccztt.blog.csdn.net](https://zccztt.blog.csdn.net)

## 📈 更新日志

### v1.0.0 (2024-08-17)
- ✨ 初始版本发布
- 🎨 现代化设计实现
- ♿ 无障碍优化
- ⚡ 性能优化
- 📱 移动端适配

---

⭐ 如果这个项目对你有帮助，请给它一个星标！

*Made with ❤️ by ZTT*

