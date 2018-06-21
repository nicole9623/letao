
$(function(){
  //查询功能
  var page =1;
  var pageSize =5;
  var imgs =[];
  render();
  function render(){
    $.ajax({
      type: 'get',
      url: '/product/queryProductDetailList',
      data: {
        page:page,
        pageSize:pageSize
      },
      success:function(info){
        //console.log(info);
        var html =template("tpl",info);
        $("tbody").html(html);

          //分页功能
        $("#paginator").bootstrapPaginator({
          bootstrapMajorVersion: 3,//指定boostrap版本号
          currentPage: page,//设置当前页
          totalPages: Math.ceil(info.total / info.size),//设置总页数
          size: "small",//设置控件大小
          itemTexts:function( type, page){//把控件上的英文改成中文
            switch (type){
              case 'first':
              return '首页';
              case "prev":
              return '上一页';
              case "next":
              return '下一页';
              case "last":
              return '尾页';
              case 'page':
              return page;
            }
          },
          tooltipTitles:function(type ,page){
            switch (type){//设置鼠标悬停时的文字
              case 'first':
              return '首页';
              case "prev":
              return '上一页';
              case "next":
              return '下一页';
              case "last":
              return '尾页';
              case 'page':
              return page;
            }
          },
          useBootstrapTooltip:true,//鼠标讯悬停时文字有样式
          bootstrapTooltipOptions:{
            placement:'bottom'//鼠标悬停是文字在下方显示
          },
          onPageClicked: function (a, b, c, p) {//控件的点击事件
            page = p;
            render();
          }
        });
      }
    });
  }
  //添加功能
  $(".btn-add").on("click",function(){
    $("#addModal").modal("show");
    //获取二级分类的数据发送ajax请求
    $.ajax({
      type:'get',
      url:'/category/querySecondCategoryPaging',
      data:{
        page:1,
        pageSize:100
      },
      success:function(info){
        //console.log(info);
        var html =template("tpl2",info);
        $(".dropdown-menu").html(html);
      }
    });
  });
  //给动态生成的a注册点击事件 a是动态生成的 所以要注册委托事件
  $(".dropdown-menu").on("click","a",function(){
    //获取到a的文本内容
    var txt =$(this).text();
    $(".dropdown-text").text(txt);
    //获取到id
    var id =$(this).data("id");
    $("[name=brandId]").val(id);
    //手动校验通过
    $("form").data("bootstrapValidator").updateStatus("brandId","VALID")
  });
  //上传图片
  $("#fileupload").fileupload({
    //每张图片上传成功 done就会执行一次
    done:function(e,data){
      console.log(data.result);
      if(imgs.length>=3){
        return;
      }
      imgs.push(data.result);
        $(".img_box").append('<img src="'+ data.result.picAddr+'" width="100" alt="">')
        if(imgs.length===3){
          $("form").data("bootstrapValidator").updateStatus("tips","VALID");
        }else{
          $("form").data("bootstrapValidator").updateStatus("tips","INVALID");
        }
      }
  });
  //表单校验功能
  $("form").bootstrapValidator({
     //1. 指定不校验的类型，默认为[':disabled', ':hidden', ':not(:visible)'],可以不设置
      excluded:[],
      //指定校验的图标显示 默认是bootstap风格
      feedbackIcons: {
        valid: 'glyphicon glyphicon-ok',
        invalid: 'glyphicon glyphicon-remove',
        validating: 'glyphicon glyphicon-refresh'
      },
    //3. 指定校验字段
    fields: {
      //校验用户名，对应name表单的name属性
      brandId: {
        validators: {
          //不能为空
          notEmpty: {
            message: '请选择二级分类'
          }
        }
      },
      proName: {
        validators: {
          //不能为空
          notEmpty: {
            message: '请输入商品的名称'
          }
        }
      },
      proDesc: {
        validators: {
          //不能为空
          notEmpty: {
            message: '请输入商品的描述'
          }
        }
      },
      num: {
        validators: {
          notEmpty: {
            message: '请输入商品的库存'
          },
          //正则校验 必须是数字类型的
          regexp: {
            regexp: /^[1-9]\d{0,4}$/,
            message: '请输入正确的库存(1-999)'
          }
        }
      },
      size: {
        validators: {
          notEmpty: {
            message: '请输入商品的尺寸(30-50)'
          },
          regexp: {
            regexp:/^\d{2}-\d{2}$/,
            message: '请输入正确的尺码范围(xx-xx)'
          }
        }
      },
      oldPrice: {
        validators: {
          notEmpty: {
            message: '请输入商品的原价'
          }
        }
      },
      price: {
        validators: {
          notEmpty: {
            message: '请输入商品的现价'
          }
        }
      },
      tips: {
        validators: {
          notEmpty: {
            message: '请上传三张图片'
          }
        }
      },
    },
  });
  //表单校验成功
  $("form").on("success.form.bv",function(e){
    //阻止表单跳转
    e.preventDefault();
    var param =$('form').serialize();
    // console.log(param);
    // console.log(imgs);
    param +="&picName1" +imgs[0].picName+"&picAddr1"+imgs[0].picAddr;
    param +="&picName2" +imgs[1].picName+"&picAddr2"+imgs[0].picAddr;
    param +="&picName3" +imgs[2].picName+"&picAddr3"+imgs[0].picAddr;
    //发送ajax请求
    $.ajax({
      type:'post',
      url:'/product/addProduct',
      data:param,
      success:function(info){
        console.log(info);
        if(info.success){
          page=1;
          render();
          //重置表单
          $("form").data("bootstrapValidator").resetForm(true);
          //把按钮的文字重置
          $(".dropdown-text").text("请选择二级分类");
          $(".img_box img").remove();

          //重置数组
          imgs = [];
        }
      }
    });

  });

});