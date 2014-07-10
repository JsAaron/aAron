//=================================
//		
//	sizzle选择器 引擎
//	1 html
//	2 xml
//=================================
define(["./core"], function(aAron) {

	var Sizzle = (function(window) {

		var support,
			isXML,
			docElem,
			document,
			setDocument,
			documentIsHTML,
			preferredDoc = window.document;

		/**
		 * 选择器入口
		 */
		function Sizzle() {

		}


		/**
		 * 做功能测试,直接操作元素节点特性判断
		 * @param {Function} 
		 */
		function assert(fn) {
			var div = document.createElement("div");
			try {
				//!!一般用来将后面的表达式强制转换为布尔类型的数据（boolean），
				//!也就是只能是true或者false
				return !!fn(div);
			} catch (e) {
				return false;
			} finally {
				// 移除这个测试的节点
				if (div.parentNode) {
					div.parentNode.removeChild(div);
				}
				//针对ie释放内存
				div = null;
			}
		}


		//=====================================================
		//
		//				浏览器支持判断
		//
		//=====================================================
		support = Sizzle.support = {};


		/**
		 * 判断是不是xml文档
		 * 通过根据判断根节点documentElement
		 * 但是不能保证根节点不是HTML!
		 * @param  {[type]}  elem [description]
		 * @return {Boolean}      [description]
		 */
		isXML = Sizzle.isXML = function(elem) {
			var documentElement = elem && (elem.ownerDocument || elem).documentElement;
			return documentElement ? documentElement.nodeName !== "HTML" : false;
		};


		setDocument = Sizzle.setDocument = function(node) {

			var hasCompare,
				doc = node ? node.ownerDocument || node : preferredDoc,
				//ie9才出现的
				//document.defaultView（）返回当前窗口对象包含的document
				parent = doc.defaultView;

			// Set our document
			document = doc;
			docElem = doc.documentElement;

			//通过判断
			//documentElement.nodeName !== "HTML" 
			documentIsHTML = !isXML(doc);


			//Support: IE>8
			//iframe的处理

			/**
			 * 针对属性的处理
			 * 确认getAttribute真的返回属性而不是属性(除了IE8布尔值)
			 * @param  {[type]} div [description]
			 * @return {[type]}     [description]
			 */
			support.attributes = assert(function( div ) {
				div.className = "i"; //设置一个属性
				return !div.getAttribute("className");
			});

			/**
			 * getElementsByTagName() 方法可返回带有指定标签名的对象的集合。
			 * @param  {[type]} div [description]
			 * @return {[type]}     [description]
			 */
			support.getElementsByTagName = assert(function( div ) {
				div.appendChild( doc.createComment("") );
				return !div.getElementsByTagName("*").length;
			});


		};



		setDocument();


		console.log(support)



		return Sizzle();

	})(window);

	//扩展静态方法
	aAron.find = Sizzle;

	return aAron;
})