
//二级分类
$(function(){
  var page =1;
  var pageSize=5;
  render();
  function render(){
    $.ajax({
      type :'get',
      url:'/category/querySecondCategoryPaging',
      data:{
        page:page,
        pageSize:pageSize
      },
      success:function(info){
       // console.log(info);
        var html =template("tpl",info);
        $("tbody").html(html);
        //分页功能
        $("#paginator").bootstrapPaginator({
          bootstrapMajorVersion:3,//指定boostrap的版本
          currentPage:page,//指定当前页
          totalPages:Math.ceil(info.total/info.size),//设置总页数
          size:"small",//设置大小
          onPageClicked:function(a,b,c,p){
            page=p;
            render();
          }
        });
      }
    });
  }
  //添加功能
  $(".btn-add").on("click",function(){
   // console.log("hh");
    $("#addModal").modal("show");
    //发送ajax请求
    $.ajax({
      type:'get',
      url:'/category/querySecondCategoryPaging',
      data:{
        page:1,
        pageSize:100
      },
      success:function(info){
        console.log(info);
        var html =template("tpl2",info);
        $(".dropdown-menu").html(html);
      },
    });
  });

  //一级选择功能
  $(".dropdown-menu").on("click","a",function(){
    //console.log("hh");
    var txt =$(this).text();
    $(".dropdown-text").text(txt);
    var id = $(this).data("id");
    //console.log(id);
    //获取到id 设置给categoryId这个隐藏域
    $("[name='categoryId']").val(id);
    //让隐藏的categoryId的校验通过
    console.log("22");
    // var form = $("form").data("bootstrapValidator");
    // console.log(form);
    $("form").data("bootstrapValidator").updateStatus("categoryId", "VALID");
  });
  
  //图片上传功能
  $("#fileupload").fileupload({
    dataType:'json',
    done:function(e,data){
      // console.log(data,result,picAddr);
      $(".img_box img").attr("src",data.result.picAddr);
      $("[name=brandLogo]").val(data.result.picAddr);
      //让brandLogo的校验通过
      $("form").data("bootstrapValidator").updateStatus("brandLogo","VALID");
    }
  });
  //设置表单校验规则
  $("form").bootstrapValidator({
    //excluded:指定不校验的类型，[]所有的类型都校验
    excluded: [],
    //小图标样式
    feedbackIcons: {
      valid: 'glyphicon glyphicon-thumbs-up',
      invalid: 'glyphicon glyphicon-remove',
      validating: 'glyphicon glyphicon-refresh'
    },
    fields: {
      categoryId: {
        validators: {
          notEmpty: {
            message: '请选择一级分类'
          }
        }
      },
      brandName: {
        validators: {
          notEmpty: {
            message: '请输入二级分类的名称'
          }
        }
      },
      brandLogo: {
        validators: {
          notEmpty: {
            message: '请上传二级分类的图片'
          }
        }
      }
    },
  });
  //给表单注册校验成功的事件，重置表单样式，阻止表单的跳转发送ajax请求、
  $("form").on("success.form.bv",function(e){
    e.preventDefault();
    $.ajax({
      type:'post',
      url:'/category/addSecondCategory',
      data:$("form").serialize(),
      success:function(info){
        console.log(info);
        if(info.success){
          //隐藏模态框
          $("#addModal").modal("hide");
          //重新渲染第一页
          page=1;
          render();
          //重置表单
          $("form").data("bootstrapValidator").resetForm(true);
          $(".dropdown-text").text("请选择一级分类");
          $(".img_box img").attr("src","images/none.png");
        }
      }
    });
  });
});