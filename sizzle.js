//=================================
//		
//	sizzle选择器 引擎
//	1 html
//	2 xml
//=================================
define(["./core"],function(aAron) {

	var Sizzle = (function(window){

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
		function Sizzle(){

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






		};





		setDocument();


		console.log(support)



		return Sizzle();

	})(window);

	//扩展静态方法
	aAron.find = Sizzle;

	return aAron;
})