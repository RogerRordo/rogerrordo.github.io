(function () {
    function install(hook, vm) {
        hook.doneEach(function (html) {
            let list = document.querySelectorAll("pre");
            for (let i = 0; i < list.length; ++i) {
                list[i].classList.add("line-numbers");
            }
            Prism.highlightAll();
        });
    }
    $docsify.plugins = [].concat(install, $docsify.plugins);
})();
