// 404游戏；文章头添加创建时间、更新时间、编辑链接；文章尾添加版权声明
import parser from "./parser.js";
(function () {
    function install(hook, vm) {
        hook.beforeEach(function (content) {
            /// [404]
            // 404游戏
            if (content == "404") {
                $docsify.pageNotFound = true;
                return '<h1 class="animation404" align="center" style="color:var(--color-secondary-1-1)"><b>4 0 4</b></h1> <style> .animation404 { animation: twinkling 2s 1 ease-in-out; } .animated { animation-duration: 2s; animation-fill-mode: both; } @keyframes twinkling { 0% { opacity: 0; } 100% { opacity: 1; } } </style> <h3 class="animation404" align="center" style="color:var(--color-primary-2)">“ 山重水复疑无路&emsp;<br>&emsp;柳暗花明又一村 ”</h3> <div class="animation404" align="center"> <iframe id="catTrap" frameborder="0" name="catTrap" height="440px" scrolling="no" width="699px" align="center" src="cattrap.html"></iframe> </div>';
            }
            $docsify.pageNotFound = false;
            /// [404]

            /// [URI_Analysis]
            // 获取源文件地址
            let url;
            if (/githubusercontent\.com/.test(vm.route.file)) {
                url = vm.route.file
                    .replace("raw.githubusercontent.com", "github.com")
                    .replace(/\/master/, "/blob/master");
            } else {
                url =
                    "https://github.com/RogerRordo/rogerrordo.github.io/blob/master/docs/" +
                    vm.route.file;
            }
            var urlSplit = url.split("/");
            urlSplit = urlSplit[urlSplit.length - 1];
            if (
                urlSplit == "_sidebar.md" ||
                urlSplit == "README.md" ||
                urlSplit == "_TOC.md"
            )
                return content; // 不是文章
            url = decodeURI(url);

            // 获取网页地址
            var url2 = window.location.href;
            if (url2.indexOf("?") != -1) url2 = url2.split("?")[0];
            url2 = decodeURI(url2);
            /// [URI_Analysis]

            /// [Add_Head]
            // Front Matter (https://github.com/docsifyjs/docsify/blob/develop/src/plugins/front-matter/index.js)
            vm.config.frontMatter = {};
            vm.config.frontMatter.installed = true;
            vm.config.frontMatter.parseMarkdown = function (content) {
                const { body } = parser(content);
                return body;
            };
            const { attributes, body } = parser(content);
            vm.frontmatter = attributes;
            content = body;

            // iOS日期适配
            if (typeof vm.frontmatter.date == "string") {
                vm.frontmatter.date = new Date(
                    vm.frontmatter.date.replace(/-/g, "/")
                );
                vm.frontmatter.updated = new Date(
                    vm.frontmatter.updated.replace(/-/g, "/")
                );
            }

            // 添加头部
            let linkToEdit;
            if (vm.frontmatter.date && vm.frontmatter.updated)
                linkToEdit =
                    "<small> ✍️ 创建于 " +
                    vm.frontmatter.date.Format("yyyy/M/d hh:mm") +
                    " &emsp; &emsp; ⏰ 更新于 " +
                    vm.frontmatter.updated.Format("yyyy/M/d hh:mm") +
                    " &emsp; &emsp; 📝 [编辑此页面](" +
                    url +
                    ") </small>\n\n---\n\n";
            else
                linkToEdit =
                    "<small> 📝 [编辑此页面](" + url + ") </small>\n\n---\n\n";

            content = linkToEdit + content;
            /// [Add_Head]

            /// [Add_Tail]
            var copyRight =
                "\n\n---\n\n> ✏️ **文章作者:** [ROrdo](mailto:luozhf3@mail2.sysu.edu.com) \n>\n" +
                "> 📎 **文章链接:** " +
                url2 +
                "\n>\n" +
                "> ©️ **版权声明:** 本博客所有文章除特别声明外，均采用" +
                "[CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/)许可协议。\n";
            content += copyRight;
            /// [Add_Tail]

            return content;
        });
    }
    $docsify.plugins = [].concat(install, $docsify.plugins);
})();
