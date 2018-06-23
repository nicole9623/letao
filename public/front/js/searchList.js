

 $(function(){
  //获取地址栏中的参数


  var page =1;
  var pageSize =10;

  var key =getSearch().key;
  //把key设置给input框
  $(".lt_search input").val(key);
  //重新渲染
    render();

  //点击搜索按钮，渲染
  //1. 给按钮注册点击事件
  //2. 获取到文本框的值
  //3. 重新渲染
  $(".lt_search button").on("click",function(){
    //当点击搜索按钮的时候，需要把排序的样式重置
    //把所有的li的now的类全部清掉
    //console.log("33");
    $(".lt_sort li").removeClass("now");
    $(".lt_sort span").removeClass("fa-angle-up").addClass("fa-angle-down");
    key =$(".lt_search input").val();
    render();
  });

  //点击排序的按钮（价格或者是库存），重新发送ajax请求
  //如果点了价格进行排序，需要多传一个参数，price: 1或者是2
  //如果点了库存进行排序，需要多传一个参数，num: 1或者是2

  //如果当前的li没有now这个类，让当前的li有now这个类，并且让其他的li没有now这个类,让所有的span的箭头都初始向下
  //如果当前li有now这个类，修改当前li下的span的箭头的类
 

  $(".lt_sort li[data-type]").on("click",function(){
    //console.log('66');
    var $this =$(this);
    if(!$this.hasClass("now")){
      $(this).addClass("now").siblings().removeClass("now");
      //让所有span下的箭头都向下
      $("lt_sort li span").addClass("fa-angle-down").removeClass("fa-angle-up");
    }else{
      $(this).find("span").toggleClass("fa-angle-down").toggleClass("fa-angle-up");
    }
    render();
  });

  function getSearch() {
    var search = location.search;
    //地址栏会对中文转码
    search = decodeURI(search);
  
    //去掉?号
    search = search.slice(1);//数组切分，复制数组的一部分到一个新的数组
  
    //变成一个数组
    var arr = search.split("&");//split是将字符串分割成数组
   // console.log(arr);
    var obj = {};
    arr.forEach(function (e, i) {
      // console.log(e);
      // console.log(i);
      var k = e.split("=")[0];
      var v = e.split("=")[1];
      obj[k] = v;
    });
    return obj;
  }

  function render(){
    var obj ={
      proName:key,
      page:page,
      pageSize:pageSize
    };
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
    //发送ajax请求
    $.ajax({
      type: 'get',
      url: '/product/queryProduct',
      data: obj,
      success: function (info) {
        //console.log(info);
        setTimeout(function () {
          var html = template("tpl", info);
          $(".lt_product").html(html);
        }, 1000);

      },
    });
  }
}) 

