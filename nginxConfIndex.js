var express = require('express');
var bodyParser = require("body-parser");
var configure = require('./nginxconfigure');
var NginxConf = require('./nginxConf');
var NginxReProxyConf = require('./nginxReProxyConf');

var nginxExecutePath = configure.nginxExecutePath;
var nginxConfProxyPath = configure.nginxConfProxyPath;
var nginxModelConfProxyPath = configure.nginxModelConfProxyPath;
var nginxConf = new NginxConf(nginxExecutePath, nginxConfProxyPath, nginxModelConfProxyPath);
//var nginxReProxyConf=new NginxReProxyConf("testurl.com","http://localhost:6666",nginxConf,"list");

var app = express();
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: false}));

app.get('/nginxConfIndex.html', function (req, res) {
    res.sendFile(__dirname + "/" + "nginxConfIndex.html");
})

app.get('/nginxConfAjaxGetList', function (req, res) {
    console.log("ajax请求");
    var nginxReProxyConf = new NginxReProxyConf("*", "*", nginxConf, "list");
    var result = nginxReProxyConf.runConfigure();
    var jsonResult = {};
    for (key in result) {
        jsonResult[key] = result[key];
    }
    console.log(jsonResult);
    res.send(JSON.stringify(jsonResult));
})

//  POST DEL 请求
app.post('/nginxConfAjaxDel', function (req, res) {
    //console.log("主页 Del 请求");
    var postwebsite=req.body.website;
    var postport=req.body.port;
    var nginxReProxyConf = new NginxReProxyConf(postwebsite, postport, nginxConf, "delete");
    var result = nginxReProxyConf.runConfigure();
    res.send(JSON.stringify("send from server: "+result));
})

// POST EDIT 请求
app.post('/nginxConfAjaxEdit', function (req, res) {
    var postwebsite=req.body.website;
    var postport=req.body.port;
    var nginxReProxyConf = new NginxReProxyConf(postwebsite, postport, nginxConf, "edit");
    var result = nginxReProxyConf.runConfigure();
    res.send(JSON.stringify("send from server: "+result));
})

// POST ADD请求
app.post('/nginxConfAjaxAdd', function (req, res) {
    var postwebsite=req.body.website;
    var postport=req.body.port;
    var nginxReProxyConf = new NginxReProxyConf(postwebsite, postport, nginxConf, "add");
    var result = nginxReProxyConf.runConfigure();
    res.send(JSON.stringify("send from server: "+result));
})

//  /list_user 页面 GET 请求
app.get('/listNginxConfiguration', function (req, res) {
    res.send('用户列表页面');
})

var server = app.listen(8000, function () {
    var host = server.address().address
    var port = server.address().port
})
