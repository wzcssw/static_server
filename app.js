"use strict"
let app = require('koa')()
let path = require('path')
let static_cache = require('koa-static-cache')
let config = require('./config')

// web-hooks
app.use(function *(next){
  if(this.request.method=="POST"){
    console.log(this.path);
    console.log("==========================**");
    console.log(this.request);
    this.body = "哦了"
    return;
  }
});
// 默认路径
app.use(function *(next){
  console.log(this.request.method=="POST");
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
