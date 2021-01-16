(function () {
    function install(hook, vm) {
        gitalkConfig = {
            clientID: "9dd9311566530f40b3f1",
            clientSecret: "6ef3586c67c69781d82a1e4fd740623af72488f8",
            repo: "rogerrordo.github.io",
            owner: "RogerRordo",
            admin: ["RogerRordo"],
            distractionFreeMode: false,
            enableHotKey: true, // 提交评论快捷键 (cmd/ctrl + enter)
        };

        hook.doneEach(function () {
            // remove gitalk-container
            Array.apply(
                null,
                document.querySelectorAll("div.gitalk-container")
            ).forEach(function (ele) {
                ele.remove();
            });

            if ($docsify.pageNotFound) return; // 404 return

            var label, domObj, main, divEle, gitalk;
            // label = vm.route.path.split("/").pop();
            label = md5(location.hash.split("?")[0]);
            domObj = Docsify.dom;
            main = domObj.getNode("#main");

            divEle = domObj.create("div");
            divEle.id = "gitalk-container-" + label;
            divEle.className = "gitalk-container";
            divEle.style =
                "width: " + main.clientWidth + "px; margin: 0 auto 20px;";
            domObj.appendTo(domObj.find(".content"), divEle);
            var title = window.location.hash.match(/#(.*?)([?]|$)/)
                ? window.location.hash.match(/#(.*?)([?]|$)/)[1]
                : "/";
            gitalk = new Gitalk(
                Object.assign(gitalkConfig, {
                    id: label,
                    title: decodeURI(title),
                })
            );
            gitalk.render("gitalk-container-" + label);
        });
    }
    $docsify.plugins = [].concat(install, $docsify.plugins);
})();
