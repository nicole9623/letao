
$(function(){
  //发送ajax请求，动态渲染一级分类
  $.ajax({
    type :'get',
    url :'/category/queryTopCategory',
    success:function(info){
      //console.log(info);
      var html =template('tpl',info);
      $(".caterory_left ul").html(html);

      //获取到一级分类 渲染了第一个一级分类对应的二级分类
      renderSecond( info.rows[0].id);
    }
  });



  //点击一级分类 动态渲染二级分类
  $(".caterory_left").on("click","li",function(){
    //让当前的li有now这个类其他的移除这个类
    //console.log("hh");
    $(this).addClass("now").siblings().removeClass("now");
    var id =$(this).data("id");
    //console.log(id);
    renderSecond(id);
    //让右边的滚动容器滚动到0 0 的位置
    mui('.category_right .mui-scroll-wrapper').scroll().scrollTo(0,0,1000);//100毫秒滚动到顶
  });



  //渲染二级分类 一级分类的id
  function renderSecond(id){
    //发送ajax请求
    $.ajax({
      type:'get',
      url:'/category/querySecondCategory',
      data :{
        id:id
      },
      success:function(info){
        console.log(info);
        var html =template("tpl2",info);
        $(".category_right ul").html(html);
      }
    });
  }
});