/**
 * 核心模块
 * @return {[type]} [description]
 */
define(function() {

	var emptyArray  = [];
	var slice       = emptyArray.slice;
	var concat      = emptyArray.concat;
	var push        = emptyArray.push;
	var indexOf     = emptyArray.indexOf;
	var emptyObject = {};
	var toString    = emptyObject.toString;
	var hasOwn      = emptyObject.hasOwnProperty;

	var document = window.document;


	function Ree(selector, context) {
		return new Ree.fn.init(selector, context);
	}

	Ree.fn = Ree.prototype = {

	}


	//======================================
	//	用来匹配简单的id选择器
	//======================================
	//	^(?:\s*(<[\w\W]+>)[^>]*
	//	|#([\w-]*))$
	//	
	//	
	//	
	//
	var rquickExpr = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/,
		init = Ree.fn.init = function(selector, context) {

			//如果传递是字符串
			if (typeof selector === 'string') {

			}



			console.log(arguments)
		}


	//静态方法与实例方法共存处理
	init.prototype = Ree.fn;

	return Ree
});