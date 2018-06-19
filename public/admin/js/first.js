
//一级分类页
$(function(){
  var page =1;
  var pageSize =8;
  render();
  function render(){
  $.ajax({
    type:'get',
    url: '/category/queryTopCategoryPaging',
    data:{
      page:page,
      pageSize:pageSize
    },
    success:function(info){
    //console.log(info);
      var html =template("tpl",info);
      $("tbody").html(html);
      //分页功能
      $("#paginator").bootstrapPaginator({
        bootstrapMajorVersion:3,//指定boostrap版本
        currentPage:page,//指定当前页
        totalPages:Math.ceil(info.total/info.size),//设置总页数
        size:'small',//设置大小
        onPageClicked:function(a,b,c,p){
          //console.log("222");
          page=p;
          render();
        }
      });
    }
  });
}
  //添加功能
  $(".btn-add").on("click",function(){
    //显示模态框
    //console.log("22");
    $("#addModal").modal("show");
  });
  //表单校验
  $("form").bootstrapValidator({
        //设置成功失败时的小图标
      //设置小图标
      feedbackIcons: {
        valid: 'glyphicon glyphicon-ok',
        invalid: 'glyphicon glyphicon-remove',
        validating: 'glyphicon glyphicon-refresh'
      },
         //配置校验的字段
    fields:{
      //对应表单中的name属性
      categoryName:{
        //配置用户名的具体校验规则
          validators:{
              notEmpty:{
                  message:"一级分类的名称不能为空"
              },
              stringLength:{
                  min:4,
                  max:9,
                  message:"一级分类的名称长度是4-9位"
              },
          }
      }, 
    },
  });
  //给表单注册校验成功的事件
  $("form").on("success.form.bv", function(e){
    //阻止表单的默认提交
    e.preventDefault();
    //发送ajax提交数据
    $.ajax({
      type:'post',
      url:'/category/addTopCategory',
      data:$("form").serialize(),
      success:function(info){
        //console.log(info);
        if(info.success){
          //隐藏模态框
          $("#addModal").modal("hide");
          //重新渲染第一页
          page=1,
          render();
          $("form").data("bootstrapValidator").resetForm(true);
        }
      }
    });
  });
});