# mescroll-uni
## mescroll-uni : 支持uni-app的下拉刷新和上拉加载组件
## http://www.mescroll.com
1. mescroll-uni 是用在uni-app的下拉刷新和上拉加载的组件, 支持一套代码编译到iOS、Android、H5、小程序等多个平台

2. mescroll-uni 采用的是uni官方推荐的新框架编译模式 : <a href="https://ask.dcloud.net.cn/article/35843" target="_blank">自定义组件模式</a>, 实现了更高的性能及更多的 Vue 语法支持

3. mescroll-uni 继承了mescroll.js的实用功能: 自动处理分页, 自动控制无数据, 空布局提示, 回到顶部按钮 ..

4. mescroll-uni 丰富的案例, 自由灵活的api, 超详细的注释, 可让您快速自定义真正属于自己的下拉上拉组件
		

## 快速入门 :

#### <a href="http://www.mescroll.com/uni.html" target="_blank">点此查看mescroll官方文档, 排版清晰, 更新及时: http://www.mescroll.com/uni.html</a> 

#### 1. 配置 manifest.json 的编译模式为 自定义组件模式 <a href="https://ask.dcloud.net.cn/article/35843" target="_blank">(uni官方配置说明)</a> :
```
    // manifest.json (在您uni项目的根目录) 
	{    
		// ...
		/* App平台特有配置 */   
		"app-plus": {    
			"usingComponents":true // true表示新的`自定义组件模式` ，否则为`template模板模式`
		}    
		/* 微信小程序特有配置 */
		"mp-weixin": {    
			"usingComponents":true // true表示新的`自定义组件模式`，否则为`template模板模式`
		}    
	}
```  


#### 2. 安装mescroll-uni . 运行 npm 命令 :
```
    npm install --save mescroll-uni      //不要使用cnpm安装, 因为更新下来有可能是旧的版本
	

	详细步骤:
		1.安装 node.js
		2.打开命令提示符,定位到uni项目根目录
		3.输入 npm install --save mescroll-uni 回车即可 
```  
( 您也可以下载mescroll-uni案例, 把components目录下的mescroll-uni拷贝到自己的项目, 但还是推荐npm命令安装, 方便更新mescroll-uni的版本 )


#### 3. 配置 pages.json :
```
    {
	   "path" : "pages/xxx/xxx", // 只配置使用mescroll-uni的页面
	   "style" : {
			"navigationBarTitleText" : "xxx",
			"enablePullDownRefresh" : false, // 不开启下拉刷新, 默认就是false
			"onReachBottomDistance" : 100, // 页面上拉触底事件触发时距页面底部距离, 默认 50
			"app-plus" : {
				"bounce" : "none" // 取消iOS回弹,避免和下拉刷新冲突 (小程序无法取消)
			}
		}
	}
```  

