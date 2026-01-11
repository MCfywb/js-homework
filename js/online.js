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

// 显示学生信息
function showStudentInfo() {
    // 获取学生基本信息
    var username = localStorage.getItem('username');
    var role = localStorage.getItem('role');
    var loginTime = localStorage.getItem('loginTime');
    
    // 设置学生基本信息
    getId('studentId').innerText = username;
    getId('studentName').innerText = username === 'student' ? '学生用户' : '教师用户';
    getId('studentRole').innerText = role == 1 ? '教师' : '学生';
    getId('loginTime').innerText = loginTime || '未知';
    
    // 获取并显示学生成绩
    var students = JSON.parse(localStorage.getItem('students')) || [];
    var myScoresDiv = getId('myScores');
    
    // 查找当前学生的成绩
    var myScores = students.filter(function(student) {
        return student.Id === username;
    });
    
    if (myScores.length > 0) {
        var score = myScores[0];
        myScoresDiv.innerHTML = `
            <table class="table" width="80%">
                <thead>
                    <tr>
                        <th>科目</th>
                        <th>成绩</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>英语</td>
                        <td>${score.english}</td>
                    </tr>
                    <tr>
                        <td>高数</td>
                        <td>${score.mathe_m}</td>
                    </tr>
                    <tr>
                        <td>C语言</td>
                        <td>${score.c}</td>
                    </tr>
                    <tr>
                        <td>动态脚本</td>
                        <td>${score.js}</td>
                    </tr>
                    <tr>
                        <td>数据结构</td>
                        <td>${score.data_s}</td>
                    </tr>
                    <tr>
                        <td><strong>总分</strong></td>
                        <td><strong>${score.summation()}</strong></td>
                    </tr>
                </tbody>
            </table>
        `;
    } else {
        myScoresDiv.innerHTML = '<p style="text-align: center; padding: 20px;">暂无成绩记录</p>';
    }
}

window.onload = function() {
	getDate01();
    
    // 保存学生成绩到localStorage
    window.saveStudentsToLocalStorage = function() {
        localStorage.setItem('students', JSON.stringify(students));
    };
    
    // 初始化学生成绩表格
    initStudentTable();
}

// 初始化学生成绩表格
function initStudentTable() {
    var table = getId("cj").getElementsByTagName('tbody')[0] || getId("cj");
    // 清空表格
    table.innerHTML = '';
    
    // 添加数据行
    for(var i=0; i<students.length; i++) {
        addTable(students[i]);
    }
}

// 成绩查询功能
function searchScores() {
    var form = document.searchForm;
    var searchType = form.searchType.value;
    var searchContent = form.searchContent.value.trim();
    var searchResult = getId('searchResult');
    
    if(searchContent === '') {
        searchResult.innerHTML = '<p style="text-align: center; color: red; padding: 20px;">请输入查询内容！</p>';
        return;
    }
    
    // 过滤结果
    var results = students.filter(function(student) {
        if(searchType === 'id') {
            return student.Id.indexOf(searchContent) !== -1;
        } else {
            return student.name.indexOf(searchContent) !== -1;
        }
    });
    
    if(results.length === 0) {
        searchResult.innerHTML = '<p style="text-align: center; color: red; padding: 20px;">未找到匹配的成绩记录！</p>';
        return;
    }
    
    // 显示结果
    var html = `
        <table class="table" width="95%">
            <caption style="font-size:18px; margin-bottom:10px; color:#044599; font-weight:bold;">查询结果 (共${results.length}条)</caption>
            <thead>
                <tr>
                    <th>学号</th><th>姓名</th><th>英语</th><th>高数</th><th>C语言</th><th>JS</th><th>数据结构</th><th>总分</th>
                </tr>
            </thead>
            <tbody>
    `;
    
    for(var i=0; i<results.length; i++) {
        var student = results[i];
        html += `
            <tr>
                <td>${student.Id}</td>
                <td>${student.name}</td>
                <td>${student.english}</td>
                <td>${student.mathe_m}</td>
                <td>${student.c}</td>
                <td>${student.js}</td>
                <td>${student.data_s}</td>
                <td>${student.summation()}</td>
            </tr>
        `;
    }
    
    html += `
            </tbody>
        </table>
    `;
    
    searchResult.innerHTML = html;
}

// 显示全部成绩
function showAllScores() {
    var searchResult = getId('searchResult');
    
    if(students.length === 0) {
        searchResult.innerHTML = '<p style="text-align: center; color: red; padding: 20px;">暂无成绩记录！</p>';
        return;
    }
    
    // 显示全部结果
    var html = `
        <table class="table" width="95%">
            <caption style="font-size:18px; margin-bottom:10px; color:#044599; font-weight:bold;">全部成绩记录 (共${students.length}条)</caption>
            <thead>
                <tr>
                    <th>学号</th><th>姓名</th><th>英语</th><th>高数</th><th>C语言</th><th>JS</th><th>数据结构</th><th>总分</th>
                </tr>
            </thead>
            <tbody>
    `;
    
    for(var i=0; i<students.length; i++) {
        var student = students[i];
        html += `
            <tr>
                <td>${student.Id}</td>
                <td>${student.name}</td>
                <td>${student.english}</td>
                <td>${student.mathe_m}</td>
                <td>${student.c}</td>
                <td>${student.js}</td>
                <td>${student.data_s}</td>
                <td>${student.summation()}</td>
            </tr>
        `;
    }
    
    html += `
            </tbody>
        </table>
    `;
    
    searchResult.innerHTML = html;
}

