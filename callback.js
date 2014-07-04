//=================================================
//
//	回调函数
//	aAron.Callbacks()的内部提供了aAron的$.ajax() 和 $.Deferred() 基本功能组件。
//	它可以用来作为类似基础定义的新组件的功能。
//	aAron.Callbacks() 支持的方法，包括 
//	callbacks.add(),callbacks.remove(), callbacks.fire() and callbacks.disable().
//
//	aAron.Callbacks( flags )
//		一个用空格标记分隔的标志可选列表,用来改变回调列表中的行为。
//		
//	这样做的结果是，它使构造复杂的回调列表变得简单，输入值可以通过尽可能多的函数根据需要轻松使用。
//==================================================
define([
	"./core"
], function(aAron) {

	//用户缓存参数
	var optionsCache;

	function createOptions(options) {
		var object = optionsCache[options] = {};
		aAron.each(options.match(aAron.rnotwhite) || [], function(_, flag) {
			object[flag] = true;
		});
		return object;
	}

	function checkCache(options) {
		return options = typeof options === "string" ?
			(optionsCache[options] || createOptions(options)) :
			aAron.extend({}, options);
	}

	/**
	 * 用以下参数创建回调函数列表
	 * 
	 * 一个可选的空格分隔的列表选项,将会改变回调列表的行为或一个更传统的选择对象
	 *
	 * 默认回调列表将会像一个事件回调列表,可以多次“触发”
	 *
	 * 选项：
	 * 	once: 确保回调函数只能触发一次(像一个Deferred)
	 * 	memory: 保持以前的值，将添加到这个列表的后面的最新的值立即执行调用任何回调 (像一个递延 Deferred).
	 * 	unique: 确保一次只能添加一个回调(所以在列表中没有重复的回调).
	 *  stopOnFalse: 当一个回调返回false 时中断调用
	 */
	aAron.Callbacks = function(options) {

		//查看缓存
		var options = checkCache(options);

		//存放回调函数
		var list = [];

		/**
		 * 内部处理list
		 * @return {[type]} [description]
		 */
		function _fire(data){
			//执行回调的数量
			var firingIndex  = 0;
			var firingLength = list.length;
			for (; list && firingIndex < firingLength; firingIndex++) {
				//触发所有的回调,并且传递对应的上下文与参数
				list[firingIndex].apply(data[0], data[1])
			}
		}

		//提供外面调用的接口
		var self = {
			/**
			 * 增加一个回调函数
			 */
			add: function() {
				//入队列
				aAron.each(arguments, function(_, arg) {
					var type = aAron.type(arg);
					if (type === "function") {
						list.push(arg);
					}
				});
			},
			remove: function() {

			},


			/**
			 * 传入触发的指定上下文
			 * @return {[type]} [description]
			 */
			fireWith: function(context, args) {
				args = args || [];
				//合并参数
				args = [context, args.slice ? args.slice() : args];
				_fire(args);
				return this;
			},

			/**
			 * 触发
			 * @return {[type]} [description]
			 */
			fire: function() {
				self.fireWith(this, arguments);
				return this;
			},
		}

		return self;
	}



	function fn1(value) {
		console.log(value);
	}


	function fn2(value) {
		fn1("fn2 says: " + value);
		return false;
	}
		

	var callbacks = aAron.Callbacks();

	callbacks.add(fn1);
	callbacks.fire( "foo!" );
	callbacks.add(fn2);
	callbacks.fire( "2222!" );



	return aAron
})