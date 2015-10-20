// 开启模块化开发
fis.hook('module', {
  mode: 'commonJS'
});

fis
  .match('static/**', {
    optimizer: fis.plugin('uglify-js')
  })
  .match('js/**', {
    isMod: true,
    parser: fis.plugin('es6-babel'),
    rExt: "js"
  })
  .match('css/app.less', {
    parser: fis.plugin('less'), //启用fis-parser-less插件
    rExt: '.css',
    postprocessor: fis.plugin('autoprefixer', {
      browsers: [
        "last 4 versions"
      ]
    })
  })
  .match('::package', {
    // npm install [-g] fis3-postpackager-loader
    // 分析 __RESOURCE_MAP__ 结构，来解决资源加载问题
    postpackager: fis.plugin('loader', {
      resourceType: 'commonJs',
      useInlineMap: true // 资源映射表内嵌
    })
  })

fis
  .media("prod")
  .match('js/**', {
    optimizer: fis.plugin('uglify-js'),
    packTo: "./dist/game.js"
  })