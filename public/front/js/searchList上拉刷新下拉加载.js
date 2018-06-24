

$(function(){
  var page =1;
  var pageSize =3;
  //获取地址栏的参数
  var key =getSearch().key;
  //把key设置给input框
  $(".lt_search input").val(key);
  //下拉刷新效果
  mui.init({
    pullRefresh : {
      container:".mui-scroll-wrapper",//下拉刷新容器标识，querySelector能定位的css选择器均可，比如：id、.class等
      down : {
        auto: true,//可选,默认false.首次加载自动上拉刷新一次
        callback :function(){
          //发送ajax请求
           page=1;
          render(function(info){
            var html =template("tpl",info);
            $(".lt_product").html(html);
            //结束刷新
            mui('.mui-scroll-wrapper').pullRefresh().endPulldownToRefresh();
            //重置下拉加载
            mui('.mui-scroll-wrapper').pullRefresh().refresh(true);
          });
        }, //必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
      },
      up:{
        callback:function(){
          page++;
          render(function(info){
           
            $(".lt_product").append(template("tpl",info));
            //结束刷新
            if(info.data.length===0){
              mui('.mui-scroll-wrapper').pullRefresh().endPullupToRefresh(true);
            }else{
              mui('.mui-scroll-wrapper').pullRefresh().endPullupToRefresh(false);
            }
          
          });
        }
      }
    }
  });

  //点击按钮需下拉刷新一次
$(".lt_search button").on("click",function(){
  //重置所有now和箭头的方向
  $(".lt_sort li").removeClass("now");
  $(".lt_sort span").removeClass("fa-angle-up").addClass("fa-angle-down");
  key =$(".lt_search input").val();
  console.log(key);
  mui('.mui-scroll-wrapper').pullRefresh().pulldownLoading();
});

//点击排序 下拉刷新
$(".lt_sort li[data-type]").on("tap",function(){//mui上拉下拉刷新禁用了click事件所以用tap
  console.log("1");
  var $this =this;
  if($(this).hasClass("now")){
    $(this).find("span").toggleClass("fa-angle-down").toggleClass("fa-angle-up");
  }else{
    $(this).addClass("now").siblings().removeClass("now");
    //让所有sapn下的箭头都向下
    $(".lt_sort li span").addClass("fa-angle-down").removeClass("fa-angle-up");
  }
      //手动下拉刷新
      mui('.mui-scroll-wrapper').pullRefresh().pulldownLoading();
});
  function render(callback){
    var obj ={};
      obj.page=page;
      obj.pageSize=pageSize;
      obj.proName=key;
      //判断li有没有被点 有没有now这个类
    //判读是否需要添加price或者num这个参数
    var $select =$(".lt_sort li.now")
    if($select.length>0){
      console.log("需要排序");
      var type =$select.data('type');
      var value =$select.find("span").hasClass("fa-angle-down")?2:1;
       //给参数增加了一个属性，属性可以能是price，也可以能是num
       obj[type]=value;
    }else{
      console.log("不需要排序");
    }
    $.ajax({
      type :'get',
      url :'/product/queryProduct',
      data :obj,
      success:function(info){
        //console.log(info);
       setTimeout(function(){//这里是为了给用户制造进来就有刷新的效果 假设获取数据需要1s
        callback(info);
       },1000);
      }
    });
  }
});

