
// 所有通用的js
//登录时页面顶部的进度条
//禁用进度条
NProgress.configure({ showSpinner: false });
//注册一个全局的ajaxStart事件，所有的ajax在开启的时候，会触发这个事件
$(document).ajaxStart(function(){
  //开启进度条
  NProgress.start();
});
$(document).ajaxStart(function(){
  //完成进度条
  setTimeout(function(){
    NProgress.done();
  },500);
});

//一级分类二级分类显示与隐藏功能
$(".child").prev().on("click",function(){
 // console.log(11);
 $(this).next().slideToggle();
});
//点击切换按钮显示与隐藏
$(".icon_menu").on("click",function(){
  $(".lt_aside").toggleClass("now");
  $(".lt_main").toggleClass("now");
});

//退出功能能，点击退出按钮 模态框显示 确定退出时要要退出登录
$(".icon_logout").on("click",function(){
  $("#logoutModal").modal("show");
});
//点击退出按钮立即
$(".btn_logout").on("click",function(){
  //退出 跳转到登录页
  $.ajax({
    type:'get',
    url:"/employee/employeeLogout",
    success:function(info){
      console.log(info);
      if(info.success){
        location.href='login.html';
      }
    }
  });
  
});