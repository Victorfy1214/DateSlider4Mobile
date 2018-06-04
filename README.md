# DateSlider4Mobile
js + css 仿写[`Windy`](https://www.windy.com/)的时间滑条，使用了css多媒体查询，仅适用于移动端的网页显示

写在前面：
====
该项目使用了css以及css多媒体查询方法，并结合js仿写了[`Windy`](https://www.windy.com/)移动端的时间滑条，未仿写全部功能。

项目介绍：
====
当前很多APP都采用hybrid app的开发模式，本项目为网页部分的时间滑条模块。
<br>地图渲染引擎为[`leaflet`](https://leafletjs.com/)，使用按钮图标库为[`Font Awesome`](https://fontawesome.com/?from=io),项目使用了`JQuery`库<br>

兼容性
====
条件限制，仅在自己的设备上测试，小米5s Android 7.0 miui9 可用。

效果预览
====
![Image text](https://raw.githubusercontent.com/Victorfy1214/DateSlider4Mobile/master/preview/GIF.gif)

使用方法
====

引用样式`mobile-slider.css`文件
```html
 <link rel="stylesheet" href="css/mobile-slider.css"><link>
 ```
 引用font-awesome样式
 ```html
  <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.0.13/css/all.css" integrity="sha384-DNOHZ68U8hZfKXOrtjWvjxusGo9WQnrNx2sqG0tfsghAvtVlRW3tvkXWZh58N9jp" crossorigin="anonymous">
 ```
 引用JQuery库
 ```html
 <script src="js/jquery.min.js"></script>
 ```
 在`body`标签中添加如下标签
 ```html
<div class = "Time-Slider">
    <div id="mobile-timecode" data-title="D_LT2"></div>
    <div class = "triangle-down" ></div>
    <div id = "mobile-progress-bar">

        <div class = "mobile-icon-play">
            <i class="fa fa-play"></i>
        </div>
        <div class = "mobile-icon-pause">
            <i class="fa fa-pause"></i>
        </div>

        <div id = "mobile-time-box"></div>
    </div>
</div>
 ```
 引用`mobile-slider.js`文件
  ```html
 <script type="text/javascript" src="js/mobile-slider.js"></script>
 ```
 
 准备起始和终止日期并新建TimeSlider对象
 ```javascript
    const d0 = '2016/08/13 00:00';//起始日期
    const d1 = '2016/08/23 00:00';//终止日期
    let mSlider = new TimeSlider(d0,d1);
 ```
调用时间滑条初始化函数
 ```javascript
   mSlider.Init();
 ```
 调用日期变更回调函数
 ```javascript
    mSlider.setOnChangedListener(function (value) {
        console.log(value);//value为日期值
    });
 ```

封装方法介绍
====

* `setOnChangedListener`： 此监听方法用于监听变更的日期值，参数`callback`，传入你的回调处理函数
