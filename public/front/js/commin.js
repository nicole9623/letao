//区域滚动
mui('.mui-scroll-wrapper').scroll({
  indicators:false,
});
//轮播图自动播放
mui('.mui-slider').slider({
  interval:1000//自动轮播周期，若为0则不自动播放，默认为0；
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