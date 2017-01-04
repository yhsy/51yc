
// 默认载入(餐厅搜索)
	//热门搜索--关键词数据
	// SchHotAjax("restaurant");
	// console.log(window.location.hash);
	// 默认载入，获取本地数据
		var user = store.get('user');
		// var token = user.token;
		var lng = user.lng;
		var lat = user.lat;
		var cityId = user.cityId;

	// 获取路由参数
	var httpUrl = window.location.hash;
	// console.log(httpUrl.length);
	// 截取字符串cate
	// console.log(httpUrl.slice(1,5))
	// 用字符串的值判断(适用于多个)
	// if(httpUrl.slice(1,5) == "cate"){
	if(httpUrl.length > 0){
		$(".m-country-tab2 li").removeClass("tab-active");
		$(".m-country-tab2 li:last").addClass("tab-active");
		console.log($(".m-country-tab2 li:last").html());
		SchHotAjax("dish");
	}else{
		SchHotAjax("restaurant");
	}

	// 搜索历史--关键词(从数据库还是从本地)


	// 餐厅搜索--热门搜索关键词--函数
		function SchHotAjax(url){
			$.ajax({
				type:"get",
				url:"http://api.51yuchu.com/search/"+url+"/hot/keyword/list?top=10",
				dataType:"json",
				success:function(data){
					var hotList = "";
					if(data.succeed){
						// console.log(data);
						for(var i=0;i<data.value.length;i++){
							hotList += '<li><a href="javascript:;">'+data.value[i].key+'</a></li>';
						}
						$('#sch_hot_list').html(hotList);
						// console.log($("#sch_hot_list li a").length);
						$("#sch_hot_list li a").click(function(){
							// console.log($(this).html());
							restaurantList($(this).html());
						})

					}
				}
					
			})
		}

		/*餐厅列表获取Ajax函数*/ 
		function restaurantList(even){
			$("#btn_sch_close").hide();
			$('.m-mask-bd').hide();

			var strList = "";
			$.ajax({
				type:"get",
				url:"http://api.51yuchu.com/search/restaurant/do?cityId="+ cityId +"&lat="+ lat +"&lng="+ lng +"&keyword="+even,
				dataType:"json",
				beforeSend:Loading,
				success:function(data){
					if(data.succeed){
						for(var i=0;i<data.value.length;i++){
							strList = strList +'<li class="m-restaurant"><a href="restaurantdetails.html#'+data.value[i].restaurant.id+'"class="m-restaurant-img"><img src="'+data.value[i].restaurant.previewUrl+'"alt=""></a><a href="restaurantdetails.html#'+data.value[i].restaurant.id+'" class="m-restaurant-text"><h3 class="m-restaurant-tit">'+data.value[i].restaurant.name+'</h3><p class="m-restaurant-region">'+data.value[i].country.name+'</p><p class="m-restaurant-price">'+data.value[i].restaurant.priceStr+'</p></a><div class="m-restaurant-evaluate"><img src="images/bg-pie.png"alt=""><div class="m-evaluate-con"><h4>好评率</h4><p class="m-evaluate-ratio">'+data.value[i].praisePrecent+'％</p><p class="m-evaluate-votes">'+data.value[i].commentAssessment+'&nbsp;票</p></div></div></li>'
						}	
						
						$('#restaurant_list').html(strList);
					}
					
				}
			})
		}

		// loading函数
		/*
			loading图片插入的关键是 Ajax里的beforeSend参数(在success之前执行);
		*/ 
		function Loading(XMLHttpRequest){
			$(".m-loading").remove();
			$('.g-restaurant').before("<div class='m-loading'><img src='images/loading.gif' /><div>");
	 		$('#restaurant_list').hide();

	 		// loading 1秒后隐藏loading,显示列表
	 		setTimeout(function(){
	 			$('.m-loading').hide();
	 			$('#restaurant_list').show();
	 		},500)
		}



// 页面载入完成后
	$(function(){		
		// 联想搜索功能
			//页面载入，默认获取输入框焦点
			setTimeout(function(){
			  	try{
				    var t = $('#search_ipt')
					    t.focus();
					    t.select();
				  	} catch(e){
				  		
				  	}
			}, 200);

			// 当输入关键词时
			$("#search_ipt").bind("keyup",function(event){ 
				// 显示删除按钮
				$("#btn_sch_close").show();

				// 联想搜索
					/*
						1.每次输入的时候获取输入的值
						2.获取完之后马上Ajax提交,返回所需的data数据
						3.把获得的数据循环插入到 ul中
					*/ 
				// 过滤关键词:中文输入的内容不能为空格" ",英文输入长度要大于等于1
				if($(this).val().length>=1 & $(this).val()!== " "){
					var strHtml = "";
					$.ajax({
						type:"get",
						url:"http://api.51yuchu.com/search/restaurant/do?cityId="+ cityId +"&lat="+ lat +"&lng="+ lng +"&keyword="+$("#search_ipt").val(),
						dataType:"json",
						success:function(data){
							// console.log(data.value.length);
							/*
								餐厅名:data.value[0].restaurant.name
								餐厅数量:暂无
							*/ 

							// 循环取出数据
							for(var i=0;i<data.value.length;i++){
								strHtml = strHtml + '<li class="sch-think"><i class="icon-schs"></i><span class="u-restaurant-name">'+data.value[i].restaurant.name+'</span><div class="u-sch-count"><em>12</em>&nbsp;个结果</div></li>';
							}

							// 显示搜索联想列表
							$(".m-mask-bd").show();
							//插入数据到列表
							$('#think_list').html(strHtml);
							// console.log(strHtml);

							// 点击联想搜索列表
							$('.sch-think').click(function(){
								restaurantList($(this).children('span').html());
							})

							


							// 按回车(表示关键词输入完成)
							var knum = 0;
							if(event.keyCode == "13"){
								knum ++; 
								// store.set('sch-history',{kval:$("#search_ipt").val()});
								restaurantList($("#search_ipt").val());
								
			        		}
							
							
						}
					})
				}				

			}); 

			// 点击清空按钮--输入的内容清空
			$("#btn_sch_close").click(function(){
				// console.log($("#search_ipt").val());
				// 清空输入框里的内容
				$("#search_ipt").val('');	
				// 隐藏清空按钮
				$(this).hide();
				// 联想搜索列表的内容清空
				$('#think_list').html('');	
				// 隐藏联想搜索列表
				$(".m-mask-bd").hide();
			})
		// 联想搜索结束

		// tab标签切换Ajax
			//点击热门关键词
			// $(".m-hot-list li a").click(function(){
			// 	console.log($(this).html());
			// 	restaurantList($(this).html());
			// })

			// $('sch_hot_list li').click(function(){
			// 	// restaurantList($(this).html());
			// 	console.log(111);
			// })

			// console.log($("#sch_hot_list li a").html());

			// 点击餐厅搜索
			$('#sch_restaurant').click(function(){
				// 热门关键词
					SchHotAjax("restaurant");
				// 搜索历史

				// console.log($("#sch_hot_list li a").length)
			})


			// 点击美食搜索
			$('#sch_cate').click(function(){
				// 热门关键词
				SchHotAjax("dish");

				// console.log($(".sch-hot-list li a").length);
				// 搜索历史
			})


			// console.log($("#sch_hot_list li a").length);		

	})	
