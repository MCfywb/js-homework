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
            return true;
        } else {
            o.nextElementSibling.style.color = 'red';
            o.nextElementSibling.innerHTML = info;
            return false;
        }
    }

    var uname = document.logform.user;
    var pass = document.logform.pass;

    // 实时验证（输入时）
    uname.oninput = function() {
        formCheck(this, /^[0-9a-zA-Z]{3,14}$/, '3-14位数字或字母组成');
        getId('erro').innerHTML = ''; // 清除登录错误信息
    };
    
    uname.onblur = function() {
        formCheck(this, /^[0-9a-zA-Z]{3,14}$/, '3-14位数字或字母组成');
    };
    
    pass.oninput = function() {
        formCheck(this, /^\w{6,12}$/, '6-12位数字/字母/英文符号');
        getId('erro').innerHTML = ''; // 清除登录错误信息
    };
    
    pass.onblur = function() {
        formCheck(this, /^\w{6,12}$/, '6-12位数字/字母/英文符号');
    };

    // 回车键登录功能
    document.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            loginSubmit();
        }
    });

    // 登录验证函数
    function loginSubmit() {
        // 先进行表单验证
        var isUserValid = formCheck(uname, /^[0-9a-zA-Z]{3,14}$/, '3-14位数字或字母组成');
        var isPassValid = formCheck(pass, /^\w{6,12}$/, '6-12位数字/字母/英文符号');
        
        if (!isUserValid || !isPassValid) {
            getId('erro').innerHTML = '<h6>请检查输入格式是否正确！</h6>';
            return;
        }
        
        // 1. 获取当前输入值
        var uValue = uname.value;
        var pValue = pass.value;
        var rol = 0; // 默认学生
        if (document.logform.role[1].checked) {
            rol = 1; // 教师
        }
    
        // 2. 验证逻辑：使用localStorage中的用户密码进行验证
        var users = JSON.parse(localStorage.getItem('users')) || {
            'lily': '123456',
            'student': '123456'
        };
        
        var isTeacher = (uValue === 'lily' && pValue === users['lily'] && rol === 1);
        var isStudent = (uValue === 'student' && pValue === users['student'] && rol === 0);
    
        if (isTeacher || isStudent) {
            // 验证通过：将用户信息存入 localStorage 以供 online.html 使用
            localStorage.username = uValue; 
            localStorage.role = rol;
            // 存储登录时间
            localStorage.loginTime = new Date().toLocaleString();
            // 存储用户密码信息
            var users = JSON.parse(localStorage.getItem('users')) || {
                'lily': '123456',
                'student': '123456'
            };
            localStorage.setItem('users', JSON.stringify(users));
            
            // 添加简单的加载动画效果
            var sendBtn = getId('send');
            var originalText = sendBtn.value;
            sendBtn.value = '登录中...';
            sendBtn.disabled = true;
            
            setTimeout(function() {
                location.href = "online.html";
            }, 500);
    
        } else {
            // 验证失败：显示错误信息
            getId('erro').innerHTML = '<h6>账号或密码有误, 请重新输入! </h6>';
            // 密码框清空并聚焦
            pass.value = '';
            pass.focus();
        }
    }
    
    // 登录按钮点击事件
    var send = getId('send');
    send.onclick = loginSubmit;
};