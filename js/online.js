function getDate01() {
    var time = new Date();        //获得当前日期
    var myYear = time.getFullYear();
    var myMonth = time.getMonth() + 1;
    var myDay = time.getDate();
    if (myMonth < 10) {
		myMonth = "0" + myMonth;
    }
    document.getElementById("day_day").innerHTML = myYear + "." + myMonth + "." + myDay;
}

window.onload = function() {
	getDate01();
}

function logout() {
	if (confirm("确定要退出么?"))
	window.location.href = "login.html";
}

function getId(id){return document.getElementById(id)}  //封装
var search=getId("search");
var test=getId("t");

//菜单的实现：事件绑定；点击菜单显示对应的 div
getId("btsearch").onclick=function(){search.style.display="block";test.style.display="none";}
getId("testme").onclick=function(){search.style.display="none";test.style.display="block";}

// --- 教师端菜单逻辑 ---
var baseinfo = getId('baseinfo');
getId("baseinfoLr").onclick = function() {
    baseinfo.style.display = "block";
    // 隐藏其他可能显示的div（如果有扩展需要在这里添加隐藏逻辑）
}

function getInner() {    //获取浏览器视口的大小
    return {
        width: window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth,
        height: window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
    }
}

var repass = getId('repass');
var scree = getId('screen1');

function centerRepass() {
    var top = (getInner().height - 250) / 2;
    var left = (getInner().width - 360) / 2;
    repass.style['top'] = top + 'px';
    repass.style['left'] = left + 'px';
}

centerRepass();

window.onresize = function() { 
	centerRepass();
	if(repass.style['display'] =='block')
	    lock();
}
	
var change=getId('change');
change.onclick=function(){
    repass.style['display'] ='block';
    lock();
}
	
var close=getId('close');
close.onclick=function(){
    repass.style['display'] ='none';
    scree.style['display'] ='none';
}
	
function lock(){     //遮罩锁屏效果
    scree.style.width=getInner().width+'px';
    scree.style.height=getInner().height+'px';
    scree.style['display'] ='block';
}

// --- 新增：密码修改点击逻辑 ---
var qrBtn = document.querySelector('.qr');
qrBtn.onclick = function() {
    alert("修改成功！"); // 弹出提示
    repass.style['display'] ='none'; // 关闭窗口
    scree.style['display'] ='none';  // 关闭遮罩
    // 注意：此处未编写任何修改 localStorage 或服务器数据的代码
}

var con=getId('content');
var len=con.children.length;
for(var i=0;i<len;i++)
    con.children[i].style.display='none'; 

var baseinfo=getId('baseinfo');            
var stu=getId('stu');                      
var search=getId("search");                
var teach=getId("teacher");                  

// 角色判断与界面初始化
if(localStorage.role == 1) {
    teach.style.display='block';           
    stu.style.display='none';     
    baseinfo.style.display='block';  // 教师登录默认显示学生信息录入界面
} else {
    teach.style.display='none';            
    stu.style.display='block';             
    search.style.display='block';          
}

// ==========================================
//    以下为整合的学生成绩管理逻辑 (原 index.html JS)
// ==========================================
var students = [];

function Student(Id, name, english, mathe_m, c, js, data_s) {
    this.Id = Id;
    this.name = name;
    this.english = parseFloat(english) || 0;
    this.mathe_m = parseFloat(mathe_m) || 0;
    this.c = parseFloat(c) || 0;
    this.js = parseFloat(js) || 0;
    this.data_s = parseFloat(data_s) || 0;
}

Student.prototype.summation = function() {
    return this.english + this.mathe_m + this.c + this.js + this.data_s;
};

function SumShow() {
    var f = document.form1;
    var id = f.no.value;
    var name = f.name.value;

    if(id === "" || name === "") {
        getId('info').innerHTML = "学号或姓名不能为空！";
        return;
    }

    // 检查重复
    for(var i=0; i<students.length; i++) {
        if(students[i].Id === id) {
            getId('info').innerHTML = "该学号已存在！";
            return;
        }
    }

    var scores = [f.efield.value, f.gs.value, f.c.value, f.js.value, f.sj.value];
    for(var i=0; i<scores.length; i++) {
        var s = parseFloat(scores[i]);
        if(isNaN(s) || s < 0 || s > 100) {
            getId('info').innerHTML = "成绩必须是0-100之间的数字！";
            return;
        }
    }

    var stu = new Student(id, name, scores[0], scores[1], scores[2], scores[3], scores[4]);
    students.push(stu);
    addTable(stu);
    getId('info').innerHTML = "";
    f.reset();
}

function addTable(stu) {
    var table = getId("cj").getElementsByTagName('tbody')[0] || getId("cj");
    var row = table.insertRow(-1);
    
    row.innerHTML = `
        <td><input name="ic" type="checkbox" value="${stu.Id}" onclick="single_check()"/></td>
        <td>${stu.Id}</td>
        <td>${stu.name}</td>
        <td>${stu.english}</td>
        <td>${stu.mathe_m}</td>
        <td>${stu.c}</td>
        <td>${stu.js}</td>
        <td>${stu.data_s}</td>
        <td>${stu.summation()}</td>
        <td><a href="javascript:;" onclick="deleteScore('${stu.Id}', this)">删除</a></td>
    `;

    row.onmouseover = function() { this.style.backgroundColor = "#f5f5f5"; };
    row.onmouseout = function() { this.style.backgroundColor = "#fff"; };
}

function deleteScore(ID, obj) {
    if(confirm("确定删除吗？")) {
        var rowIndex = obj.parentNode.parentNode.rowIndex;
        getId("cj").deleteRow(rowIndex);
        students = students.filter(function(s) { return s.Id !== ID; });
    }
}

