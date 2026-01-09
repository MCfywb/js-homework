function getId(id) {
    return document.getElementById(id);
}

window.onload = function() {
    // 页面居中逻辑
    var login = getId('login');
    
    function centerLogin() {
        var w = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
        var h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
        var top = (h - 260) / 2;
        var left = (w - 560) / 2;
        login.style['top'] = top + 'px';
        login.style['left'] = left + 'px';
    }

    centerLogin(); // 初始化居中

    window.onresize = function() {
        centerLogin(); // 窗口改变大小时重新居中
    };

    // 表单验证逻辑
    var userInfo = getId('userInfo');
    var passInfo = getId('passInfo');

    function formCheck(o, rule, info) {
        if (rule.test(o.value)) {
            o.nextElementSibling.innerHTML = '&radic;';
            o.nextElementSibling.style.color = '#008000';
        } else {
            o.nextElementSibling.style.color = 'red';
            o.nextElementSibling.innerHTML = info;
        }
    }

    var uname = document.logform.user;
    var pass = document.logform.pass;

    uname.onblur = function() {
        formCheck(this, /^[0-9a-zA-Z]{3,14}$/, '4-15 数字或字母组成');
    };
    pass.onblur = function() {
        formCheck(this, /^\w{6,12}$/, '6-12 位数字/字母/英文符号');
    };

    // 登录发送逻辑
    // 登录发送逻辑
    var send = getId('send');
    send.onclick = function() {
        // 1. 获取当前输入值
        var uValue = uname.value;
        var pValue = pass.value;
        var rol = 0; // 默认学生
        if (document.logform.role[1].checked) {
            rol = 1; // 教师
        }
    
        // 2. 验证逻辑：添加了学生账户判断
        var isTeacher = (uValue === 'lily' && pValue === '123456' && rol === 1);
        var isStudent = (uValue === 'student' && pValue === '123456' && rol === 0);
    
        if (isTeacher || isStudent) {
            // 验证通过：将用户信息存入 localStorage 以供 online.html 使用
            localStorage.username = uValue; 
            localStorage.role = rol;
            
            alert("登录成功！点击跳转。");
            location.href = "online.html";
    
        } else {
            // 验证失败：显示错误信息
            getId('erro').innerHTML = '<h6>账号或密码有误, 请重新输入! </h6>';
        }
    };
};