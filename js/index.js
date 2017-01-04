/*默认载入-start*/ 
	// 假数据 -- 本地调试用
	// store.set('user', { lng:120.728326,lat:27.967599, cityId: 3,cityName:"温州"});
	// store.set('wxToken','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyIjoiMTM3MzgzMDg0ODEiLCJpc3MiOiJtaWNyb3BvaW50IiwiZXhwIjoxNTY0Mzg5MzI3OTU2LCJyb2xlIjoiVklQX0FDQ09VTlQiLCJjbGllbnQiOjEsInBhcmFtcyI6eyJ2aXBJZCI6MSwiZGV2aWNlSWQiOiIxMjMxMjMifX0.NVhy8l7aaWdzyIGs1AKTkeIJUqcKTriE8fK-y798CVQ');
	
	// 如果有经度和维度的参数值,那就获取经度和维度
	if(window.location.hash){
		// 第一次获取位置信息后跳转页(http://test.51yuchu.com/index.html#/"+user.lng+"/"+user.lat)		

	    // 获取主机地址(这里的test.51yuchu.com,然后加上http://)
	    var Urlhost = "http://"+window.location.host+"/";
			// alert(Urlhost);
	    // 获取路由参数(既#)
	    var Urlhash = window.location.hash;
	   
	    // 根据hash值,分割路由值
	    // #/3/2016-12-13/17:30/6
	    // "http://test.51yuchu.com/index.html#/"+user.lng+"/"+user.lat;
	    var hash = Urlhash.split('/'); //以“/”进行分割并转换成数组
	    // 经度
	    var uLng = hash[1];
	    // 维度
	    var uLat = hash[2];
	    // 获取城市cityId,城市名称
        $.ajax({
        	type:"get",
        	url:"http://api.51yuchu.com/location/wechat/convert?lng="+ uLng +"&lat="+ uLat,
        	dataType:"json",
        	success:function(data){
        		// 城市id
        		// alert(data.value.id);
        		// 城市名称
        		// alert(data.value.name);

        		var uId = data.value.id;
        		var uName = data.value.name;
        		// alert(appUrl);
        		// 数据存入本地(经度,维度,城市Id,城市名称,用户token)
        		// 真数据 -- 调试完替换
        		store.set('user',{lng:uLng,lat:uLat, cityId: uId,cityName:uName});
				// store.set('user', { lng:uLng,lat:uLat, cityId: uId,cityName:uName,token:'eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyIjoiMTM3MzgzMDg0ODEiLCJpc3MiOiJtaWNyb3BvaW50IiwiZXhwIjoxNTY0Mzg5MzI3OTU2LCJyb2xlIjoiVklQX0FDQ09VTlQiLCJjbGllbnQiOjEsInBhcmFtcyI6eyJ2aXBJZCI6MSwiZGV2aWNlSWQiOiIxMjMxMjMifX0.NVhy8l7aaWdzyIGs1AKTkeIJUqcKTriE8fK-y798CVQ'});
				// store.set('user', { lng:120.728326,lat:27.967599, cityId: 3,cityName:"温州",token:'eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyIjoiMTM3MzgzMDg0ODEiLCJpc3MiOiJtaWNyb3BvaW50IiwiZXhwIjoxNTY0Mzg5MzI3OTU2LCJyb2xlIjoiVklQX0FDQ09VTlQiLCJjbGllbnQiOjEsInBhcmFtcyI6eyJ2aXBJZCI6MSwiZGV2aWNlSWQiOiIxMjMxMjMifX0.NVhy8l7aaWdzyIGs1AKTkeIJUqcKTriE8fK-y798CVQ'});

				var user = store.get('user');

				// var wxdata = store.get('wxData');
				// 修改所在城市名称
				$('.u-city').html(user.cityName);
				// alert(user.cityName);					
        	},
        	error:function(){
        		alert("返回失败:"+uLng+uLat);
        	}
        });
	}else{
		// 已获取地理位置(其他页返回到index.html)
		if(store.get('user')){
			// 获取城市cityId,城市名称
			var user = store.get('user');
			var uLng = user.lng;
			var uLat = user.lat;
			var uId  = user.cityId;
			var uName = user.cityName;
	        
	        // 修改城市名称
			$('.u-city').html(uName);

			/* 页面载入-获取数据 */
			iAjax(uLng,uLat,uId);

			/*Ajax数据集合函数-start()*/ 
				// 数据集合(banner/附近商家/精品推荐/餐厅主题)
			    function iAjax(lng,lat,cityId){	
		    		// 设置初始值
		    		// 广告列表
		    		var strAd = "";
		    		// 附近商家列表
		    		var	strNearty = "";
		    		// 精品推荐列表
		    		var strRecommend = "";
		    		// 餐厅主题列表
		    		var strSence = "";

					/*获取-banner数据-start*/
						$.ajax({
							type:"get",
							url:"http://api.51yuchu.com/index/ad/list",
							dataType:"json",
							success:function(data){
								if(data.succeed){
									for(var i=0;i<data.value.length;i++){	
							 			strAd += '<div class="swiper-slide"><a href="'+ data.value[i].url +'" class="slide-url"><img src="'+ data.value[i].background +'" alt="御厨,一秒线上预订" class="slide-img" /></a></div>';
							 		}
							 		$('.i-hd1 .swiper-wrapper').html(strAd);
							 		// alert(strAd);
								}
								
							},
							error:function(e){
								//	alert(e.value[0].title);
							}
						});
					/*获取-banner数据-end*/
				
					/*获取-附近商家数据-start*/
						$.ajax({
					  		type:"get",
						  	url:"http://api.51yuchu.com/index/nearby/list?cityId="+cityId+"&radii=3000&lng="+ lng +"&lat="+ lat +"&page=1&size=10",
						  	dataType:"json",
						  	success:function(data){
								if(data.succeed){
									for(var i=0;i<data.value.length;i++){
										strNearty += '<div class="swiper-slide"><a class="i-business-text" href="restaurantdetails.html#'+data.value[i].restaurant.id+'"><strong class="i-business-name">'+ data.value[i].restaurant.name +'</strong> <span class="i-business-explain">'+ data.value[i].restaurant.content +'</span> <span class="i-business-distance">&lt;'+ data.value[i].distance +'公里</span></a> <a href="restaurantdetails.html#'+data.value[i].restaurant.id+'" class="i-business-img"><img src="'+ data.value[i].restaurant.previewUrl +'" alt=""></a></div>';
									}  	
									$(".i-bd1 .swiper-wrapper").html(strNearty);
								}
						  	}
						});	
					/*获取-附近商家数据-end*/	
				
					/*获取-精品推荐数据-start*/
						$.ajax({
						  	type:"get",
						  	url:"http://api.51yuchu.com/index/recommend/list?cityId="+ cityId +"&lng="+ lng +"&lat="+lat,
						  	dataType:"json",
						  	success:function(data){
								// 这里的success方法是不会执行的，会调用上传pandoraCall方法，该方法名和服务器回传内容的方法名一致
							if(data.succeed){
								for(var i=0;i<data.value.length;i++){
									strRecommend += '<li><a href="restaurantdetails.html#'+data.value[i].restaurant.id+'"><img src="'+ data.value[i].restaurant.previewUrl +'" alt=""><p>'+ data.value[i].restaurant.name +'</p></a></li>';
								}  	
								$(".i-recommend-list").html(strRecommend);
							}
							
						  }
						});
					/*获取-精品推荐数据-end*/
					
					/*获取-主题聚会数据-start*/
						$.ajax({
						  type:"get",
						  url:"http://api.51yuchu.com/index/theme/list?cityId="+ cityId +"&page=1&size=10",
						  dataType:"json",
						  success:function(data){			　	
							if(data.succeed){
								for(var i=0;i<data.value.list.length;i++){
									strSence += '<li class="i-scene"><a href="scene.html#'+ data.value.list[i].id +'"><img src="'+ data.value.list[i].imageUrl +'" alt="" class="i-sence-img"><div class="i-sence-tit"><h3>'+ data.value.list[i].name +'</h3><p>'+ data.value.list[i].describe +'</p></div></a></li>';
								}  	
								$('.i-scene-list').html(strSence);
							}				
						  }
						});
					/*获取-主题聚会数据-end*/
		    	}
		    /*Ajax数据集合函数-end(banner/附近商家/精品推荐/餐厅主题)*/ 
		}else{
			// 未获取地理位置(既用户第一次登陆)

			// 获取主机地址(域名)
			var uhost = "http://"+window.location.host+"/";
			// 通过微信api获取--位置信息(经纬度)
			wxLocation(uhost);

			/*微信获取位置函数-start*/ 
				function wxLocation(host){
					$.ajax({
						type:"get",
						url:"http://api.51yuchu.com/wechat/fwh/get/config?url="+host,
						dataType:"json",
						success:function(data){
							if(data.succeed){
								// 1.获取微信接口默认配置的值
									var value = data.value;
									// 公众号ID
									var wxAppid = value.appId;
									// 签名时间戳
									var wxTimestamp = value.timestamp;
									// 签名的随机串
									var wxNonceStr = value.nonceStr;
									// 签名
									var wxSignature = value.signature;

									// JS接口列表
									var wxJsApiList = ['checkJsApi','openLocation','getLocation','chooseWXPay'];
									// 跳转url地址
									var wxRedirect_uri = value.url;	
									// 微信请求的方式
									var wxScope = "snsapi_userinfo";

								// 2.本地存储默认配置的值
									// 本地存储-微信的配置信息
									// 存储微信Appid
									store.set('wxAppid',wxAppid);
									// 存储微信配置其他信息
									store.set("wxConfig",{timestamp: wxTimestamp ,nonceStr: wxNonceStr, signature: wxSignature,jsApiList: wxJsApiList});

								// 3.先微信配置,再调用微信地理位置接口
									// 微信接口(默认配置)
									wx.config({
									    debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
									    appId: wxAppid, // 必填，公众号的唯一标识
									    timestamp: wxTimestamp , // 必填，生成签名的时间戳
									    nonceStr: wxNonceStr, // 必填，生成签名的随机串
									    signature: wxSignature,// 必填，签名，见附录1
									    jsApiList: wxJsApiList // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
									});

									// 微信接口验证通过后执行
									wx.ready(function(){
										wx.getLocation({
										    type: 'wgs84', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
										    success: function (res) {   
										        var longitude = res.longitude; // 经度，浮点数，范围为180 ~ -180。
										        var latitude = res.latitude; // 纬度，浮点数，范围为90 ~ -90
										        var speed = res.speed; // 速度，以米/每秒计
										        var accuracy = res.accuracy; // 位置精度

										        window.location.href = wxRedirect_uri+"index.html#/"+ longitude +"/"+ latitude;							        
										    }
										});
									});						
							}
						}
					})
				}
			/*微信获取位置函数-end*/
		}

		
	}

/*默认载入-end*/

/*加载完成-start*/
	$(function(){	
		//轮播效果
		iSlide();	

		/*函数集合*/
			// 轮播图函数
				function iSlide(){
		    		var swiper1 = new Swiper('.swiper-container1', {
				        nextButton: '.swiper-button-next',
				        prevButton: '.swiper-button-prev'
				    });
				    
				    var swiper2 = new Swiper('.swiper-container2', {
				    	autoplay: 2000,
				    	paginationClickable: true,
				        pagination: '.swiper-pagination'
				    });
				    
					swiper1.params.control = swiper1;	//
					swiper2.params.control = swiper2;	//
		    	}
		    
    	/*函数集合*/			
	})
/*加载完成-end*/