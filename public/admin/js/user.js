
//动态渲染数据
$(function () {
  var page = 1;
  var pageSize = 8;
  render();
  function render() {
    $.ajax({
      type: 'get',
      url: '/user/queryUser',
      data: {
        page: page,
        pageSize: pageSize
      },
      success: function (info) {
        //console.log(info);
        var html = template("tpl", info);
        $("tbody").html(html);
        $("#pagination").bootstrapPaginator({
          bootstrapMajorVersion:3,//指定boostrap的版本
          currentPage:page,//指定当前页
          totalPages:Math.ceil(info.total/info.size),//设置总页数
          size:'small',//设置大小
          onPageClicked:function(a,b,c,p){
            page=p,
            render();
          }
        });
      }
    });
  }
  //给启用或者禁用按钮注册点击事件 1启用 0禁用
  //注册委托事件 
  $("tbody").on("click",".btn",function(){
    //console.log("22");
    $("#userModal").modal("show");
    var id =$(this).parent().data("id");
    //取决于点的是启用按钮还是禁用按钮
    var isDelete=$(this).hasClass("btn-success")?1:0;
    //console.log(id,isDelete);
    //给确定按钮注册点击事件
    $(".btn_update").off().on("click",function(){
      //发送ajax请求
      $.ajax({
        type:'post',
        url:'/user/updateUser',
        data:{
          id:id,
          isDelete:isDelete
        },
        success:function(info){
         // console.log(info);
         if(info.success){
           //关闭模态框 
           $("#userModal").modal("hide");
           //重新渲染
           render();
         }
        }
      });
    });
  });
});