function logout() {
	if (confirm("确定要退出么?"))
	window.location.href = "login.html";
}

function getId(id){return document.getElementById(id)}  //封装
var search=getId("search");
var test=getId("t");

//菜单的实现：事件绑定；点击菜单显示对应的 div
var studentInfo = getId('studentInfo');
var testHistory = getId('testHistory');
getId("btsearch").onclick=function(){
    search.style.display="none";
    test.style.display="none";
    baseinfo.style.display="none";
    studentInfo.style.display="block";
    testHistory.style.display="none";
    showStudentInfo();
}
getId("testme").onclick=function(){
    search.style.display="none";
    test.style.display="block";
    baseinfo.style.display="none";
    studentInfo.style.display="none";
    testHistory.style.display="none";
}
getId("testHistoryLink").onclick=function(){
    search.style.display="none";
    test.style.display="none";
    baseinfo.style.display="none";
    studentInfo.style.display="none";
    testHistory.style.display="block";
    showTestHistory();
}

// --- 教师端菜单逻辑 ---
var baseinfo = getId('baseinfo');
var studentQuery = getId('studentQuery');
var studentDelete = getId('studentDelete');
var studentStatistics = getId('studentStatistics');
var questionInput = getId('questionInput');
var subjectiveReview = getId('subjectiveReview');
var scoreStatistics = getId('scoreStatistics');

getId("baseinfoLr").onclick = function() {
    baseinfo.style.display = "block";
    search.style.display = "none";
    test.style.display = "none";
    studentInfo.style.display = "none";
    testHistory.style.display = "none";
    studentQuery.style.display = "none";
    studentDelete.style.display = "none";
    studentStatistics.style.display = "none";
    questionInput.style.display = "none";
}

// 学生信息查询菜单事件处理
getId("teacher").getElementsByTagName("li")[1].getElementsByTagName("a")[0].onclick = function() {
    studentQuery.style.display = "block";
    baseinfo.style.display = "none";
    search.style.display = "none";
    test.style.display = "none";
    studentInfo.style.display = "none";
    testHistory.style.display = "none";
    studentDelete.style.display = "none";
    studentStatistics.style.display = "none";
    questionInput.style.display = "none";
};

// 学生信息删除菜单事件处理
getId("teacher").getElementsByTagName("li")[2].getElementsByTagName("a")[0].onclick = function() {
    studentDelete.style.display = "block";
    baseinfo.style.display = "none";
    search.style.display = "none";
    test.style.display = "none";
    studentInfo.style.display = "none";
    testHistory.style.display = "none";
    studentQuery.style.display = "none";
    studentStatistics.style.display = "none";
    questionInput.style.display = "none";
};

// 学生信息统计菜单事件处理
getId("teacher").getElementsByTagName("li")[3].getElementsByTagName("a")[0].onclick = function() {
    studentStatistics.style.display = "block";
    baseinfo.style.display = "none";
    search.style.display = "none";
    test.style.display = "none";
    studentInfo.style.display = "none";
    testHistory.style.display = "none";
    studentQuery.style.display = "none";
    studentDelete.style.display = "none";
    questionInput.style.display = "none";
    // 显示统计结果
    showStudentStatistics();
};

// 试题录入菜单事件处理
getId("teacher").getElementsByTagName("li")[4].getElementsByTagName("a")[0].onclick = function() {
    questionInput.style.display = "block";
    baseinfo.style.display = "none";
    search.style.display = "none";
    test.style.display = "none";
    studentInfo.style.display = "none";
    testHistory.style.display = "none";
    studentQuery.style.display = "none";
    studentDelete.style.display = "none";
    studentStatistics.style.display = "none";
    subjectiveReview.style.display = "none";
    scoreStatistics.style.display = "none";
    // 显示已录入的试题
    showQuestionList();
};

// 主观题评阅菜单事件处理
getId("teacher").getElementsByTagName("li")[5].getElementsByTagName("a")[0].onclick = function() {
    subjectiveReview.style.display = "block";
    baseinfo.style.display = "none";
    search.style.display = "none";
    test.style.display = "none";
    studentInfo.style.display = "none";
    testHistory.style.display = "none";
    studentQuery.style.display = "none";
    studentDelete.style.display = "none";
    studentStatistics.style.display = "none";
    questionInput.style.display = "none";
    scoreStatistics.style.display = "none";
    // 显示待评阅的主观题
    showSubjectiveQuestions();
};

