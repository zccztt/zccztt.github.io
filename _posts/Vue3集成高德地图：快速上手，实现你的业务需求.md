---
layout:     post
title:      Vue3集成高德地图：快速上手，实现你的业务需求
subtitle:   vue3项目中该怎么添加高德地图？
date:       2024-08-19
author:     ztt
header-img: img/header-vue.jpg
catalog: true
tags:
    - Blog
---

> <font face= '楷体' size='4'>主页传送门：📀 [传送](https://zccztt.blog.csdn.net/?type=blog) </font>

---

# 前言
&emsp;&emsp;总结之前写的内容，优化下细节

---



# 一、准备工作

&emsp;&emsp;确保自己有<font color='red'>开发者账号并成功生成了API密钥</font>。具体操作如下:

## 1.开发文档
&emsp;&emsp;百度搜索==高德开放平台== -登录/注册 -文档与支持- Web服务 API - JS API

![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/6471aec91626e138ddfe3abb431260d3.png)
## 2.添加应用
&emsp;&emsp;认证 - 控制台 - 应用管理 -我的应用 -创建新应用 
	![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/b770ec56472a725d8c02bde901e0c564.png)
创建完应用点击添加key在弹出的页面根据需求选择对应服务平台即可

==**web示例：**==
web网页 选择 web端（js api）key名称随便写 域名白名单根据自己需求选择添加 最后勾选同意
![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/5bae647a35ef21338d2d6805f6ef5894.png)

<font color='red'>**注意**：</font>选 web端 才能生成安全密钥 调用api需要用到
![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/19b07af99d44c445d48209746fd91025.png)

# 二、使用步骤

安装高德地图SDK
## 命令安装

==**npm安装：**==

代码如下：

```c
npm i @amap/amap-jsapi-loader --save
npm install coordtransform  --涉及到坐标转换不想自己写的可以安装这个 
```

==**yarn安装：**==
代码如下：

```c
yarn add vue-amap

```

## 2.地图容器创建
地图组件中创建 < div> 标签作为地图容器
```c
<template>
    <div class="home_div">
        <div id="container" style="height: 50vh; width: 100%"></div>
    </div>
</template>

<style scope>
    .home_div{
        height: 100%;
        width: 100%;
        padding: 0px;
        margin: 0px;
        position: relative;
    }
</style>
	
```
## 3.组件引入

```css
import AMapLoader from "@amap/amap-jsapi-loader"
import { reactive, ref, toRefs, onMounted, nextTick, defineProps } from 'vue';
import { shallowRef } from '@vue/reactivity'
```
## 4.js  api  安全密钥
JS API 安全密钥以明文方式设置，不推荐（不安全）
```javascript
<script setup>

window._AMapSecurityConfig = {
  securityJsCode: '此处填上面应用生成的秘钥', 
}
</script>
```
JS API  安全密钥通过代理服务器转发，==强烈建议==使用（安全）

```c
server {
  listen       80;             #nginx端口设置，可按实际端口修改
  server_name  127.0.0.1;      #nginx server_name 对应进行配置，可按实际添加或修改

  # 自定义地图服务代理
  location /_AMapService/v4/map/styles {
    set $args "$args&jscode=您的安全密钥";
    proxy_pass https://webapi.amap.com/v4/map/styles;
  }
  # 海外地图服务代理
  location /_AMapService/v3/vectormap {
    set $args "$args&jscode=您的安全密钥";
    proxy_pass https://fmap01.amap.com/v3/vectormap;
  }
  # Web服务API 代理
  location /_AMapService/ {
    set $args "$args&jscode=您的安全密钥";
    proxy_pass https://restapi.amap.com/;
  }
}
```

## 5.初始化地图

```javascript
var map = new AMap.Map('container', {
            viewMode: "3D",  //  是否为3D地图模式
            zoom: 10, //  地图显示的缩放级别
            zooms:[2,22], // 地图缩放范围
            center: arr, //  地图中心点坐标
		    layers: [new AMap.TileLayer.Satellite()],  //设置图层,可设置成包含一个或多个图层的数组
		    mapStyle: 'amap://styles/whitesmoke',  //设置地图的显示样式
            resizeEnable: true  //  是否监控地图容器尺寸变化
});

也可以使用 map.setMapStyle('amap://styles/whitesmoke') 来动态的设置地图样式。

```

## 6. 图层
地图在初始化的时候，如果你没有配置layers属性，JS API会默认添加一个标准图层，标准图层的配置为：

```c
const layer = new AMap.createDefaultLayer({ // 提示：参数值并不是API默认使用的值
  zooms:[3,20],    //可见级别
  visible:true,    //是否可见
  opacity:1,       //透明度
  zIndex:0         //叠加层级
})
如果你想更改默认配置，你可以在初始化地图的时候传入你创建的 createDefaultLayer。
const map = new AMap.Map('container',{
  ...otherOptions, // 其他配置
  layers:[layer]   // layer为你通过 new AMap.createDefaultLayer() 创建的默认图层
});
```
### 6.1 添加 / 设置 / 获取 / 移除图层
#### 6.1.1 添加图层
地图上可使用add()方法添加各类型的图层，如高德官方的卫星、路网图层，第三方或是自定义图层等。

```c
// 构造官方卫星、路网图层
var layer1 = new AMap.TileLayer.Satellite();
var layer2 =  new AMap.TileLayer.RoadNet();
var layers = [
    layer1,
    layer2
]
// 添加到地图上
map.add(layers);
```
#### 6.1.2 设置图层
可以使用setLayers()方法设置图层，使用该方法后，地图图层会被重置。

```c
// 构造官方卫星、路网图层
var layers =  [
    new AMap.TileLayer.Satellite(),
    new AMap.TileLayer.RoadNet()
]
// 地图上设置图层
map.setLayers(layers);
```
#### 6.1.3 获取图层
可以通过getLayers()方法获取地图图层数据

```c
// 获取地图图层数据
map.getLayers();
```
#### 6.1.4 移除图层
通过remove()方法移除地图图层

```c
// 移除一个图层
map.remove(layer1);
```
## 7. 点标记
	
点标记适用于用户需要在地图上创建一个标记的场景。Marker 类型推荐在数据量为 500 以内时使用。若数据量大于 500 ，推荐使用 LabelMarker，可以获得更好的性能。另外需要地图标注可以避让用户标注时，也推荐使用 LabelMarker。
```javascript
var marker = new AMap.Marker({
    icon: "",
    position: [经度, 纬度]
});
map.add(marker1);
map.setFitView();
// 删除已有Marker对象使用：
 map.remove(marker)。
// 可以一次性添加多个Marker实例，只需将每个Marker示例放入一个数组Array中。
// 多个点实例组成的数组
const markerList = [marker1, marker2, marker3];
map.add(markerList);
// 绑定Marker实例的事件
const clickHandler = function(e) {
  alert('您在[ '+e.lnglat.getLng()+','+e.lnglat.getLat()+' ]的位置点击了地图！');
};
// 绑定事件
map.on('click', clickHandler);
```
## 8. 信息窗体
### 8.1 默认信息窗体
#### 8.1.1 默认信息窗体的创建
默认信息窗体封装了关闭按钮，使用 API 默认的信息窗体样式，这个时候只需要对 InfoWindow 设定 content 属性即可，content 可以是 dom 对象，也可以是 html 识别的字符串。

```c
// 信息窗体的内容
var content = [
    "<div><img src="\"" http:="" webapi.amap.com="" images="" autonavi.png="" \"=""> ",
    "<div style="\"padding:0px" 0px="" 4px;\"=""><b>高德软件有限公司</b>",
    "电话 : 010-84107000   邮编 : 100102",
    "地址 : 北京市望京阜通东大街方恒国际中心A座16层</div></div>"
];

// 创建 infoWindow 实例	
var infoWindow = new AMap.InfoWindow({
   content: content.join("<br>")  //传入 dom 对象，或者 html 字符串
});
  
// 打开信息窗体
infoWindow.open(map);
```
#### 8.1.2 信息窗体锚点的设置（anchor）
通过 anchor 可以方便的设置锚点方位。anchor 可选值有  'top-left'、'top-center'、'top-right'、'middle-left'、'center'、'middle-right'、'bottom-left'、'bottom-center'、'bottom-right' ， 分别代表了信息窗体锚点的不同方位。

```c
var infoWindow = new AMap.InfoWindow({
        anchor: 'top-left',
        content: '这是信息窗体！',
});

infoWindow.open(map,[116.401337,39.907886]);
```

### 8.2 自定义信息窗体
如果要自定义信息窗体内容，只需把 InfoWindow 的 isCustom 属性设置为 true ，信息窗体就会变成自定义信息窗体。与默认信息窗体的不同在于，自定义信息窗体需要自己通过 content 来实现关闭按钮以及全部外观样式，同时需要通过 offset 指定锚点位置，offset 为相对于 content 下边缘中间点的位移:
####  8.2.1 自定义窗体的创建 
```javascript
// 折线的节点坐标数组，每个元素为 AMap.LngLat 对象
var content = [
    "<div><img src="\"" http:="" webapi.amap.com="" images="" autonavi.png="" \"=""> ",
    "<div style="\"padding:0px" 0px="" 4px;\"=""><b>高德软件有限公司</b>",
    "电话 : 010-84107000   邮编 : 100102",
    "地址 : 北京市望京阜通东大街方恒国际中心A座16层</div></div>"
];

// 实现自定义窗体内容，返回拼接后的字符串
function createInfoWindow (title, content){
    // 内容拼接 ...
    return content;
}

// 创建 infoWindow 实例 
var infoWindow = new AMap.InfoWindow({
   isCustom: true,  //使用自定义窗体
   content: createInfoWindow(title,content.join("<br>")),  //传入 dom 对象，或者 html 字符串
   offset: new AMap.Pixel(16, -50)
});
```
#### 8.2.2 自定义信息窗体的偏移量（offset）
如果用户自定义信息窗体内容，可以为定义的内容添加偏移量（offset）。当偏移量为 (0, 0) 时，自定义内容默认以底部中部为基准点（若设置了 anchor，基准点位置则为 anchor 设置的位置）与经纬度坐标对齐；设置 offset 为其他值则对齐位置相应改变。具体偏移规则如下：
![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/672b8ef13e9bc6cbae751f6fd049f49e.png)
### 8.3 信息窗体的打开关闭

```c
// 在指定位置打开已创建的信息窗体
var position = new AMap.LngLat(116.39, 39.9);
infoWindow.open(map, position);

// 关闭信息窗体
infoWindow.close();
```

## 9.搜索
### 9.1 引入和创建插件实例

```c
const placeSearch = new AMap.PlaceSearch({
  pageSize: 5, // 单页显示结果条数
  pageIndex: 1, // 页码
  city: "010", // 兴趣点城市
  citylimit: true,  //是否强制限制在设置的城市内搜索
  map: map, // 展现结果的地图实例
  panel: "panel", // 结果列表将在此容器中进行展示。
  autoFitView: true // 是否自动调整地图视野使绘制的 Marker点都处于视口的可见范围
});
// 使用插件搜索关键字并查看结果
placeSearch.search('北京大学');
// 自定义搜索结果 （如果你不想使用JS API的结果面板，panel可以缺省或者赋值false，然后可以在search()的回调中处理自己的逻辑。）
placeSearch.search('北京大学', function (status, result) {
   // 查询成功时，result即对应匹配的POI信息
});
```
### 9.2 输入提示插件
想实现类似在高德地图的输入框里输入文本片段即显示相关的匹配信息，使用输入提示插件AMap.AutoComplete就对了
```javascript
AMap.plugin('AMap.AutoComplete', function(){
  var autoOptions = {
    //city 限定城市，默认全国
    city: '全国'
  };
  // 实例化AutoComplete
  var autoComplete= new AMap.AutoComplete(autoOptions);
  // 根据关键字进行搜索
  autoComplete.search(keyword, function(status, result) {
    // 搜索成功时，result即是对应的匹配数据
    console.log(result);
  })
})
```
### 9.3 POI搜索
使用 AMap.PlaceSearch 获取搜索信息。
```c
map.plugin('AMap.PlaceSearch', () => {
      let placeSearch = new AMap.PlaceSearch({
        city: '010', // city 指定搜索所在城市，支持传入格式有：城市名、citycode和adcode
        map: map // 展现结果的地图实例
      })
      // 关键字搜索
      placeSearch.search(value, function (status, result) {
	   // 监听标记点击事件
        AMap.Event.addListener(placeSearch, 'markerClick', function (data) {
          let result = data
        })        
      })
})
```

参考文档：
[高德开放平台](https://lbs.amap.com/api/javascript-api-v2/summary)


