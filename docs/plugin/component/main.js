(function () {
    isMobile = document.body.clientWidth <= 600;
    param = {
        name: "",
        repo: "RogerRordo/rogerrordo.github.io",
        loadSidebar: true,
        loadNavbar: !isMobile, // 适配手机
        subMaxLevel: 3,
        alias: {
            "/.*/_sidebar.md": "/_sidebar.md",
            "/.*/_navbar.md": "/_navbar.md",
        },
        auto2top: true,
        relativePath: false,
        formatUpdated: "{MM}/{DD}/{YYYY} {HH}:{mm}",
    };
    $docsify = Object.assign(param, $docsify);
})();