// 成绩统计菜单事件处理
getId("teacher").getElementsByTagName("li")[6].getElementsByTagName("a")[0].onclick = function() {
    scoreStatistics.style.display = "block";
    baseinfo.style.display = "none";
    search.style.display = "none";
    test.style.display = "none";
    studentInfo.style.display = "none";
    testHistory.style.display = "none";
    studentQuery.style.display = "none";
    studentDelete.style.display = "none";
    studentStatistics.style.display = "none";
    questionInput.style.display = "none";
    subjectiveReview.style.display = "none";
    // 显示成绩统计
    showScoreStatistics();
};

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
    // 获取密码输入框
    var opass = document.querySelector('#repass input[name="opass"]');
    var npass = document.querySelector('#repass input[name="npass"]');
    var rpass = document.querySelector('#repass input[name="rpass"]');
    
    // 验证输入
    if (opass.value === '' || npass.value === '' || rpass.value === '') {
        alert("请填写所有密码字段！");
        return;
    }
    
    if (npass.value !== rpass.value) {
        alert("两次输入的新密码不一致！");
        return;
    }
    
    if (npass.value.length < 6 || npass.value.length > 12) {
        alert("新密码长度必须在6-12位之间！");
        return;
    }
    
    // 验证旧密码
    var users = JSON.parse(localStorage.getItem('users')) || {};
    var currentUser = localStorage.getItem('username');
    
    if (users[currentUser] !== opass.value) {
        alert("旧密码输入错误！");
        opass.value = '';
        opass.focus();
        return;
    }
    
    // 更新密码
    users[currentUser] = npass.value;
    localStorage.setItem('users', JSON.stringify(users));
    
    // 显示成功信息
    alert("密码修改成功！");
    
    // 清空输入框并关闭窗口
    opass.value = '';
    npass.value = '';
    rpass.value = '';
    repass.style['display'] ='none'; // 关闭窗口
    scree.style['display'] ='none';  // 关闭遮罩
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
    search.style.display='none';
    test.style.display='none';
    studentInfo.style.display='none';
    testHistory.style.display='none';
    subjectiveReview.style.display='none';
    scoreStatistics.style.display='none';
} else {
    teach.style.display='none';            
    stu.style.display='block';              
    search.style.display='block';          
    baseinfo.style.display='none';
    test.style.display='none';
    studentInfo.style.display='none';
    testHistory.style.display='none';
    subjectiveReview.style.display='none';
    scoreStatistics.style.display='none';
}

// ==========================================
//    以下为整合的学生成绩管理逻辑 (原 index.html JS)
// ==========================================
// 从localStorage加载学生数据
var students = JSON.parse(localStorage.getItem('students')) || [];

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
    // 保存到localStorage
    localStorage.setItem('students', JSON.stringify(students));
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
        // 保存到localStorage
        localStorage.setItem('students', JSON.stringify(students));
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
        // 保存到localStorage
        localStorage.setItem('students', JSON.stringify(students));
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
    
    // 保存测试历史记录
    saveTestHistory(Total_xt, correct, totalgrade);
}

// 保存测试历史记录
function saveTestHistory(totalQuestions, correctAnswers, score) {
    var username = localStorage.getItem('username');
    var testHistory = JSON.parse(localStorage.getItem('testHistory')) || {};
    
    if (!testHistory[username]) {
        testHistory[username] = [];
    }
    
    var historyRecord = {
        date: new Date().toLocaleString(),
        totalQuestions: totalQuestions,
        correctAnswers: correctAnswers,
        score: score
    };
    
    testHistory[username].push(historyRecord);
    localStorage.setItem('testHistory', JSON.stringify(testHistory));
}

// 显示测试历史记录
function showTestHistory() {
    var username = localStorage.getItem('username');
    var testHistory = JSON.parse(localStorage.getItem('testHistory')) || {};
    var historyList = getId('historyList');
    
    if (!testHistory[username] || testHistory[username].length === 0) {
        historyList.innerHTML = '<p style="text-align: center; padding: 20px;">暂无测试历史记录</p>';
        return;
    }
    
    // 按时间倒序排序
    var records = testHistory[username].sort(function(a, b) {
        return new Date(b.date) - new Date(a.date);
    });
    
    var html = `
        <table class="table" width="90%">
            <caption style="font-size:18px; margin-bottom:10px; color:#044599; font-weight:bold;">测试历史记录 (共${records.length}条)</caption>
            <thead>
                <tr>
                    <th>测试时间</th>
                    <th>题目数量</th>
                    <th>正确题数</th>
                    <th>得分</th>
                    <th>正确率</th>
                </tr>
            </thead>
            <tbody>
    `;
    
    for(var i=0; i<records.length; i++) {
        var record = records[i];
        var accuracy = Math.round((record.correctAnswers / record.totalQuestions) * 100) + '%';
        
        html += `
            <tr>
                <td>${record.date}</td>
                <td>${record.totalQuestions}</td>
                <td>${record.correctAnswers}</td>
                <td>${record.score}分</td>
                <td>${accuracy}</td>
            </tr>
        `;
    }
    
    html += `
            </tbody>
        </table>
    `;
    
    historyList.innerHTML = html;
}

// 学生信息查询功能
function queryStudents() {
    var form = document.studentQueryForm;
    var queryType = form.queryType.value;
    var queryContent = form.queryContent.value.trim();
    var queryResult = getId('queryResult');
    
    if(queryContent === '') {
        queryResult.innerHTML = '<p style="text-align: center; color: red; padding: 20px;">请输入查询内容！</p>';
        return;
    }
    
    // 过滤结果
    var results = students.filter(function(student) {
        if(queryType === 'id') {
            return student.Id.indexOf(queryContent) !== -1;
        } else {
            return student.name.indexOf(queryContent) !== -1;
        }
    });
    
    if(results.length === 0) {
        queryResult.innerHTML = '<p style="text-align: center; color: red; padding: 20px;">未找到匹配的学生记录！</p>';
        return;
    }
    
    // 显示结果
    showStudentQueryResults(results);
}

// 显示全部学生信息
function showAllStudents() {
    if(students.length === 0) {
        getId('queryResult').innerHTML = '<p style="text-align: center; color: red; padding: 20px;">暂无学生记录！</p>';
        return;
    }
    
    showStudentQueryResults(students);
}

