function addLoadEvent(func) {
    var oldonload = window.onload;
    if (typeof window.onload != 'function') {
        window.onload = func;
    } else {
        window.onload = function () {
            oldonload();
            func();
        }
    }
}

var xmlHttp;
function createxmlHttpRequest() {
    if (window.ActiveXObject) {
        xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
    } else if (window.XMLHttpRequest) {
        xmlHttp = new XMLHttpRequest();
    }
}

function doGet(url, callbackfunc) {
// 注意在传参数值的时候最好使用encodeURI处理一下，以防出现乱码
    createxmlHttpRequest();
    xmlHttp.open("GET", url);
    xmlHttp.send(null);
    console.log("get into doGet");
    xmlHttp.onreadystatechange = function () {
        if ((xmlHttp.readyState == 4) && (xmlHttp.status == 200)) {
            callbackfunc(xmlHttp.responseText);
        } else {
            console.log('ajax request failed');
        }
    }
}

function doPost(url, data, callbackfunc) {
// 注意在传参数值的时候最好使用encodeURI处理一下，以防出现乱码
    createxmlHttpRequest();
    xmlHttp.open("POST", url);
    xmlHttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xmlHttp.send(data);
    xmlHttp.onreadystatechange = function () {
        if ((xmlHttp.readyState == 4) && (xmlHttp.status == 200)) {
            callbackfunc(xmlHttp.responseText);
        } else {
            console.log('ajax request fail')
        }
    }
}


//删除按钮事件,ajax post
function showResult(data) {
    var jsonData = JSON.parse(data);
    alert(jsonData);
    location.reload();
}

function sendDel(website, port) {
    //doPost("nginxConfAjaxDel","website="+this.website+"&"+"port="+this.port,showDelResult)
    var poststring = "website=" + website + "&port=" + port;
    doPost("nginxConfAjaxDel", poststring, showResult);
}

function sendEdit(website, port) {
    //doPost("nginxConfAjaxDel","website="+this.website+"&"+"port="+this.port,showDelResult)
    var poststring = "website=" + website + "&port=" + port;
    doPost("nginxConfAjaxEdit", poststring, showResult);
}

function sendAdd(website, port) {
    //doPost("nginxConfAjaxDel","website="+this.website+"&"+"port="+this.port,showDelResult)
    var poststring = "website=" + website + "&port=" + port;
    doPost("nginxConfAjaxAdd", poststring, showResult);
}

//站点显示区
function showList(data) {
    var jsonData = JSON.parse(data);
    var p = document.getElementById("websiteAndPortList");
    var table = document.createElement("table");
    table.setAttribute("id", "websiteAndPortListTable");
    var tbody = document.createElement("tbody");
    for (key in jsonData) {
        var tr = document.createElement("tr");
        var td1 = document.createElement("td");
        var td2 = document.createElement("td");
        td1.innerHTML = key;
        td2.innerHTML = jsonData[key];

        var button1 = document.createElement("input");
        button1.type = "button";
        button1.setAttribute("id", "del");
        button1.setAttribute("value", "删除");
        button1.setAttribute("website", key);
        button1.setAttribute("port", jsonData[key]);

        var button2 = document.createElement("input");
        button2.type = "button";
        button2.setAttribute("id", "edit");
        button2.setAttribute("value", "修改");
        button2.setAttribute("website", key);
        button2.setAttribute("port", jsonData[key]);

        tr.appendChild(td1);
        tr.appendChild(td2);
        tr.appendChild(button1);
        tr.appendChild(button2);
        tbody.appendChild(tr);
        //添加onclick事件
        button1.onclick = function () {
            sendDel(button1.getAttribute("website"), button1.getAttribute("port"));
        };

        button2.onclick = function () {
            //根据button当前的状态动态修改website和port属性，或者提交服务器
            var newwebstie="";
            var newport="";
            if (button2.getAttribute("value") == "确定") {
                //获取用户新设置的website和port
                $(this).siblings("td").each(function(){
                    var obj_text = $(this).find("input:text");
                    if(obj_text.length){
                        //alert(obj_text.val());
                        if(!newwebstie)
                            newwebstie=obj_text.val();
                        else
                            newport=obj_text.val();
                    }
                })
                button2.setAttribute("website",newwebstie);
                button2.setAttribute("port",newport);
                sendEdit(button2.getAttribute("website"), button2.getAttribute("port"));
                button2.setAttribute("value","修改");
            } else {
                //根据修改的值设置website和port
                button2.setAttribute("value","确定");
                //设置文本框使变为可编辑
                $(this).siblings("td").each(function() {  // 获取当前行的其他单元格
                    var obj_text = $(this).find("input:text");// 判断单元格下是否有文本框
                    if(!obj_text.length){// 如果没有文本框，则添加文本框使之可以编辑
                        $(this).html("<input type='text' value='"+$(this).text()+"'>");
                    }
                    else   // 如果已经存在文本框，则将其显示为文本框修改的值
                        $(this).html(obj_text.val());
                });
            }
        }
    }
    var addtr = document.createElement("tr");
    var addtd1 = document.createElement("td");
    var addtd2 = document.createElement("td");
    addtd1.innerHTML = "";
    addtd2.innerHTML = "";
    addtr.appendChild(addtd1);
    addtr.appendChild(addtd2);
    var addButton = document.createElement("input");
    addButton.type = "button";
    addButton.setAttribute("id", "add");
    addButton.setAttribute("value", "添加");
    addButton.onclick = function () {
        //根据button当前的状态动态修改website和port属性，或者提交服务器
        var newwebstie="";
        var newport="";
        if (addButton.getAttribute("value") == "确定") {
            //获取用户设置的website和port
            $(this).siblings("td").each(function(){
                var obj_text = $(this).find("input:text");
                if(obj_text.length){
                    //alert(obj_text.val());
                    if(!newwebstie)
                        newwebstie=obj_text.val();
                    else
                        newport=obj_text.val();
                }
            })
            addButton.setAttribute("website",newwebstie);
            addButton.setAttribute("port",newport);
            sendAdd(addButton.getAttribute("website"), addButton.getAttribute("port"));
            addButton.setAttribute("value","添加");
        } else {
            //根据修改的值设置website和port
            addButton.setAttribute("value","确定");
            //设置文本框使变为可编辑
            $(this).siblings("td").each(function() {  // 获取当前行的其他单元格
                var obj_text = $(this).find("input:text");// 判断单元格下是否有文本框
                if(!obj_text.length){// 如果没有文本框，则添加文本框使之可以编辑
                    $(this).html("<input type='text' value='"+$(this).text()+"'>");
                }
                else   // 如果已经存在文本框，则将其显示为文本框修改的值
                    $(this).html(obj_text.val());
            });
        }
    }
    addtr.appendChild(addButton);
    tbody.appendChild(addtr);

    table.appendChild(tbody);
    p.appendChild(table);
}

addLoadEvent(doGet("nginxConfAjaxGetList", showList));

