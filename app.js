"use strict"
let app = require('koa')()
let path = require('path')
let static_cache = require('koa-static-cache')
let config = require('./config')

// 处理post参数(this.request.body)
app.use(body({formidable:{uploadDir: __dirname}}));
// 默认路径
app.use(function *(next){
  if(this.path=="/")
    this.path = config.index
  yield next;
});
// 缓存
app.use(static_cache(path.join(__dirname, config.root_dir), {
  maxAge: config.max_storage_age
}))
// 启动
app.listen(config.default_port)
