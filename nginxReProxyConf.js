// Author: Conan
// Mail: 1526840124@qq.com
// Description: 实现通过后天管理配置Nginx反向代理。

//思路:
//1.读取nginx配置
//2.接收website和port参数
//3.读取proxy.conf,匹配website和port,存在的website则修改port,port已被占用则返回错误提示,新的website则追加到proxy.conf末尾
//4.同步到sqlite数据库
//5.重启nginx

var fs = require('fs');

function NginxReProxyConf(website, port, nginxconf,option) {
    this.website = website;
    this.port = port;
    this.nginxconf = nginxconf;
    this.websiteandport = '';//需调用readProxyFileToWebsiteAndPort方法设置,站点配置数组
    this.option=option;// add edit delete list
}

NginxReProxyConf.prototype = {
    constructor: NginxReProxyConf,
    readProxyFileToWebsiteAndPort: function () {
        try {
            var data = fs.readFileSync(this.nginxconf.nginxConfProxyPath);
        }
        catch (err) {
            console.log(err);
        }
        var proxystring = data.toString();
        //提取proxy.conf中的相关内容到数组中
        var serverExp = /server\s*{[\s\S]*?}/g;
        var result = proxystring.match(serverExp);
        var websiteAndPort = new Array();
        var servernameExp = /server_name\s*(.*);/;
        var proxypassExp = /proxy_pass\s*(.*);/;
        if(!result)
            return "当前配置项数目为0";
        for (var i = 0; i < result.length; i++) {
            var servername = result[i].toString().match(servernameExp)[1];
            var proxypass = result[i].toString().match(proxypassExp)[1];
            websiteAndPort[servername] = proxypass;
        }
        this.websiteandport = websiteAndPort;
        return websiteAndPort;
    },
    writeWebsiteAndPortToProxyFile: function () {
        //return tempproxymodel;
        var proxyconfstr = "";
        for (key in this.websiteandport) {
            try {
                var tempproxymodel = fs.readFileSync(this.nginxconf.nginxModelConfProxyPath).toString();
            } catch (err) {
                console.log(err);
            }
            tempproxymodel = tempproxymodel.replace(/server_name\s*.*;/, "server_name " + key + ";");
            tempproxymodel = tempproxymodel.replace(/proxy_pass\s*.*;/, "proxy_pass " + this.websiteandport[key] + ";");
            proxyconfstr += tempproxymodel;
        }
        try {
            fs.writeFileSync(this.nginxconf.nginxConfProxyPath, proxyconfstr);
        } catch (err) {
            console.log(err);
        }
        return true;
    },
    appendWebsiteAndPortToProxyFile: function () {
        var proxyconfstr = "";
        try {
            var tempproxymodel = fs.readFileSync(this.nginxconf.nginxModelConfProxyPath).toString();
        } catch (err) {
            console.log(err);
        }
        tempproxymodel = tempproxymodel.replace(/server_name\s*.*;/, "server_name " + this.website + ";");
        tempproxymodel = tempproxymodel.replace(/proxy_pass\s*.*;/, "proxy_pass " + this.port + ";");
        proxyconfstr += tempproxymodel;
        try {
            fs.appendFile(this.nginxconf.nginxConfProxyPath, proxyconfstr);
        } catch (err) {
            console.log(err);
        }
        this.websiteandport[this.website] = this.port;
        return true;
    },
    addToProxyFile:function () {
        //检测端口是否已经被占用
        for (key in this.websiteandport) {
            if (this.websiteandport[key] == this.port) {
                return console.error("Port has been used");
            }
        }
        //检测是否已经存在的website配置,是则修改该处的端口配置,并修改站点配置数组
        if (this.websiteandport.hasOwnProperty(this.website)) {
            return console.error("website has existed,please use edit");
        }
        //否则，追加配置到proxy.conf
        else {
            this.appendWebsiteAndPortToProxyFile();
            return "添加成功";
        }
    },
    editToProxyFile: function () {
        //检测端口是否已经被占用
        for (key in this.websiteandport) {
            if (this.websiteandport[key] == this.port) {
                return "Port has been used";
            }
        }
        //检测是否已经存在的website配置,是则修改该处的端口配置,并修改站点配置数组
        if (this.websiteandport.hasOwnProperty(this.website)) {
            //根据站点配置数组重写proxy.conf
            this.websiteandport[this.website] = this.port;
            this.writeWebsiteAndPortToProxyFile();
            return "修改成功";
        }
        //否则，追加配置到proxy.conf
        else {
            return "Website does not exists,please use add";
        }

    },
    deleteWebsiteFromProxyFile:function () {
        if (this.websiteandport.hasOwnProperty(this.website)){
            delete(this.websiteandport[this.website]);
            this.writeWebsiteAndPortToProxyFile();
            return "删除成功";
        }else{
            return console.error("this configuration does not existed for this website");
        }
    },
    listWebsiteAndPort:function () {
        return this.websiteandport;
    },
    runConfigure: function () {
        this.readProxyFileToWebsiteAndPort();
        switch (this.option){
            case "add":
                return this.addToProxyFile();
                break;
            case "edit":
                return this.editToProxyFile();
                break;
            case "delete":
                return this.deleteWebsiteFromProxyFile();
                break;
            case "list":
                return this.listWebsiteAndPort();
                break;
            default:
                error.err("undefined option");
        }
    }
}

module.exports = NginxReProxyConf;