// 显示学生查询结果
function showStudentQueryResults(results) {
    var queryResult = getId('queryResult');
    var html = `
        <table class="table" width="95%">
            <caption style="font-size:18px; margin-bottom:10px; color:#044599; font-weight:bold;">学生信息查询结果 (共${results.length}条)</caption>
            <thead>
                <tr>
                    <th>学号</th><th>姓名</th><th>英语</th><th>高数</th><th>C语言</th><th>JS</th><th>数据结构</th><th>总分</th>
                </tr>
            </thead>
            <tbody>
    `;
    
    for(var i=0; i<results.length; i++) {
        var student = results[i];
        html += `
            <tr>
                <td>${student.Id}</td>
                <td>${student.name}</td>
                <td>${student.english}</td>
                <td>${student.mathe_m}</td>
                <td>${student.c}</td>
                <td>${student.js}</td>
                <td>${student.data_s}</td>
                <td>${student.summation()}</td>
            </tr>
        `;
    }
    
    html += `
            </tbody>
        </table>
    `;
    
    queryResult.innerHTML = html;
}

// 学生信息删除查询功能
function queryStudentsForDelete() {
    var form = document.studentDeleteForm;
    var queryType = form.deleteQueryType.value;
    var queryContent = form.deleteQueryContent.value.trim();
    var deleteResult = getId('deleteResult');
    
    if(queryContent === '') {
        deleteResult.innerHTML = '<p style="text-align: center; color: red; padding: 20px;">请输入查询内容！</p>';
        return;
    }
    
    // 过滤结果
    var results = students.filter(function(student) {
        if(queryType === 'id') {
            return student.Id.indexOf(queryContent) !== -1;
        } else {
            return student.name.indexOf(queryContent) !== -1;
        }
    });
    
    if(results.length === 0) {
        deleteResult.innerHTML = '<p style="text-align: center; color: red; padding: 20px;">未找到匹配的学生记录！</p>';
        return;
    }
    
    // 显示结果供删除选择
    showStudentsForDelete(results);
}

// 显示全部学生信息供删除选择
function showAllStudentsForDelete() {
    if(students.length === 0) {
        getId('deleteResult').innerHTML = '<p style="text-align: center; color: red; padding: 20px;">暂无学生记录！</p>';
        return;
    }
    
    showStudentsForDelete(students);
}

// 显示学生信息供删除选择
function showStudentsForDelete(results) {
    var deleteResult = getId('deleteResult');
    var html = `
        <table class="table" width="95%">
            <caption style="font-size:18px; margin-bottom:10px; color:#044599; font-weight:bold;">学生信息删除选择 (共${results.length}条)</caption>
            <thead>
                <tr>
                    <th><label><input type="checkbox" id="selectAllDelete" onclick="selectAllDeleteStudents()"/>全选</label></th>
                    <th>学号</th><th>姓名</th><th>英语</th><th>高数</th><th>C语言</th><th>JS</th><th>数据结构</th><th>总分</th>
                </tr>
            </thead>
            <tbody>
    `;
    
    for(var i=0; i<results.length; i++) {
        var student = results[i];
        html += `
            <tr>
                <td><input type="checkbox" name="studentDeleteCheckbox" value="${student.Id}" onclick="updateSelectAllDeleteState()"/></td>
                <td>${student.Id}</td>
                <td>${student.name}</td>
                <td>${student.english}</td>
                <td>${student.mathe_m}</td>
                <td>${student.c}</td>
                <td>${student.js}</td>
                <td>${student.data_s}</td>
                <td>${student.summation()}</td>
            </tr>
        `;
    }
    
    html += `
            </tbody>
        </table>
    `;
    
    deleteResult.innerHTML = html;
}

// 全选/取消全选删除学生
function selectAllDeleteStudents() {
    var selectAll = getId('selectAllDelete');
    var checkboxes = document.getElementsByName('studentDeleteCheckbox');
    
    for(var i=0; i<checkboxes.length; i++) {
        checkboxes[i].checked = selectAll.checked;
    }
}

// 更新全选状态
function updateSelectAllDeleteState() {
    var selectAll = getId('selectAllDelete');
    var checkboxes = document.getElementsByName('studentDeleteCheckbox');
    var checkedCount = 0;
    
    for(var i=0; i<checkboxes.length; i++) {
        if(checkboxes[i].checked) checkedCount++;
    }
    
    selectAll.checked = (checkedCount === checkboxes.length && checkboxes.length > 0);
}

// 删除选中的学生信息
function deleteSelectedStudents() {
    var checkboxes = document.getElementsByName('studentDeleteCheckbox');
    var selectedIds = [];
    
    for(var i=0; i<checkboxes.length; i++) {
        if(checkboxes[i].checked) {
            selectedIds.push(checkboxes[i].value);
        }
    }
    
    if(selectedIds.length === 0) {
        alert('请选择要删除的学生信息！');
        return;
    }
    
    if(confirm('确定要删除选中的'+selectedIds.length+'名学生信息吗？')) {
        // 从学生数组中删除
        students = students.filter(function(student) {
            return selectedIds.indexOf(student.Id) === -1;
        });
        
        // 更新localStorage
        localStorage.setItem('students', JSON.stringify(students));
        
        // 重新显示学生信息
        showAllStudentsForDelete();
        
        // 同时更新成绩管理表格
        initStudentTable();
        
        alert('删除成功！');
    }
}