function all_check() {
    var oInput = document.getElementsByName("ic");
    var all = getId('all').checked;
    for (var i = 0; i < oInput.length; i++) {
        oInput[i].checked = all;
    }
}

function single_check() {
    var oInput = document.getElementsByName("ic");
    var checkedCount = 0;
    for (var i = 0; i < oInput.length; i++) {
        if (oInput[i].checked) checkedCount++;
    }
    getId('all').checked = (checkedCount === oInput.length && oInput.length > 0);
}

function removeRow() {
    var checkboxes = document.getElementsByName("ic");
    var table = getId("cj");
    if (confirm("确定要删除选中行吗？")) {
        // 从后往前删，避免索引偏移问题
        for (var i = checkboxes.length - 1; i >= 0; i--) {
            if (checkboxes[i].checked) {
                var id = checkboxes[i].value;
                var rowIndex = checkboxes[i].parentNode.parentNode.rowIndex;
                table.deleteRow(rowIndex);
                students = students.filter(function(s) { return s.Id !== id; });
            }
        }
        getId('all').checked = false;
    }
}
// ==========================================


var time=getId("time");    
var js; 
var timeID;

function jsover() {
    var syfz=Math.floor((js-new Date().getTime())/(1000 * 60));
    var sym=Math.floor((js-new Date().getTime()-syfz * 1000 * 60)/ (1000));

    if(syfz<0)              
        Grade();
    else
        time.innerHTML="离考试结束还剩"+syfz+"分"+sym+"秒";
}

var Total_test=6;           
var qustion=new Array(Total_test)
qustion[0]="下面选项()能获得焦点。";
var qustionXz=new Array(Total_test);
qustionXz[0]=["A.blur()","B.onblur()","C.focus()","D.onfocus()"];
var answer=new Array(Total_test)
answer[0]='D';
qustionXz[1]=["A.charAt()","B.substring()","C.toUpperCase()","D.length()"];
qustion[1]="String 对象的方法不包括()。";
answer[1]='D';
qustionXz[2]=["A.add()","B.join()","C.sort()","D.length()"];
qustion[2]="在 JavaScript 中()方法可以对数组元素进行排序。";
answer[2]='C';
qustionXz[3]=["A.selectedIndex","B.options","C.length","D.size"];
qustion[3]="下列选项中()可以用来检索下拉列表框中被选项的索引号。";
answer[3]='A';
qustionXz[4]=["A.正确","B.错误"];
qustion[4]="所有网页的扩展名都是 .htm。";
answer[4]='B';
qustionXz[5]=["A.正确","B.错误"];
qustion[5]="P 标记符的结束标记符通常不可以省略。";
answer[5]='B';

var msg=""; var div1;
var Total_xt;
var a=new Array();

function ct() {
    Total_xt=document.test.textXt.value;    
    if(Total_xt.length==0 || isNaN(Total_xt) || parseInt(Total_xt)<1) {
        time.innerHTML="请输入大于 0 的数字";
        document.test.textXt.select();
        return;
    }
    if(Total_xt>Total_test)
        Total_xt=Total_test;
    else
        Total_xt=parseInt(Total_xt);
    
    var ks=new Date(); var msks=ks.getTime();    
    js=msks+1*60*1000;                      
    timeID=setInterval(jsover,1000);    
    if(typeof(div1)=='object')
        test.removeChild(div1);
    
    msg='<table width="100%" border="0" cellspacing="0" id="oTable">';
    div1=document.createElement("div");
    for(var j=0;j<Total_xt;j++) {
        var nxl=Math.floor(Total_test/Total_xt);
        var idx=Math.floor(Math.random()*nxl+nxl*j);
        a[j]=idx;
        msg+="<tr><td><b>"+(j+1)+"."+qustion[idx]+"</b><br><br>"+
        '<label><input type="radio" name="Xz'+idx+'" value="A">'+
        qustionXz[idx][0]+'</label><br>'+'<label><input type="radio" value="B" name="Xz'+idx+'">'+qustionXz[idx][1]+
        '</label><br>';
        if(qustionXz[idx][2]!=undefined)
            msg+='<label><input type="radio" value="C" name="Xz'+idx+'">'+qustionXz[idx][2]+'</label><br>'+'<label><input type="radio" value="D" name="Xz'+idx+'">'+qustionXz[idx][3]+'</label><br>';
        
        msg+='</td></tr>';
    }
    msg+='<tr><td><input type="button" value="交卷" onclick="Grade()"></td></tr></table>';
    div1.innerHTML=msg;
    test.appendChild(div1);
    var oTable=document.getElementById("oTable");
    for(var i=0;i<oTable.rows.length;i++) {
        if(i%2==0)      
            oTable.rows[i].className="altrow";
    }
}

function GetSelectedButton(ButtonGroup) {
    for(var x=0;x<ButtonGroup.length;x++) {
        if(ButtonGroup[x].checked)
            return ButtonGroup[x].value;
    }
    return -1;
}

function Grade() {
    var correct=0;
    var s="";
    for(var number=0;number<Total_xt;number++) {
        var ra='Xz'+a[number];
        var rad=document.getElementsByName(ra);
        var myanswer=GetSelectedButton(rad);
        if(myanswer==answer[a[number]]) {
            correct++;
        }
        s+=(number+1)+","+answer[a[number]]+" ";
    }
    var totalgrade=Math.round(correct/Total_xt*100);
    time.innerHTML='<h2 style="color:red">测验成绩:'+totalgrade+'分</h2><hr>';
    time.innerHTML+='正确答案为:'+s;
    js=new Date().getTime()-1;  
    clearInterval(timeID);      
}