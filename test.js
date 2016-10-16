var configure=require('./nginxconfigure');
var NginxConf = require('./nginxConf');
var NginxReProxyConf=require('./nginxReProxyConf');

var nginxExecutePath=configure.nginxExecutePath;
var nginxConfProxyPath=configure.nginxConfProxyPath;
var nginxModelConfProxyPath=configure.nginxModelConfProxyPath;
var nginxConf = new NginxConf(nginxExecutePath, nginxConfProxyPath, nginxModelConfProxyPath);



//var test1=new NginxReProxyConf("test1.com","http://localhost:8888",nginxConf,"add");
//test1.runConfigure();
//console.log(test1.websiteandport)

var test2=new NginxReProxyConf("test2.com","http://localhost:8000",nginxConf,"add");
test2.runConfigure();
console.log(test2.websiteandport)