// 学生信息统计功能
function showStudentStatistics() {
    var statisticsResult = getId('statisticsResult');
    
    if(students.length === 0) {
        statisticsResult.innerHTML = '<p style="text-align: center; color: red; padding: 20px;">暂无学生记录！</p>';
        getId('scoreChart').innerHTML = '';
        return;
    }
    
    // 计算统计数据
    var totalStudents = students.length;
    var totalEnglish = 0, totalMath = 0, totalC = 0, totalJS = 0, totalDataStruct = 0, totalSum = 0;
    
    for(var i=0; i<students.length; i++) {
        var student = students[i];
        totalEnglish += student.english;
        totalMath += student.mathe_m;
        totalC += student.c;
        totalJS += student.js;
        totalDataStruct += student.data_s;
        totalSum += student.summation();
    }
    
    // 计算平均值
    var avgEnglish = (totalEnglish / totalStudents).toFixed(2);
    var avgMath = (totalMath / totalStudents).toFixed(2);
    var avgC = (totalC / totalStudents).toFixed(2);
    var avgJS = (totalJS / totalStudents).toFixed(2);
    var avgDataStruct = (totalDataStruct / totalStudents).toFixed(2);
    var avgSum = (totalSum / totalStudents).toFixed(2);
    
    // 计算成绩分布
    var scoreDistribution = {
        '90-100': 0,
        '80-89': 0,
        '70-79': 0,
        '60-69': 0,
        '0-59': 0
    };
    
    for(var i=0; i<students.length; i++) {
        var score = students[i].summation();
        if(score >= 90) scoreDistribution['90-100']++;
        else if(score >= 80) scoreDistribution['80-89']++;
        else if(score >= 70) scoreDistribution['70-79']++;
        else if(score >= 60) scoreDistribution['60-69']++;
        else scoreDistribution['0-59']++;
    }
    
    // 显示统计结果
    var html = `
        <table class="table" width="95%">
            <caption style="font-size:18px; margin-bottom:10px; color:#044599; font-weight:bold;">学生信息统计</caption>
            <tbody>
                <tr>
                    <td colspan="8"><strong>学生总人数：${totalStudents}人</strong></td>
                </tr>
                <tr>
                    <th>科目</th>
                    <th>英语</th>
                    <th>高数</th>
                    <th>C语言</th>
                    <th>动态脚本</th>
                    <th>数据结构</th>
                    <th>总分</th>
                </tr>
                <tr>
                    <td><strong>平均分</strong></td>
                    <td>${avgEnglish}</td>
                    <td>${avgMath}</td>
                    <td>${avgC}</td>
                    <td>${avgJS}</td>
                    <td>${avgDataStruct}</td>
                    <td>${avgSum}</td>
                </tr>
            </tbody>
        </table>
        
        <table class="table" width="95%" style="margin-top: 20px;">
            <caption style="font-size:18px; margin-bottom:10px; color:#044599; font-weight:bold;">成绩分布统计</caption>
            <thead>
                <tr>
                    <th>分数段</th>
                    <th>人数</th>
                    <th>占比</th>
                    <th>分布图表</th>
                </tr>
            </thead>
            <tbody>
    `;
    
    for(var range in scoreDistribution) {
        var count = scoreDistribution[range];
        var percentage = (count / totalStudents * 100).toFixed(1);
        var barLength = Math.round(count / totalStudents * 100);
        
        html += `
            <tr>
                <td>${range}</td>
                <td>${count}</td>
                <td>${percentage}%</td>
                <td>
                    <div style="width: 100%; background-color: #f0f0f0; height: 20px; border-radius: 10px; overflow: hidden;">
                        <div style="width: ${barLength}%; background-color: #044599; height: 100%; text-align: right; color: white; line-height: 20px; padding-right: 5px;">${percentage}%</div>
                    </div>
                </td>
            </tr>
        `;
    }
    
    html += `
            </tbody>
        </table>
    `;
    
    statisticsResult.innerHTML = html;
    
    // 显示成绩分布图表
    showScoreChart(scoreDistribution, totalStudents);
}

// 显示成绩分布图表
function showScoreChart(scoreDistribution, totalStudents) {
    var scoreChart = getId('scoreChart');
    var html = `
        <div style="padding: 20px;">
            <table width="100%" style="border-collapse: collapse;">
                <tr>
                    <th style="width: 20%; text-align: right; padding: 10px;">分数段</th>
                    <th style="width: 80%;">人数分布</th>
                </tr>
    `;
    
    var colors = ['#044599', '#357ABD', '#66A3D2', '#99C7E9', '#CCE6F4'];
    var i = 0;
    
    for(var range in scoreDistribution) {
        var count = scoreDistribution[range];
        var percentage = (count / totalStudents * 100).toFixed(1);
        var height = Math.max(20, count / totalStudents * 200);
        
        html += `
            <tr style="vertical-align: bottom;">
                <td style="text-align: right; padding: 10px;">${range}</td>
                <td style="padding: 10px 0;text-align: center;">
                    <div style="display: inline-block; width: 60px; height: ${height}px; background-color: ${colors[i % colors.length]}; margin: 0 10px; position: relative;">
                        <div style="position: absolute; bottom: -25px; left: 0; width: 100%; text-align: center;">${count}</div>
                    </div>
                </td>
            </tr>
        `;
        
        i++;
    }
    
    html += `
            </table>
        </div>
    `;
    
    scoreChart.innerHTML = html;
}

// 试题录入功能

// 从localStorage加载试题数据
var questions = JSON.parse(localStorage.getItem('questions')) || [];

