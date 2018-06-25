

$(function(){
  $.ajax({
    type :'get',
    url :'/user/queryUserMessage',
    success:function(info){
      console.log(info);
      if(info.error){
        window.location.href="login.html";
      }
      var html =template("tpl",info);
      $(".userinfo").html(html);
    }
  });
  //退出功能
  $(".btn_logout").on("click",function(){
    $.ajax({
      type:'get',
      url:'/user/logout',
      success:function(info){
        console.log(info);
        if(info.success){
          location.href="login.html";
        }
      }
    });
  });

});