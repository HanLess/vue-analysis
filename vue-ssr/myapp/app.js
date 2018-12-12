const express = require('express')()
const exp = require('express')
const renderer = require('vue-server-renderer').createRenderer()
const createApp = require('./dist/bundle.server.js')['default']


// 设置静态文件目录
express.use('/', exp.static(__dirname + '/dist'))


const clientBundleFileUrl = '/bundle.client.js'


// 响应路由请求
express.get('*', (req, res) => {
    const context = { url: req.url }

    console.log(context)
    // 创建vue实例，传入请求路由信息
    createApp(context).then(app => {
        let state = JSON.stringify(context.state)
        renderer.renderToString(app, (err, html) => {
            console.log(html)
            if (err) { return res.state(500).end('运行时错误') }
            res.send(`
                <!DOCTYPE html>
                <html lang="en">
                    <head>
                        <meta charset="UTF-8">
                        <title>Vue2.0 SSR渲染页面</title>
                        <script>window.__INITIAL_STATE__ = ${state}</script>
                        <script src="${clientBundleFileUrl}"></script>
                    </head>
                    <body>
                        <div id="app">${html}</div>
                    </body>
                </html>
            `)
        })
    }, err => {
        if(err.code === 404) { res.status(404).end('所请求的页面不存在') }
    })
})

express.listen(3000,function(){
  console.log("-------------------- server start ------------------------")
})