// 更新题目类型
function updateQuestionType() {
    var form = document.questionForm;
    var questionType = form.questionType.value;
    var optionARow = getId('optionARow');
    var optionBRow = getId('optionBRow');
    var optionCRow = getId('optionCRow');
    var optionDRow = getId('optionDRow');
    var answerInput = getId('answerInput');
    
    if (questionType === 'subjective') {
        // 隐藏选项
        optionARow.style.display = 'none';
        optionBRow.style.display = 'none';
        optionCRow.style.display = 'none';
        optionDRow.style.display = 'none';
        // 清空正确答案输入
        answerInput.innerHTML = '<input type="text" name="correctAnswer" class="ui_txt" style="width: 80%;" placeholder="主观题参考答案">';
    } else {
        // 显示选项
        optionARow.style.display = 'table-row';
        optionBRow.style.display = 'table-row';
        optionCRow.style.display = 'table-row';
        optionDRow.style.display = 'table-row';
        
        if (questionType === 'single') {
            // 单选题使用单选按钮
            answerInput.innerHTML = `
                <input type="radio" name="correctAnswer" value="A">A
                <input type="radio" name="correctAnswer" value="B">B
                <input type="radio" name="correctAnswer" value="C">C
                <input type="radio" name="correctAnswer" value="D">D
            `;
        } else {
            // 多选题使用复选框
            answerInput.innerHTML = `
                <input type="checkbox" name="correctAnswer" value="A">A
                <input type="checkbox" name="correctAnswer" value="B">B
                <input type="checkbox" name="correctAnswer" value="C">C
                <input type="checkbox" name="correctAnswer" value="D">D
            `;
        }
    }
}

// 添加试题
function addQuestion() {
    var form = document.questionForm;
    var questionType = form.questionType.value;
    var questionContent = form.questionContent.value.trim();
    var correctAnswer;
    
    if (questionContent === '') {
        getId('questionInfo').innerHTML = '<p style="text-align: center; color: red; padding: 10px;">题目内容不能为空！</p>';
        return;
    }
    
    if (questionType === 'subjective') {
        correctAnswer = form.correctAnswer.value.trim();
        if (correctAnswer === '') {
            getId('questionInfo').innerHTML = '<p style="text-align: center; color: red; padding: 10px;">参考答案不能为空！</p>';
            return;
        }
    } else {
        var options = {
            A: form.optionA.value.trim(),
            B: form.optionB.value.trim(),
            C: form.optionC.value.trim(),
            D: form.optionD.value.trim()
        };
        
        // 检查选项是否为空
        for (var opt in options) {
            if (options[opt] === '') {
                getId('questionInfo').innerHTML = `<p style="text-align: center; color: red; padding: 10px;">选项${opt}不能为空！</p>`;
                return;
            }
        }
        
        // 获取正确答案
        if (questionType === 'single') {
            // 单选题
            var radioButtons = document.getElementsByName('correctAnswer');
            for (var i = 0; i < radioButtons.length; i++) {
                if (radioButtons[i].checked) {
                    correctAnswer = radioButtons[i].value;
                    break;
                }
            }
            if (!correctAnswer) {
                getId('questionInfo').innerHTML = '<p style="text-align: center; color: red; padding: 10px;">请选择正确答案！</p>';
                return;
            }
        } else {
            // 多选题
            var checkboxes = document.getElementsByName('correctAnswer');
            correctAnswer = [];
            for (var i = 0; i < checkboxes.length; i++) {
                if (checkboxes[i].checked) {
                    correctAnswer.push(checkboxes[i].value);
                }
            }
            if (correctAnswer.length === 0) {
                getId('questionInfo').innerHTML = '<p style="text-align: center; color: red; padding: 10px;">请选择至少一个正确答案！</p>';
                return;
            }
        }
    }
    
    // 创建新试题
    var newQuestion = {
        id: Date.now(),
        type: questionType,
        content: questionContent,
        answer: correctAnswer
    };
    
    // 如果不是主观题，添加选项
    if (questionType !== 'subjective') {
        newQuestion.options = {
            A: form.optionA.value.trim(),
            B: form.optionB.value.trim(),
            C: form.optionC.value.trim(),
            D: form.optionD.value.trim()
        };
    }
    
    // 添加到试题数组
    questions.push(newQuestion);
    
    // 保存到localStorage
    localStorage.setItem('questions', JSON.stringify(questions));
    
    // 显示成功信息
    getId('questionInfo').innerHTML = '<p style="text-align: center; color: green; padding: 10px;">试题添加成功！</p>';
    
    // 重置表单
    form.reset();
    
    // 更新题目类型显示
    updateQuestionType();
    
    // 刷新试题列表
    showQuestionList();
}

// 显示已录入的试题
function showQuestionList() {
    var questionList = getId('questionList');
    
    if (questions.length === 0) {
        questionList.innerHTML = '<p style="text-align: center; color: red; padding: 20px;">暂无录入的试题！</p>';
        return;
    }
    
    var html = `
        <table class="table" width="95%" style="margin-top: 20px;">
            <caption style="font-size:18px; margin-bottom:10px; color:#044599; font-weight:bold;">已录入的试题 (共${questions.length}条)</caption>
            <thead>
                <tr>
                    <th>序号</th>
                    <th>题目类型</th>
                    <th>题目内容</th>
                    <th>正确答案</th>
                    <th>操作</th>
                </tr>
            </thead>
            <tbody>
    `;
    
    for (var i = 0; i < questions.length; i++) {
        var question = questions[i];
        var typeText = {
            'single': '单选题',
            'multiple': '多选题',
            'subjective': '主观题'
        }[question.type];
        
        var answerText;
        if (question.type === 'multiple') {
            answerText = question.answer.join(',');
        } else {
            answerText = question.answer;
        }
        
        html += `
            <tr>
                <td>${i + 1}</td>
                <td>${typeText}</td>
                <td style="text-align: left; max-width: 300px; overflow: hidden; text-overflow: ellipsis;">${question.content}</td>
                <td>${answerText}</td>
                <td><a href="javascript:;" onclick="deleteQuestion(${question.id})">删除</a></td>
            </tr>
        `;
    }
    
    html += `
            </tbody>
        </table>
    `;
    
    questionList.innerHTML = html;
}