#### 4. 在具体页面中的示例 :  
```
<template>
	<mescroll-uni :down="downOption" @down="downCallback" :up="upOption" @up="upCallback" @init="mescrollInit">
		<!-- <view> @down, @up, @init 必须配置 </view> -->
		<!-- <view> :down, :up, 可省略 </view> -->
		<!-- <view v-for="data in dataList"> 数据列表... </view> -->
	</mescroll-uni>
<template>

	<script>
		// 引入mescroll-uni组件
		import MescrollUni from "mescroll-uni";
		
		export default {
			components: {
				MescrollUni
			},
			data() {
				return {
					mescroll: null, //mescroll实例对象
					// 下拉刷新的配置
					downOption: { 
						use: true, // 是否启用下拉刷新; 默认true
						auto: true, // 是否在初始化完毕之后自动执行下拉刷新的回调; 默认true
					},
					// 上拉加载的配置
					upOption: {
						use: true, // 是否启用上拉加载; 默认true
						auto: true, // 是否在初始化完毕之后自动执行上拉加载的回调; 默认true
						isLock: false, // 是否锁定上拉加载 (可用于不触发upCallback,只保留回到顶部按钮的场景)
						page: {
							num: 0, // 当前页码,默认0,回调之前会加1,即callback(page)会从1开始
							size: 10 // 每页数据的数量,默认10
						},
						noMoreSize: 3, // 配置列表的总数量要大于等于5条才显示'-- END --'的提示
						empty: {
							tip: '暂无相关数据'
						}
					},
					// 列表数据
					dataList: []
				}
			},
			// 必须注册滚动到底部的事件,使上拉加载生效
			onReachBottom() {
				this.mescroll && this.mescroll.onReachBottom();
			},
			// 必须注册列表滚动事件,使下拉刷新生效
			onPageScroll(e) {
				this.mescroll && this.mescroll.onPageScroll(e);
			},
			methods: {
				// mescroll组件初始化的回调,可获取到mescroll对象
				mescrollInit(mescroll) {
					this.mescroll = mescroll;
				},
				/*下拉刷新的回调, 有三种处理方式: */
				downCallback(mescroll){
					// 第1种: 请求具体接口
					uni.request({
						url: 'xxxx',
						success: () => {
							// 成功隐藏下拉加载状态
							mescroll.endSuccess()
						},
						fail: () => {
							// 失败隐藏下拉加载状态
							mescroll.endErr()
						}
					})
					// 第2种: 下拉刷新和上拉加载调同样的接口, 那以上请求可删, 直接用mescroll.resetUpScroll()代替
					mescroll.resetUpScroll(); // 重置列表为第一页 (自动执行 page.num=1, 再触发upCallback方法 )
					// 第3种: 下拉刷新什么也不处理, 可直接调用或者延时一会调用 mescroll.endSuccess() 结束即可
					mescroll.endSuccess()
				},
				/*上拉加载的回调*/
				upCallback(mescroll) {
					// 此时mescroll会携带page的参数:
					let pageNum = mescroll.num; // 页码, 默认从1开始
					let pageSize = mescroll.size; // 页长, 默认每页10条
					uni.request({
						url: 'xxxx?pageNum='+pageNum+'&pageSize='+pageSize,
						success: (data) => {
							// 接口返回的当前页数据列表 (数组)
							let curPageData = data.xxx; 
							// 接口返回的总页数 (比如列表有26个数据,每页10条,共3页; 则totalPage值为3)
							let totalPage = data.xxx; 
							// 接口返回的总数据量(比如列表有26个数据,每页10条,共3页; 则totalSize值为26)
							let totalSize = data.xxx; 
							// 接口返回的是否有下一页 (true/false)
							let hasNext = data.xxx; 
							
							// 成功隐藏下拉加载状态
							//方法一(推荐): 后台接口有返回列表的总页数 totalPage
							mescroll.endByPage(curPageData.length, totalPage); 
							
							//方法二(推荐): 后台接口有返回列表的总数据量 totalSize
							//mescroll.endBySize(curPageData.length, totalSize); 
							
							//方法三(推荐): 您有其他方式知道是否有下一页 hasNext
							//mescroll.endSuccess(curPageData.length, hasNext); 
							
							//设置列表数据
							if(mescroll.num == 1) this.dataList = []; //如果是第一页需手动制空列表
							this.dataList = this.dataList.concat(curPageData); //追加新数据
						},
						fail: () => {
							// 失败隐藏下拉加载状态
							mescroll.endErr()
						}
					})
				}
			}
		}
	</script>

	<style>
	</style>
	   	
```  

## 自定义mescroll-uni :

#### 快速的自定义是mescroll-uni的优势, 您可以随心所欲的进行全局配置 和 在具体界面的自定义
 <a href="http://stream.cdn.aliyun.dcloud.net.cn/marketplace/43dc2f00-66aa-11e9-945e-e3c4c1708066/plugin.zip?v=666666" target="_blank">(请先点击本界面左上角的下载, 查看完整的演示案例)</a>
1. npm安装的, 可以直接修改 /node_modules/mescroll-uni/mescroll-uni-option.js 进行全局配置
2. 下载拷贝的, 可以直接修改 /components/mescroll-uni/mescroll-uni-option.js 进行全局配置
3. 在具体的页面中,您可以配置downOption 和 upOption 实现具体界面的自定义, 建议参考mescroll-uni-options.vue
4. 深度定制化, 请参考mescroll-uni的中高级案例

## 在线案例和参数说明,请移步至<a href="http://www.mescroll.com">mescroll官网</a>

## 更新记录:
#### 1.0.3版本 (2019/06/13)
1. 默认设置page高度100%,使列表不满屏的时候,仍可下拉刷新<br/>
2. 加入-webkit-overflow-scrolling: touch, 编译到H5和APP,使iOS列表滚动更流畅<br/>
3. mescroll-empty加入box-sizing: border-box, 修复图标和文本不居中的问题<br/>
4. 上拉配置新增errDistance,默认110 // mescroll.endErr()的时候需往上滑动一段距离,使其往下滑动时能够再次触发上拉加载. <a href="https://github.com/mescroll/mescroll/issues/255">查看详情</a><br/>
5. mescroll.endErr(errDistance) 新增的参数 errDistance; 可单独配置异常往上滑动的距离, 默认不传, 取的是上拉配置的errDistance,默认110<br/>
6. 修改了list-mescroll-more的160行为mescroll.endErr(0); 使用了此案例的一定要记得改这里<br/>
6. 新增mescroll.scrollTo(y,t) 滚动到指定的位置; 本质调用的是uni.pageScrollTo

#### 1.0.2版本 (2019/05/28)  
1. 组件根元素加入mescroll-uni的样式,empty新增fixed等配置项; 
2. 修复list-mescroll-more案例切换tabs,某些情况的page.num会错乱的问题