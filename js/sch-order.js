
	//tab标签页函数				
	var tabs = function(tab, con,mask){
	    tab.click(function(){
	        var index = tab.index(this);
	        tab.removeClass('current');
	        $(this).addClass('current');
	        con.hide();
	        con.eq(index).show();
	       	mask.show();
	        
	        
	    }) 
	    
	    mask.click(function(){
	    	tab.removeClass('current');
	    	con.hide();
	    	mask.hide();
	    })
	}

	//	默认预约餐厅列表

		// oPage是默认页数
		var oPage = 1;
		// oSize 是默认显示个数
		var oSize = 10;
		var strList = "";

		
		// 默认载入，获取本地数据
		var user = store.get('user');
		// var token = user.token;
		var lng = user.lng;
		var lat = user.lat;
		var cityId = user.cityId;


		listAjax(oPage,oSize);
		
		// 点击加载更多时
		$(function(){			
			$('.btn-loading-more').click(function(){
				// 当前位置的Top值
				console.log($(this).scrollTop());
				oPage++;
				listAjax(oPage,oSize);
				// 数据完成之后跳转
				console.log($(this).scrollTop());
				

				// console.log(oPage);
				// console.log($(this).html());

			})
		})
		
		console.log(cityId);
		// 餐厅列表Ajax
		function listAjax(page,size){		
			$.ajax({
				type:"get",
				url:"http://api.51yuchu.com/restaurant/book/list?cityId="+ cityId +"&lat="+ lat +"&lng="+ lng +"&page="+page+"&size="+size,
				dataType:"json",
				beforeSend:Loading,
				success:function(data){
					if(data.succeed){
						for(var i=0;i<data.value.list.length;i++){
							strList = strList +'<li class="m-restaurant"><a href="restaurantdetails.html#'+data.value.list[i].restaurant.id+'" class="m-restaurant-img"><img src="'+data.value.list[i].restaurant.previewUrl+'"alt=""></a><a href="restaurantdetails.html#'+data.value.list[i].restaurant.id+'" class="m-restaurant-text"><h3 class="m-restaurant-tit">'+data.value.list[i].restaurant.name+'</h3><p class="m-restaurant-region">'+data.value.list[i].country.name+'</p><p class="m-restaurant-price">'+data.value.list[i].restaurant.priceStr+'</p></a><div class="m-restaurant-evaluate"><img src="images/bg-pie.png"alt=""><div class="m-evaluate-con"><h4>好评率</h4><p class="m-evaluate-ratio">'+data.value.list[i].praisePrecent+'％</p><p class="m-evaluate-votes">'+data.value.list[i].commentAssessment+'&nbsp;票</p></div></div></li>'
						}	
						// console.log(strList);
						$('.m-restaurant-list').html(strList);
						
					}
					// $('.m-restaurant-list').append('<button class="btn-loading-more">加载更多</button>');
					// console.log($('.btn-loading-more').html());

					
					
				}
			})
		}
			
			
	//筛选Ajax 数据对接
	function orderAjax(path){
		//餐厅排序or美食排序--下拉数据
	    $.ajax({
	    	type:"get",
	    	url:"http://api.51yuchu.com/search/"+path+"/order/list",
	    	dataType:"json",
	    	success:function(data){
	    		// 固定条数--数据获取方式
	    		// for(var i=0;i<data.value.length;i++){
	    		// 		$('#order_restaurant li a').eq(i).html(data.value[i].value);
	    		// }

	    		// console.log(data.value[1].key);
	    		//console.log(data.value.length);
	    		//不固定条数 --数据获取方式
	    		var str = "";
	    		for(i=0;i<data.value.length;i++){
	    			var str = str + "<li><a href='javascript:;' okey='"+data.value[i].key+"'>"+data.value[i].value+"</a></li>";	
	    		}
	    		//console.log(str);
	    		$('#order_restaurant').html(str);
	    		
	    		orderRestaurantList($('#order_restaurant li a'));
	    	}	
	    })
	    
	    //区域排序 -- 下拉数据
	    $.ajax({
	    	type:"get",
	    	 url:"http://api.51yuchu.com/search/region/list?cityId=3",
	    	dataType:"json",
	    	success:function(data){
				var str = "";
				//循环取出区域筛选数据,并组合插入到str中
	    		for(i=0;i<data.value.length;i++){
	    			var str = str + "<li><a href='javascript:;'>"+data.value[i].name+"</a></li>";	
	    		}
	    		//区域筛选数据插入
	    		$('#order_region').html(str);
	    		
	    		// 点击区域按钮,内容区数据变为筛选后的区域数据
	    		orderRestaurantList($('#order_region li a'));
	    		
	    	}
	    })
	    
	    
	    //菜系排序--下拉数据
	    $.ajax({
	    	type:"get",
	    	 url:"http://api.51yuchu.com/search/cuisine/list",
	    	dataType:"json",
	    	success:function(data){
	    		var str = "";
	    		for(i=0;i<data.value.length;i++){
	    			var str = str + "<li><a href='javascript:;'>"+data.value[i].name+"</a></li>";	
	    		}
	    		$('#order_cuisine').html(str);
	    		
	    		// 点击菜系按钮,内容区数据变为筛选后的区域数据			    		
	    		orderRestaurantList($('#order_cuisine li a'));
	    		
	    	}
	    })
	    
	    //价格排序--下拉数据
	   	orderPrice();
 
	    //排序获取数据 函数
		function orderRestaurantList(event){
			$('#restaurant_list').show();
			for(var j=0;j<event.length;j++){
				arrUrl = [];
				tabId = 10;
				event.eq(j).click(function(){
					//筛选按钮添加选中效果
					event.removeClass('current');
					$(this).prop('class','current');
					
					//console.log($('.tab-con .current').length);
					
					//判断标签
					// console.log($(this).parent().parent().prop('id'));
					var strId = $(this).parent().parent().prop('id');
					//定义提交Url参数
					var strUrl = "";
					
					
					/*
					 	zepto在获取元素属性的时候,
					 	如果是html自有属性,建议用prop(),优先级比attr()高
					 	自定义的属性,一定要用attr(),不然取不到数据
					 */
									
					
					//单选+多选筛选
						curLen = $('.m-filter-sort .current').length;
						// 参数集合
						var arrUrlPlus = "";
						//console.log(curLen);
						if(curLen == 1){
							//单个筛选
								if(strId == "order_restaurant"){
									strUrl = "&sortField="+$(this).attr("okey");
									tabId = 0;						
								}else if(strId == "order_region"){
									strUrl = "&countyId="+$(this).html();
									tabId = 1;
								}else if(strId == "order_cuisine"){
									strUrl = "&cuisineId="+$(this).html();
									tabId = 2;
								}else if(strId == "order_group"){
									var sPrice = 0;
									var ePrice = 0;
									
									if($(this).children('span').length == 2){
										var sPrice = $(this).children('span').eq(0).html();
										var ePrice = $(this).children('span').eq(1).html();
									}else if($(this).children('span').length == 1){
										if($(this).children('span').eq(0).html() > 100){
											var sPrice = $(this).children('span').eq(0).html();
											var ePrice = 2000;
										}else{	
											var sPrice = 0;
											var ePrice = $(this).children('span').eq(0).html();
										}
									}
									
									strUrl="&sPrice="+sPrice+"&ePrice="+ePrice;
									tabId = 3;
								}	

								if(arrUrl.length  < curLen){
									arrUrl.push([tabId,strUrl])
									// console.log(12);
								}else{
									// console.log(arrUrl.length)	
									arrUrl[0][0] = tabId;
									arrUrl[0][1] = strUrl;
									// console.log(11);
								}	

								arrUrlPlus = strUrl;

						}else if(curLen <= 4){
							//单个筛选
								if(strId == "order_restaurant"){
									strUrl = "&sortField="+$(this).attr("okey");
									tabId = 0;						
								}else if(strId == "order_region"){
									strUrl = "&countyId="+$(this).html();
									tabId = 1;
								}else if(strId == "order_cuisine"){
									strUrl = "&cuisineId="+$(this).html();
									tabId = 2;
								}else if(strId == "order_group"){
									var sPrice = 0;
									var ePrice = 0;
									
									if($(this).children('span').length == 2){
										var sPrice = $(this).children('span').eq(0).html();
										var ePrice = $(this).children('span').eq(1).html();
									}else if($(this).children('span').length == 1){
										if($(this).children('span').eq(0).html() > 100){
											var sPrice = $(this).children('span').eq(0).html();
											var ePrice = 2000;
										}else{	
											var sPrice = 0;
											var ePrice = $(this).children('span').eq(0).html();
										}
									}
									
									strUrl="&sPrice="+sPrice+"&ePrice="+ePrice;
									tabId = 3;
								}

							//修改数组里的数据(重新筛选)
								if(arrUrl.length < curLen){
									// 插入数据到数组
									//console.log(tabId);
									arrUrl.push([tabId,strUrl]);		
								}else if(arrUrl.length == curLen){
									//console.log(arrUrl[0][1]);
									for(var i=0;i<arrUrl.length;i++){
										//console.log(arrUrl[i][0]);
										if(tabId == arrUrl[i][0]){
											arrUrl[i][1] = strUrl;
										}
									}
									
								}

							// 多个参数连接起来
								for(var j=0;j<arrUrl.length;j++){
									arrUrlPlus = arrUrlPlus + arrUrl[j][1];
								}
							
						}

					// console.log(arrUrl[0][1]);
					//console.log(arrUrlPlus);
					//改变tab标签页的内容
					$('.tab-nav li a span').eq(tabId).html($(this).html());
					
					//多个筛选URL
					
					//arrUrl.push(strUrl);
					//console.log(arrUrl.length);
					

					var strList = "";
						    				
						$.ajax({
							type:"get",
							url:"http://api.51yuchu.com/search/restaurant/do?&cityId="+ cityId +"&lat="+ lat +"&lng="+ lng + arrUrlPlus,
							dataType:"json",
							beforeSend:Loading,
							success:function(data){
								for(var i=0;i<data.value.length;i++){
									strList = strList +'<li class="m-restaurant"><a href="restaurantdetails.html#'+data.value.list[i].restaurant.id+'" class="m-restaurant-img"><img src="'+data.value[i].restaurant.previewUrl+'"alt=""></a><a href="restaurantdetails.html#'+data.value.list[i].restaurant.id+'" class="m-restaurant-text"><h3 class="m-restaurant-tit">'+data.value[i].restaurant.name+'</h3><p class="m-restaurant-region">'+data.value[i].country.name+'</p><p class="m-restaurant-price">'+data.value[i].restaurant.priceStr+'</p></a><div class="m-restaurant-evaluate"><img src="images/bg-pie.png"alt=""><div class="m-evaluate-con"><h4>好评率</h4><p class="m-evaluate-ratio">'+data.value[i].praisePrecent+'％</p><p class="m-evaluate-votes">'+data.value[i].commentAssessment+'&nbsp;票</p></div></div></li>'
								}
								
								$('.m-restaurant-list').html(strList);
								
								//隐藏筛选区
								$('.tab-con').hide();
								//隐藏遮罩层
								$('.m-mask').hide();
							}
						})
					
					
				})
			}
		
		}
		
		//价格排序函数
		function orderPrice(){
			orderRestaurantList($('#order_group li a'));			
		}
		
		//loading函数
		function Loading(XMLHttpRequest){
			$('.g-restaurant').after("<div class='m-loading'><img src='images/loading.gif' /><div>");
	 		$('#restaurant_list').hide();
	
	 		// loading 1秒后隐藏loading,显示列表
	 		setTimeout(function(){
	 			$('.m-loading').hide();
	 			$('#restaurant_list').show();
	 		},500)
		}

	}