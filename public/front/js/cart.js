$(function(){
  mui.init({
    pullRefresh : {
      container:".mui-scroll-wrapper",//下拉刷新容器标识，querySelector能定位的css选择器均可，比如：id、.class等
      down : {
        auto: true,//可选,默认false.首次加载自动下拉刷新一次
        callback :function(){
          //必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
          //发送ajax获取商品的数据
          $.ajax({
            type: 'get',
            url: '/cart/queryCart',
            success: function (info) {
              setTimeout(function () {
                console.log(info);
                if (info.error) {
                  location.href = "login.html?back=" + location.href;
                }
                var html = template("tpl", { rows: info });
                $("#OA_task_2").html(html);
                //结束下拉刷新
                mui(".mui-scroll-wrapper").pullRefresh().endPulldownToRefresh();
              }, 1000);
            }
          });
      }
    }
  }
  });
  //删除功能
  //给删除按钮注册点击事件
  //获取到删除按钮的id
  $("#OA_task_2").on("tap",".btn_delete",function(){
    var id = $(this).data("id");
    // console.log(id);
    mui.confirm("你确定要删除这个商品吗", "温馨提示", ["是", "否"], function (e) {
      //console.log(e);
      if (e.index === 0) {
        //发送ajax请求删除数据
        $.ajax({
          type: 'get',
          url: '/cart/deleteCart',
          data: {
            id: id
          },
          success: function (info) {
            //console.log(info);
            //重新下拉
            mui(".mui-scroll-wrapper").pullRefresh().pulldownLoading();
          }
        });
      }
    });
  });
  //计算总金额
  $("#OA_task_2").on("change",".ck",function(){
    //console.log("22");
    var total =0;
    //遍历选中的checked
    $(".ck:checked").each(function(){
      total+=$(this).data("price")*$(this).data("num");
    });
    //显示到订单总金额上
    $(".lt_money span").text(total.toFixed(2));
  });
  //修改功能
  //给修改按钮注册点击事件
  //获取到id
  //根据id原来的信息显示出来
  //用户进行修改
  //发送ajax请求 修改数据
  //动态渲染模态框
  //重新下拉刷新一次
  $("#OA_task_2").on("tap",".btn_edit",function(){
   // console.log("22");
   var data =this.dataset;
   //console.log(data);
   var html =template("tpl2",data);
   //需要把 html中所有换行的字符干掉
   var html =html.replace(/\n/g,"");
   //console.log(html);
   mui.confirm(html,"编辑商品",["确定","取消"],function(e){
     //console.log(e);
     //点击确定的时候需要需要修改数据
     if(e.index===0){
       var id =data.id;
       var num=$(".mui-numbox-input").val();
       var size =$(".lt_size span.now").text();
       //发送ajax请求
       $.ajax({
         type:'post',
         url:'/cart/updateCart',
         data:{
           id:id,
           num:num,
           size:size
         },
         success:function(info){
           //console.log(info);
           if(info.success){
             //重新下拉刷新
            mui('.mui-scroll-wrapper').pullRefresh().pulldownLoading();
           }
         }
       });
     }
   });
   //能够修改数量
   mui(".mui-numbox").numbox();
   //能够修改尺码
   $(".lt_size span").on("click",function(){
     $(this).addClass("now").siblings().removeClass("now");
   });
  });
});