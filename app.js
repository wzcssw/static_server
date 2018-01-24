"use strict"
let app = require('koa')()
const bodyParser = require('koa-bodyparser');
let path = require('path')
let static_cache = require('koa-static-cache')

let config = require('./config')

let childs  = require("./sample-data.json")
let all_childs  = require("./sample-data.json")
let left_childs 

// 解析post请求
app.use(bodyParser());

// 默认路径
app.use(function *(next){
  if(this.path=="/")
    this.path = config.index
  yield next;
});

// 人员接口
app.use(function *(next){
  if(this.path=="/childs"){ //  获取参加抽奖人员
    this.set("Content-type","text/json;charset=UTF-8");
    console.log(this.query.option=="clear",this.query.option)
    if(this.query.option=="clear"){
      console.log("mark!!!!!!")
      childs  = all_childs
    }                                         
    this.body = childs;
  }else if(this.path == "/last"){
    if(this.query.reset == "true"){
      left_childs = {}
    }
    var str_result = "O(∩_∩)O   "
    left_childs.forEach(function(e){
        str_result += " "+e.name
    });
    this.body = str_result;
  }else if (this.path == "/kill_childs"){ //  删除已经获奖的人员
    var childs_names = this.request.body.childs_name.split(",");
    var temp_childs = [];
    childs.forEach(function(e){
      if( !childs_names.includes(e.name) ){
        temp_childs.push(e)
      }
    });
    childs = temp_childs;
    left_childs = childs
    var next_term = 20;
    switch (childs_names.length) {
      case 20:
        next_term = 15
        break;
      case 15:
        next_term = 4 
        break;
      case 4:
        next_term = 1
        break;
      case 1:
        next_term = "1&reset=clear"
        break;
      default:
        next_term = 1
        break;
    }
    console.log("哈哈",childs_names.length,next_term,childs_names,this.request.body.childs_name)
    this.set("Content-type","text/json;charset=UTF-8");
    this.body = {success: true,next_term: next_term};
  }else{
    yield next;
  }
});

// 缓存
app.use(static_cache(path.join(__dirname, config.root_dir), {
  
}))


// 启动
app.listen(config.default_port,function(){
  console.log("server started at " + config.default_port);
})
