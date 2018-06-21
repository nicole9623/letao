//区域滚动
mui('.mui-scroll-wrapper').scroll({
  indicators:false,
});
//轮播图自动播放
mui('.mui-slider').slider({
  interval:1000//自动轮播周期，若为0则不自动播放，默认为0；
});