(function () {
    isMobile = document.body.clientWidth <= 600;
    param = {
        copyCode: {
            buttonText: "复制",
            errorText: "错误",
            successText: "已复制",
        },
    };
    $docsify = Object.assign(param, $docsify);
})();
