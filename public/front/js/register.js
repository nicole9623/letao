$(function(){
//获取验证码
//获取到手机号
//校验 手机号不能为空 手机号格式要正确 密码不能为空 
 //给获取验证按钮注册点击事件 获取验证码 发送ajax请求
 // 开启倒计时
$(".getCode").on("click",function(){
//console.log("22");
var mobile =$("[name='mobile']").val();
if(mobile===''){
  mui.toast("请输入手机号");
  return;
}
if(!/^1\d{10}$/.test(mobile)){
  mui.toast("手机号码格式错误");
  return;
}
//禁用按钮
$(this).text("发送中...").prop("disabled",true).addClass("disabled");
$.ajax({
  type :'get',
  url :'/user/vCode',
  success:function(info){
    console.log(info);
    //开启倒计时
    var count =5;
    var timeId=setInterval(function(){
      count--;
     $(".getCode").text(count+"秒后再次发送");
     if(count<=0){
       //清除定时器
       clearInterval(timeId);
       //恢复按钮
       $('.getCode').text("获取验证码").prop("disabled",false).removeClass("disabled");
     }
    },1000);
  }
});

});

 //2注册功能
 //给注册按钮注册点击事件
 //表单校验
 //发送ajax请求
 //成功跳到登录页面
 $(".btn-register").on("click",function(){
   var username =$("[name='username']").val();
   var password =$("[name='password']").val();
   var repass =$("#repass").val();
   var mobile =$("[name='mobile']").val();
   var vCode =$("[name='vCode']").val();
   if(!username){
     mui.toast("用户名不能为空");
     return;
   }
   if(!password){
    mui.toast("用户密码不能为空");
    return;
   }
   if(password!=repass){
     mui.toast("用户密码和确认密码不一样");
     return;
   }
   if(mobile===''){
     mui.toast("手机号不能为空");
     return;
   }
   if(!/^1\d{10}$/.test(mobile)){
     mui.toast("手机号码格式错误");
     return;
   }
   if(!/^\d{6}$/.test(vCode)){
     mui.toast("验证码格式错误");
     return;
   }
   //发送ajax请求
   $.ajax({
     type:'post',
     url:'/user/register',
     data:$("form").serialize(),
     success:function(info){
       console.log(info);
       if(info.error){
         mui.toast(info.message);
       }
       if(info.success){
         mui.toast("恭喜你注册成功,3秒后跳转到登陆页面");
        setTimeout(function(){
          location.href="login.html";
        },3000);
       }
     }
   });
 });
});