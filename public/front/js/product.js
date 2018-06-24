

$(function(){
  //获取地址栏中的productId的值
  var productId =getSearch().productId;
  //发送ajax 请求
  $.ajax({
    type  :'get',
    url :'/product/queryProductDetail',
    data :{
      id:productId
    },
    success: function (info) {
      //console.log(info);
      var html = template("tpl", info);
      $(".mui-scroll").html(html);
      //重新初始化轮播图的结构
      mui(".mui-slider").slider({
        interval: 3000
      });
      //尺码选择功能
      $(".lt_size span").on("click",function(){
        //console.log("22");
        $(this).addClass("now").siblings().removeClass("now");
      });
      //初始化numbox
      mui(".mui-numbox").numbox();
    },
    
  });
  //加入购物车功能
  //给加入购物车按钮注册点击事件
  //获取产品的数量，尺码，id 发送ajax请求
  $(".add_cart").on("click",function(){
   // console.log("22");
    var size =$(".lt_size span.now").text();
    var num =$(".mui-numbox-input").val();
    if(!size){
      mui.toast("请选择尺码");
      return;
    }
    $.ajax({
      type:'post',
      url:'/cart/addCart',
      data:{
        productId:productId,
        size:size,
        num:num
      },
      success:function(info){
        console.log(info);
       // 如果用户没有登录 跳转到登陆页面 再给一个回跳地址 这个回跳地址会在登录页面做切割处理
        if(info.error===400){
          window.location.href="login.html?back="+location.href;
        }
        //如果用户登录了，给用户一个提示，登录成功
        if(info.success){
          mui.confirm("添加成功","温馨提示",["去购物车","继续浏览"],function(e){
            if(e.index===0){
              location.href="cart.html";
            }
          });
        }
      }
    });
  });
});