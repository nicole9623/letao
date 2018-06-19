/*  表单校验 */
//入口函数
$(function(){
  //初始化表单校验，找到所有表单 ，调用bootstrapValidator方法
  $("form").bootstrapValidator({
    //配置校验的字段
    fields:{
      //对应表单中的name属性
      username:{
        //配置用户名的具体校验规则
          validators:{
              notEmpty:{
                  message:"用户名不能为空"
              },
              stringLength:{
                  min:4,
                  max:9,
                  message:"用户名长度是4-9位"
              },
          }
      },
      password: {
        validators:{
          notEmpty:{
            message:"用户密码不能为空"
          },
          stringLength:{
            min:6,
            max:12,
            message:"用户密码是6-12位"
          },
          callback:{
            message:"用户密码不正确"
          },
        }
      },
    },
    //设置成功失败时的小图标
      //设置小图标
      feedbackIcons: {
        valid: 'glyphicon glyphicon-ok',
        invalid: 'glyphicon glyphicon-remove',
        validating: 'glyphicon glyphicon-refresh'
      },
  });

//表单校验成功,注册表单校验成功的事件，阻止默认，使用ajax提交
$("form").on("success.form.bv", function(e){
  //阻止表单的默认提交
  e.preventDefault();
  //使用ajax进行提交
    $.ajax({
      type: "post",
      url: "/employee/employeeLogin",
      data: $("form").serialize(),
      dataType: "json",
      success: function (info) {
        if (info.success) {
          //console.log(info);
          location.href = "index.html";
        }
        if (info.error === 1000) {
          //手动让username校验失败
          //参数1： 更新哪个字段
          //参数2： 更新为什么状态  INVALID  VALID
          $("form").data("bootstrapValidator").updateStatus("username", "INVALID", "callback");
        }
        if (info.error === 1001) {
          $("form").data("bootstrapValidator").updateStatus("password", "INVALID", "callback");
        }
      }

    });
  })

  

//重置表单样式
  $("[type='reset']").on("click",function(){
     //获取到表单校验插件的实例，通过这个实例就可以调用插件提供的很多方法
    //resetForm(true): 重置表单所有的样式以及内容
    $("form").data("bootstrapValidator").resetForm(true);
  });
});