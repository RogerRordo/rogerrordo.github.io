(function () {
    param = {
        search: {
            maxAge: 86400000, // 过期时间，单位毫秒，默认一天
            paths: "auto",
            placeholder: "搜索",
            noData: "找不到结果",

            // 搜索标题的最大层级, 1 - 6
            depth: 3,
            hideOtherSidebarContent: false, // 是否隐藏其他侧边栏内容
        },
    };
    $docsify = Object.assign(param, $docsify);
})();
