---
date: 2021-01-06 19:49:24
updated: 2021-01-07 14:18:58
md5: '0f507bcc58b0f86c98b5f4728cde15db'
---

# Docsify搭建简易博客

本文将详谈搭建该博客的细节。

## 快速搭建

- Docsify的搭建很简单，先装好[Node.js](https://nodejs.org/en/download/)，然后看着[Docsify官网的教程](https://docsify.js.org/#/zh-cn/quickstart)来就好了。

```bash
npm i docsify-cli -g
mkdir docs
docsify init ./docs
docsify serve docs
```

- 下面主要讲讲怎么个性化。坑其实挺多的，我尽量把有坑点的放在前面。以下的`css`代码在`index.html`的`<head>`里载入，`js`代码在`<body>`里载入。以Copycode为例，大致是：

```html
<!DOCTYPE html>
<html lang="en">
    <head>
        ...
        <link rel="stylesheet" href="plugin/copycode.css" />
        ...
    </head>
    <body>
        ...
        <script src="//cdn.jsdelivr.net/npm/docsify-copy-code@latest"></script>
        <script src="plugin/copycode.js"></script>
        ...
    </body>
</html>
```

## 配色

- 先选配色，推荐[paletton](https://paletton.com/)里选。这是我的配色方案。

[color.css](../plugin/color.css ':include :type=code')

## 基础配置和优化

- 主题我用的是docsify-themeable的[simple](https://jhildenbiddle.github.io/docsify-themeable/#/themes?id=simple)。

```html
<link
    rel="stylesheet"
    href="//cdn.jsdelivr.net/npm/docsify-themeable@0/dist/css/theme-simple.css"
/>
```

- 基础配置如下，对应含义都可以在[Docsify文档](https://docsify.js.org/#/zh-cn/configuration)找到。另外加了一个小小的手机适配，就是页面过窄时不显示Navbar，否则可能出现Navbar和Sidebar重叠出现的情况。

[main.js](../plugin/main.js ':include :type=code')

- 配色选好后就可以先应用在一些基本元素上了，比如这样：

[main.css](../plugin/main.css ':include :type=code')

## 搜索

- Search参数如下，对应含义都可以在[Docsify文档](https://docsify.js.org/#/zh-cn/plugins?id=全文搜索-search)找到。

[search.js](../plugin/search.js ':include :type=code')

- 改配色和样式：

[search.css](../plugin/search.css ':include :type=code')

- 除此之外，[原版的search.js](https://unpkg.com/docsify@4/lib/plugins/search.js)有两个问题。第一，在函数`genIndex()`中slug没有decode，若有中文会变得很长，可以加一句：

```js
slug = decodeURI(slug);
```

- 第二，不支持Markdown list内的搜索，而只支持table内的搜索。我们的笔记有很多list，这当然是致命的缺陷。解决的方法是将函数`getTableData()`扩展成可以搜索list的`getData()`。

```js
function getData(token) {
    if (!token.text) {
        if (token.type === "table") {
            token.cells.unshift(token.header);
            token.text = token.cells
                .map(function (rows) {
                    return rows.join(" | ");
                })
                .join(" |\n ");
        } else if (token.type === "list") {
            // 使可以搜索list内容 (by ROrdo)
            token.text = token.raw.replace(/  */g, " ");
        }
    }
    return token.text;
}
```

## Sidebar折叠

- 引入docsify-sidebar-collapse插件，使得Sidebar可以折叠或展开。

```html
<script src="//cdn.jsdelivr.net/npm/docsify-sidebar-collapse/dist/docsify-sidebar-collapse.min.js"></script>
```

- css除了改颜色，还要修复docsify-themeable主题的不兼容，否则Sidebar中小箭头方向会不正确。参见[这里](https://github.com/iPeng6/docsify-sidebar-collapse/issues/6#issuecomment-575546351)。

[sidebar_arrow.css](../plugin/sidebar_arrow.css ':include :type=code')

## 404页面与文章头尾信息

- 由于这部分都是通过`hook.beforeEach()`实现的，因此放在了一起讲。js是长这样的：

```js
(function () {
    function install(hook, vm) {
        hook.beforeEach(function (content) {
            ... // 修改content
            return content;
        });
    }
    $docsify.plugins = [].concat(install, $docsify.plugins);
})();

```

- `hook.beforeEach()`的参数是一个函数，变量`content`是读入的md内容，而返回值将替换这个内容。因此，可以用来实现文章模板化的一些处理。**本节后面的js脚本都包含于上述代码的`...`中。**

### 404页面

- 如果仅用Docsify官方的参数，把`window.$docsify.notFoundPage`置为`true`，将会导致404页面实际上是重定向到一篇文章。从而，Gitalk等也会被加载，而且后面的头尾信息也会被加上。我们只希望404页面是一个独立的静态页面，这里是主要是嵌入一个html小游戏。因此，我的思路是：
    1. 将`_404.md`置成简单常值，比如`404`；
    2. 设置一个布尔参数`$docsify.pageNotFound`表示是否为404页面；
    3. 通过在`hook.beforeEach()`中判断`content`是否为`404`来给`$docsify.pageNotFound`赋相应的值，并在其为真时返回静态的404 html；
    4. 在Gitalk渲染时，若`$docsify.pageNotFound`为真则不渲染。（见[Gitalk评论](#Gitalk评论)）

[article.js](../plugin/article.js ':include :type=code :fragment=404')

### URI地址解析

- 地址解析主要实现三个功能：
    1. **判断是不是文章**
        - 原因：我们只希望将头尾信息加在文章上。对于`README.md`、目录`_TOC.md`（见[目录的生成（python）](#目录的生成（python）)）等，我们不认为是文章。因此，要先通过解析URI确定是否为文章，再进行后续活动。
    2. **生成Github编辑链接供[头部插入](#头部添加文章时间和编辑链接)**
    3. **生成文章地址供[尾部插入](#尾部添加版权声明)**
- 上述三者的实现都可以通过对URI做简单判断和替换完成。

[article.js](../plugin/article.js ':include :type=code :fragment=URI_Analysis')

### 头部添加文章时间和编辑链接

- 虽然提供了一个[formatUpdated](https://docsify.js.org/#/zh-cn/configuration?id=formatupdated)的参数来显示更新时间，但是这个时间是整个网站的更新时间，而不能是单篇文章的。因此，若要每篇文章都有创建和修改时间显示，我们需要另辟蹊径。
- 我的想法是，像Hexo那样（虽然我没用过）通过YAML格式的[frontMatter](https://hexo.io/zh-cn/docs/front-matter.html)，在文章开头写入`date`和`updated`两个时间参数，并通过一个[python脚本](#文章时间信息的生成（python）)维护。然后，直接利用现成的[Docsify官方的frontMatter模块](https://github.com/docsifyjs/docsify/tree/develop/src/plugins/front-matter)解析，并用`hook.beforeEach()`将时间显示加入在文章开头。
- 为了将[Docsify官方的frontMatter模块](https://github.com/docsifyjs/docsify/tree/develop/src/plugins/front-matter)引入，你需要：
    1. 先将frontMatter模块的`parser.js`和`yaml.js`引入，修改`parser.js`中的`import parser from './yaml'`为`import parser from './yaml.js'`
    2. 在本节插件js（本节开头代码）的头部加入一句```import parser from "./parser.js";```
    3. 在`index.html`中引入该插件js时添加参数`type="module"`，类似这样：
        ```js
        <script type="module" src="plugin/article.js"></script>
        ```
- 还有一点很坑的点，那就是Safari中由`parser`得到的时间是String而不是Date。而且该String包含“-”，在Safari中无法直接转为Date，需要将“-”替换为“/”再转换。

[article.js](../plugin/article.js ':include :type=code :fragment=Add_Head')

- 其中，原生js没有用于Date转为字符串的`Date.prototype.Format()`函数，需要自己写：

[date_format.js](../plugin/date_format.js ':include :type=code')

### 尾部添加版权声明

## Gitalk评论

- [Gitalk](https://github.com/gitalk/gitalk)是一个基于Github Issue的评论系统。也就是说，评论都会转到一个Github repo的issue里储存。安装方法可以大致参考[官方文档](https://docsify.js.org/#/zh-cn/plugins?id=gitalk)。但不要引入Docsify官方的Gitalk插件（`//cdn.jsdelivr.net/npm/docsify/lib/plugins/gitalk.min.js`），原因后面会说。先引入gitalk原生插件。

```html
<link
    rel="stylesheet"
    href="//cdn.jsdelivr.net/npm/gitalk@1/dist/gitalk.css"
/>
```

```html
<script src="//cdn.jsdelivr.net/npm/gitalk/dist/gitalk.min.js"></script>
```

- 然后改配色。

[gitalk.css](../plugin/gitalk.css ':include :type=code')

- 坑点主要有两个：
    1. ID的长度不能超过50，对于中文标题decode后很容易就超出。
        - 解决：用MD5加密路径来制造ID；
    2. Docsify是路由管理，路由跳转无法重新实例化Gitalk。也就是说，所有跳转页面的评论，都会等同于在第一个直接访问的页面的评论。
        - 解决：修改[Docsify官方的Gitalk插件](https://cdn.jsdelivr.net/npm/docsify/lib/plugins/gitalk.js)，通过`hook.doneEach()`实例化。参见[这里](https://www.nodejs.red/#/tools/docsify?id=增加评论功能)。
- 因此先引入MD5。

```html
<script src="//cdn.jsdelivr.net/npm/js-md5@latest/src/md5.min.js"></script>
```

- 修改的js如下：

[gitalk.js](../plugin/gitalk.js ':include :type=code')

## Prism代码高亮

- [Prism](https://github.com/PrismJS/prism)是Docsify内置的代码高亮插件。但是，默认只内置了Markup、CSS、C-like、JavaScript四类语言，要支持更多语言需要载入额外的js，可以在[这里](https://cdn.jsdelivr.net/npm/prismjs@1/components/)找到。要注意，一些语言对应js有依赖关系，比如C++依赖于C。以安装C++高亮为例：

```html
<script src="//cdn.jsdelivr.net/npm/prismjs@latest/components/prism-c.min.js"></script>
<script src="//cdn.jsdelivr.net/npm/prismjs@latest/components/prism-cpp.min.js"></script>
```

## Prism显示代码行号

- [Prism Line Numbers](http://jasonrivers.github.io/prism/plugins/line-numbers/)是一个Prism插件，可以显示行号。先引入官方插件。

```html
<link
    rel="stylesheet"
    href="//prismjs.com/plugins/line-numbers/prism-line-numbers.css"
/>
```

```html
<script src="//prismjs.com/plugins/line-numbers/prism-line-numbers.js"></script>
```

- 然后要适配到Docsify，主要问题是如何在html中对多行的code对应的`<pre>`标签加入属性`line-numbers`，另外还有overflow的小毛病，参见[这里](https://github.com/docsifyjs/docsify/issues/771#issuecomment-655982606)。如果用以上讨论中的方法，会导致末尾的Quote Block有可能（有部分页面是）被渲染成code，原因未知。因此，改成了用`hook.doneEach()`更暴力地对每个`<pre>`加属性。

[prism_line_numbers.js](../plugin/prism_line_numbers.js ':include :type=code')

## CopyCode代码复制按钮

- 安装[CopyCode](https://github.com/jperasmus/docsify-copy-code)后，会使得代码块右上角增加一个复制按钮。先引入插件。

```html
<script src="//cdn.jsdelivr.net/npm/docsify-copy-code@latest"></script>
```

- 改成中文。

[copycode.js](../plugin/copycode.js ':include :type=code')

- 修改配色。

[copycode.css](../plugin/copycode.css ':include :type=code')

## Pagination翻页

- 引入Pagination，会在文章底部生成左右翻页按钮。

```html
<script src="//cdn.jsdelivr.net/npm/docsify-pagination/dist/docsify-pagination.min.js"></script>
```

- 改成中文。

[pagination.js](../plugin/pagination.js ':include :type=code')

- 改颜色。

[pagination.css](../plugin/pagination.css ':include :type=code')

## Katex适配Latex

- 引入[Katex](https://github.com/upupming/docsify-katex)以适配Latex公式显示。用官方的就好。

```html
<link rel="stylesheet" href="//cdn.jsdelivr.net/npm/katex@latest/dist/katex.min.css"/>
```

```html
<script src="//cdn.jsdelivr.net/npm/docsify-katex@latest/dist/docsify-katex.js"></script>
```

## Twemoji

- [Twemoji](https://github.com/TaQini/docsify-twemoji)是Twitter版emoji，可以扩展原有的emoji，效果也不错。装上之后可以直接在md里打emoji表情😃☺️
- emoji表情可以到[Emojipedia](https://emojipedia.org/)里找。

```html
<script src="//cdn.jsdelivr.net/gh/TaQini/docsify-twemoji@master/twemoji.min.js"></script>
```

[twemoji.js](../plugin/twemoji.js ':include :type=code')

## 不算子网页计数器

- [不算子](http://busuanzi.ibruce.info/)是统计访问量的一个插件。有点小bug不知道怎么解决，那就是路由跳转无法正确显示数值，只有直接访问地址才可以显示。所以，还是放在首页或者封面这种不怎么会跳转回来的地方吧。免费的，不错了。

```html
<script async src="//busuanzi.ibruce.info/busuanzi/2.3/busuanzi.pure.mini.js"></script>
```

`<span id="busuanzi_value_site_pv"></span>`和`<span id="busuanzi_value_site_uv"></span>`分别是访问量和访客数的数值，md里直接用就好。

## Google收录

- [Google Search Console](https://search.google.com/search-console)是免费服务，可以用来查看访问量和访问来源等。还可以帮助查找错误，提交站点地图。验证你的网站，然后按指示将跟踪代码放在`<head>`里验证即可。类似这样：

```html
<meta
    name="google-site-verification"
    content="xxxxxxxxxxxxxxxxxxx"
/>
```

## 目录的生成（Python）

- 引入[Sidebar折叠](#Sidebar折叠)后虽然Sidebar不那么乱了，但是有时还是会希望在一个页面中列出markdown目录。因此，我决定写一个python脚本来根据`_sidebar.md`生成整个博客系统中的目录，待维护的目录文件需要命名为`_TOC.md`。
- 脚本的具体实现比较简单，就是爬取`_sidebar.md`的中所有的`_TOC.md`路径，以及该list项下面包含的所有markdown文件路径。然后，遍历这些markdown文件生成各自的目录，拼装起来放入每个`_TOC.md`中。这里，目录的生成参考了[Github上的某代码](https://github.com/amaiorano/md-to-toc/blob/master/md-to-toc.py)。

[generateTOC.py](/code/generateTOC.py ':include :type=code')

## 文章时间信息的生成（Python）

- 正如在[头部添加文章时间和编辑链接](#头部添加文章时间和编辑链接)小节中所言，我们需要在文章开头维护YAML格式的frontMatter，且它需要包含文章创建时间`date`和`updated`。我的想法是写一个python脚本来进行更新。
- 该脚本需要做以下事情：
    1. 读取`_sidebar.md`，找出所有文章路径。
    2. 通过`os`模块的`os.path.getctime()`和`os.path.getmtime()`读取每个文章md文件的创建时间和修改时间。
    3. 根据在文章开头生成对应的frontMatter。
- 但是，按以上逻辑，很快就会发现一个问题。那就是每次运行该python脚本都会修改md文件，这样其修改时间就毫无意义了。因此，我在frontMatter中加入了一个字符串值`md5`，它记录修改时间对应的文章MD5值。脚本运行时通过对比MD5即可知道文章内容是否被修改，若没有修改就不需要进行文件覆写。
- 最终，frontMatter大概长这样：
    ```markdown
    ---
    date: 2021-01-06 19:49:24
    updated: 2021-01-06 23:58:37
    md5: 'cc632d7d038d5ce3032955f50a140f2d'
    ---
    ```
- 以下是python脚本代码：

[updateTime.py](/code/updateTime.py ':include :type=code')
