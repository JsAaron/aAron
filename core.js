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

	var class2type = {

	}


	function Ree(selector, context) {
		return new Ree.fn.init(selector, context);
	}

	Ree.fn = Ree.prototype = {

	}

	/**
	 * 对象的扩展
	 * 旧版的IE,认为object原型方法不应该被遍历
	 * ['hasOwnProperty', 'valueOf', 'isPrototypeOf', 'propertyIsEnumerable',
	 *  'toLocaleString', 'toString', 'constructor'];
	 *  .extend( target [, object1 ] [, objectN ] )
	 *  .extend( [deep ], target, object1 [, objectN ] )
	 */
	Ree.extend = Ree.fn.extend = function() {
		var options, src, copy,
			target = arguments[0] || {},
			i = 1,
			length = arguments.length;

		//只有一个参数，就是对jQuery自身的扩展处理
		//extend,fn.extend
		if(i === length){
			target = this;//调用的上下文对象jQuery/或者实例
			i--;
		}

		for (; i < length; i++) {
			//从i开始取参数,不为空开始遍历
			if ((options = arguments[i]) != null) {
				for (name in options) {
					copy = options[name];
					//覆盖拷贝
					target[name] = copy;
				}
			}
		}

		return target;
	}


	//扩展静态方法
	Ree.extend({
		
		/**
		 * 类型判断
		 * typeof 无法判断函数
		 * instanceof 在跨iframe下出错
		 * @return {[type]} [description]
		 */
		type: function() {

		},

		/**
		 * 遍历对象或者数组
		 * collection, callback(indexInArray, valueOfElement)
		 * @return {[type]} [description]
		 */
		each:function(){

		}

	})


	//扩充类型判断
	Ree.each("Boolean Number String Function Array Date RegExp Object Error".split(" "), function(i, name) {
		class2type["[object " + name + "]"] = name.toLowerCase();
	});


	//判断是不是一个真正的数组
	//1 是否有长度
	//2 类型
	function isArraylike(obj) {
		var length = obj.length,
			type = Ree.type(obj);

		if (type === "function" || jQuery.isWindow(obj)) {
			return false;
		}

		if (obj.nodeType === 1 && length) {
			return true;
		}

		return type === "array" || length === 0 ||
			typeof length === "number" && length > 0 && (length - 1) in obj;
	}



	//根节点引用
	var rootjQuery,

		//======================================
		//	用来匹配简单的id选择器
		//	匹配HTML标记和ID表达式（<前面可以匹配任何空白字符，包括空格、制表符、换页符等等）
		//======================================
		//	^(?:\s*(<[\w\W]+>)[^>]*
		//	
		// (?:pattern) : 匹配 pattern 但不获取匹配结果，也就是说这是一个非获取匹配，不进行存储供以后使用
		// \s* : 匹配任何空白字符，包括空格、制表符、换页符等等 零次或多次 等价于{0,}
		// (pattern) : 匹配pattern 并获取这一匹配。所获取的匹配可以从产生的 Matches 集合得到，使用 $0…$9 属性
		// [\w\W]+ : 匹配于'[A-Za-z0-9_]'或[^A-Za-z0-9_]' 一次或多次， 等价{1,}
		// (<[wW]+>) :这个表示字符串里要包含用<>包含的字符，例如<p>,<div>等等都是符合要求的
		// [^>]* : 负值字符集合,字符串尾部是除了>的任意字符或者没有字符,零次或多次等价于{0,},
		//	
		//	
		//	|#([\w-]*))$
		//	
		//	匹配结尾带上#号的任意字符，包括下划线与-
		//	
		//	<div id=top></div>
		//	#test
		rquickExpr = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/,

		init = Ree.fn.init = function(selector, context) {

			var match,elem;

			//如果传递是字符串
			if (typeof selector === 'string') {

				//匹配简单<html>或者id匹配器
				match = rquickExpr.exec(selector);

				if (match && (match[1] || !context)) {
					if (match[1]) {
						//匹配器<div>结构
					} else {
						//匹配$("#id")
						elem = document.getElementById(match[2])
						//如果是黑莓手机,需要检测parentNode
						if (elem && elem.parentNode) {
							//将元素直接注入到jQuery对象
							this.length = 1;
							this[0] = elem;
						}
						this.context = document;
						this.selector = selector;
						console.log(this)
						return this;
					}
				}
				//Ree(document)
				//初始化DOM节点
			} else if (selector.nodeType) {
				this.context = this[0] = selector;
				this.length = 1;
				return this;
			}
	
		};


	//静态方法与实例方法共存处理
	init.prototype = Ree.fn;	

	//初始化根节点引用
	rootjQuery = Ree(document);


	return Ree;
});