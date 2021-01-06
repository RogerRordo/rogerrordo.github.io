(function () {
    function install(hook, vm) {
        hook.doneEach(function () {
            twemoji.parse(document);
        });
    }
    $docsify.plugins = [].concat(install, $docsify.plugins);
})();
