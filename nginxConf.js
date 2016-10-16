//nginx bin的目录路径
//nginx conf proxy.conf文件路径

function NginxConf(nginxExecutePath,nginxConfProxyPath,nginxModelConfProxyPath) {
    this.nginxExecutePath=nginxExecutePath;
    this.nginxConfProxyPath=nginxConfProxyPath;
    this.nginxModelConfProxyPath=nginxModelConfProxyPath;
}

module.exports = NginxConf;