// 删除试题
function deleteQuestion(id) {
    if (confirm('确定删除该试题吗？')) {
        questions = questions.filter(function(q) { return q.id !== id; });
        localStorage.setItem('questions', JSON.stringify(questions));
        showQuestionList();
    }
}

// 主观题评阅功能

// 从localStorage加载主观题作答数据
var subjectiveAnswers = JSON.parse(localStorage.getItem('subjectiveAnswers')) || [];

// 显示待评阅的主观题
function showSubjectiveQuestions() {
    var studentSelect = document.subjectiveReviewForm.studentName;
    var students = JSON.parse(localStorage.getItem('students')) || [];
    
    // 清空学生选择下拉框
    studentSelect.innerHTML = '<option value="">请选择学生</option>';
    
    // 添加学生到下拉框
    for (var i = 0; i < students.length; i++) {
        var student = students[i];
        var option = document.createElement('option');
        option.value = student.Id;
        option.textContent = student.name;
        studentSelect.appendChild(option);
    }
    
    // 清空主观题列表
    getId('subjectiveQuestionsList').innerHTML = '';
}

// 显示学生的主观题作答
function showStudentSubjectiveQuestions() {
    var studentSelect = document.subjectiveReviewForm.studentName;
    var studentId = studentSelect.value;
    var subjectiveQuestionsList = getId('subjectiveQuestionsList');
    
    if (studentId === '') {
        subjectiveQuestionsList.innerHTML = '';
        return;
    }
    
    // 查找该学生的主观题作答
    var studentAnswers = subjectiveAnswers.filter(function(answer) {
        return answer.studentId === studentId;
    });
    
    if (studentAnswers.length === 0) {
        subjectiveQuestionsList.innerHTML = '<p style="text-align: center; color: red; padding: 20px;">该学生暂无主观题作答记录！</p>';
        return;
    }
    
    var html = `
        <table class="table" width="95%" style="margin-top: 20px;">
            <caption style="font-size:18px; margin-bottom:10px; color:#044599; font-weight:bold;">学生主观题作答</caption>
            <thead>
                <tr>
                    <th>题目</th>
                    <th>学生答案</th>
                    <th>参考答案</th>
                    <th>得分</th>
                    <th>操作</th>
                </tr>
            </thead>
            <tbody>
    `;
    
    for (var i = 0; i < studentAnswers.length; i++) {
        var answer = studentAnswers[i];
        var question = questions.find(function(q) { return q.id === answer.questionId; });
        
        if (!question) continue;
        
        html += `
            <tr>
                <td style="text-align: left; max-width: 200px; overflow: hidden; text-overflow: ellipsis;">${question.content}</td>
                <td style="text-align: left; max-width: 200px; overflow: hidden; text-overflow: ellipsis;">${answer.studentAnswer}</td>
                <td style="text-align: left; max-width: 200px; overflow: hidden; text-overflow: ellipsis;">${question.answer}</td>
                <td>
                    <input type="number" name="score" class="ui_txt" style="width: 60px;" min="0" max="10" value="${answer.score || 0}">
                </td>
                <td>
                    <a href="javascript:;" onclick="saveScore(${answer.id}, this.previousElementSibling.value)">保存</a>
                </td>
            </tr>
        `;
    }
    
    html += `
            </tbody>
        </table>
    `;
    
    subjectiveQuestionsList.innerHTML = html;
}

// 保存主观题得分
function saveScore(answerId, score) {
    for (var i = 0; i < subjectiveAnswers.length; i++) {
        if (subjectiveAnswers[i].id === answerId) {
            subjectiveAnswers[i].score = parseInt(score);
            break;
        }
    }
    
    // 保存到localStorage
    localStorage.setItem('subjectiveAnswers', JSON.stringify(subjectiveAnswers));
    
    alert('得分保存成功！');
}

