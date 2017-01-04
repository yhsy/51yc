		
		
		//设置默认rem宽度
		// 设置动态像素比(默认)
		var pixelRatio = 1 / window.devicePixelRatio;
		document.write('<meta name="viewport" content="width=device-width,user-scalable=no,initial-scale='+pixelRatio+',minimum='+pixelRatio+',maximum='+pixelRatio+' " />');

		// 设置默认的 rem大小
		remFontSize();
		function remFontSize(){	
			// 设置动态像素比

			// 默认meta获取
			var pixelRatio = 1 / window.devicePixelRatio;

			var _meta = document.getElementsByTagName('meta')[1];
			var _metaName = _meta["name"];
			var _metaContant = _meta["content"];					
			_metaContant = "width=device-width,user-scalable=no,initial-scale="+pixelRatio+",minimum="+pixelRatio+",maximum="+pixelRatio;
			// alert(_metaContant);


			// 设置默认的 rem大小
			_html = document.getElementsByTagName("html")[0];
			_width = document.documentElement.clientWidth;
			// 如果宽度大于640,那就显示默认宽度,否则就显示640宽度
			// _width = _width > 640 ? 640 :_width;
			_html.style.fontSize = _width/16 + "px";
			
			// alert(_html.style.fontSize);
			// 
			
		}			

		//添加监听事件(当屏幕大小发生变化的时候,动态设置rem) 
		window.addEventListener("resize",remFontSize,false);
		// 添加监听事件(当横竖屏发生变化时，动态设置rem)
		window.addEventListener("orientationchange",remFontSize,false);

		// 动态像素比
		// document.write('<meta name="viewport" content="width=device-width,user-scalable=no,initial-scale='+pixelRatio+',minimum='+pixelRatio+',maximum='+pixelRatio+' " />');
		// 