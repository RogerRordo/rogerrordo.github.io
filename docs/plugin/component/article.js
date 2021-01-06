// 404游戏；文章头尾添加更新时间、编辑链接和版权声明
(function () {
    function install(hook, vm) {
        hook.beforeEach(function (content) {
            //404
            if (content == "404") {
                $docsify.pageNotFound = true;
                return '<h1 class="animation404" align="center" style="color:var(--color-secondary-1-1)"><b>4 0 4</b></h1> <style> .animation404 { animation: twinkling 2s 1 ease-in-out; } .animated { animation-duration: 2s; animation-fill-mode: both; } @keyframes twinkling { 0% { opacity: 0; } 100% { opacity: 1; } } </style> <h3 class="animation404" align="center" style="color:var(--color-primary-2)">“ 山重水复疑无路&emsp;<br>&emsp;柳暗花明又一村 ”</h3> <div class="animation404" align="center"> <iframe id="catTrap" frameborder="0" name="catTrap" height="440px" scrolling="no" width="699px" align="center" src="cattrap.html"></iframe> </div>';
            }
            $docsify.pageNotFound = false;
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

            // 添加头部
            var linkToEdit =
                "<small> ⏰ 最后更新于 **{docsify-updated}** &emsp; &emsp; 📝 [编辑此页面](" +
                url +
                ") </small>\n\n---\n\n";
            content = linkToEdit + content;

            // 添加尾部
            var copyRight =
                "\n\n---\n\n> ✏️ **文章作者:** [ROrdo](mailto:luozhf3@mail2.sysu.edu.com) \n>\n" +
                "> 📎 **文章链接:** " +
                url2 +
                "\n>\n" +
                "> ©️ **版权声明:** 本博客所有文章除特别声明外，均采用" +
                "[CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/)许可协议。\n";
            content += copyRight;

            return content;
        });
    }
    $docsify.plugins = [].concat(install, $docsify.plugins);
})();