// 成绩统计功能
function showScoreStatistics() {
    var scoreStatisticsResult = getId('scoreStatisticsResult');
    var students = JSON.parse(localStorage.getItem('students')) || [];
    var testHistory = JSON.parse(localStorage.getItem('testHistory')) || {};
    
    if (students.length === 0) {
        scoreStatisticsResult.innerHTML = '<p style="text-align: center; color: red; padding: 20px;">暂无学生记录！</p>';
        getId('scoreAnalysisChart').innerHTML = '';
        return;
    }
    
    // 计算统计数据
    var totalStudents = students.length;
    var totalTestScores = 0;
    var totalSubjectiveScores = 0;
    var studentScores = [];
    
    for (var i = 0; i < students.length; i++) {
        var student = students[i];
        var studentId = student.Id;
        
        // 计算课程成绩总分
        var courseTotal = student.summation();
        studentScores.push(courseTotal);
        
        // 计算测试成绩
        if (testHistory[studentId]) {
            var studentTests = testHistory[studentId];
            var testScoreSum = 0;
            for (var j = 0; j < studentTests.length; j++) {
                testScoreSum += studentTests[j].score;
            }
            totalTestScores += testScoreSum / studentTests.length;
        }
        
        // 计算主观题成绩
        var studentSubjectiveAnswers = subjectiveAnswers.filter(function(answer) {
            return answer.studentId === studentId && answer.score !== undefined;
        });
        
        if (studentSubjectiveAnswers.length > 0) {
            var subjectiveScoreSum = 0;
            for (var j = 0; j < studentSubjectiveAnswers.length; j++) {
                subjectiveScoreSum += studentSubjectiveAnswers[j].score;
            }
            totalSubjectiveScores += subjectiveScoreSum / studentSubjectiveAnswers.length;
        }
    }
    
    // 计算平均成绩
    var avgCourseScore = (studentScores.reduce(function(a, b) { return a + b; }, 0) / totalStudents).toFixed(2);
    var avgTestScore = totalTestScores > 0 ? (totalTestScores / totalStudents).toFixed(2) : 0;
    var avgSubjectiveScore = totalSubjectiveScores > 0 ? (totalSubjectiveScores / totalStudents).toFixed(2) : 0;
    
    // 计算最高分和最低分
    var maxCourseScore = Math.max.apply(null, studentScores).toFixed(2);
    var minCourseScore = Math.min.apply(null, studentScores).toFixed(2);
    
    // 计算成绩分布
    var scoreDistribution = {
        '90-100': 0,
        '80-89': 0,
        '70-79': 0,
        '60-69': 0,
        '0-59': 0
    };
    
    for (var i = 0; i < studentScores.length; i++) {
        var score = studentScores[i];
        if (score >= 90) scoreDistribution['90-100']++;
        else if (score >= 80) scoreDistribution['80-89']++;
        else if (score >= 70) scoreDistribution['70-79']++;
        else if (score >= 60) scoreDistribution['60-69']++;
        else scoreDistribution['0-59']++;
    }
    
    // 显示统计结果
    var html = `
        <table class="table" width="95%">
            <caption style="font-size:18px; margin-bottom:10px; color:#044599; font-weight:bold;">成绩统计</caption>
            <tbody>
                <tr>
                    <td colspan="2"><strong>学生总人数：${totalStudents}人</strong></td>
                </tr>
                <tr>
                    <th>统计项</th>
                    <th>数值</th>
                </tr>
                <tr>
                    <td>课程平均成绩</td>
                    <td>${avgCourseScore}</td>
                </tr>
                <tr>
                    <td>测试平均成绩</td>
                    <td>${avgTestScore}</td>
                </tr>
                <tr>
                    <td>主观题平均成绩</td>
                    <td>${avgSubjectiveScore}</td>
                </tr>
                <tr>
                    <td>课程最高成绩</td>
                    <td>${maxCourseScore}</td>
                </tr>
                <tr>
                    <td>课程最低成绩</td>
                    <td>${minCourseScore}</td>
                </tr>
            </tbody>
        </table>
        
        <table class="table" width="95%" style="margin-top: 20px;">
            <caption style="font-size:18px; margin-bottom:10px; color:#044599; font-weight:bold;">课程成绩分布</caption>
            <thead>
                <tr>
                    <th>分数段</th>
                    <th>人数</th>
                    <th>占比</th>
                    <th>分布图表</th>
                </tr>
            </thead>
            <tbody>
    `;
    
    for (var range in scoreDistribution) {
        var count = scoreDistribution[range];
        var percentage = (count / totalStudents * 100).toFixed(1);
        var barLength = Math.round(count / totalStudents * 100);
        
        html += `
            <tr>
                <td>${range}</td>
                <td>${count}</td>
                <td>${percentage}%</td>
                <td>
                    <div style="width: 100%; background-color: #f0f0f0; height: 20px; border-radius: 10px; overflow: hidden;">
                        <div style="width: ${barLength}%; background-color: #044599; height: 100%; text-align: right; color: white; line-height: 20px; padding-right: 5px;">${percentage}%</div>
                    </div>
                </td>
            </tr>
        `;
    }
    
    html += `
            </tbody>
        </table>
    `;
    
    scoreStatisticsResult.innerHTML = html;
    
    // 显示成绩分析图表
    showScoreAnalysisChart(scoreDistribution, totalStudents);
}

// 显示成绩分析图表
function showScoreAnalysisChart(scoreDistribution, totalStudents) {
    var scoreAnalysisChart = getId('scoreAnalysisChart');
    var html = `
        <div style="padding: 20px;">
            <table width="100%" style="border-collapse: collapse;">
                <tr>
                    <th style="width: 20%; text-align: right; padding: 10px;">分数段</th>
                    <th style="width: 80%;">人数分布</th>
                </tr>
    `;
    
    var colors = ['#044599', '#357ABD', '#66A3D2', '#99C7E9', '#CCE6F4'];
    var i = 0;
    
    for (var range in scoreDistribution) {
        var count = scoreDistribution[range];
        var percentage = (count / totalStudents * 100).toFixed(1);
        var height = Math.max(20, count / totalStudents * 200);
        
        html += `
            <tr style="vertical-align: bottom;">
                <td style="text-align: right; padding: 10px;">${range}</td>
                <td style="padding: 10px 0;text-align: center;">
                    <div style="display: inline-block; width: 60px; height: ${height}px; background-color: ${colors[i % colors.length]}; margin: 0 10px; position: relative;">
                        <div style="position: absolute; bottom: -25px; left: 0; width: 100%; text-align: center;">${count}</div>
                    </div>
                </td>
            </tr>
        `;
        
        i++;
    }
    
    html += `
            </table>
        </div>
    `;
    
    scoreAnalysisChart.innerHTML = html;
}