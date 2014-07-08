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

	//缓存用户参数, 只计算一次
	var optionsCache = {};


	/**
	 * option(once/menory)
	 * 		=>option.once = true
	 * 		=>option.menory = true
	 * @param  {[type]} options [description]
	 * @return {[type]}         [description]
	 */
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
	 *
	 *	无参数的：正常的队列处理处理,通过add增加,通过fire全部执行
	 * 	实现once的思路：只执行一次fire,之后的add全部都抛弃
	 * 
	 */
	aAron.Callbacks = function(options) {

		//查看缓存
		var options = checkCache(options);

		//存放回调函数
		var list = [];

		//是否记忆
		var memory;

		//第一次回触发(通过add和fireWith内部使用)
		var firingStart;

		//只执行一次
		//在一次执行的时候调用disable清理所有
		var once = options.once;

		//只要不是做一次处理
		//做一个hack标记
		var stack = !options.once && [];

		/**
		 * 内部处理list
		 * @return {[type]} [description]
		 */
		function _fire(data){
			//特殊的处理，只有在第一次执行过fire的时候才会赋值
			//用于记忆的处理,缓存上一次操作的数据
			//在下次add的时候就会调用了
			memory = options.memory && data;

			//执行回调的数量
			//因为记忆的关系,需要取到最后一个索引
			//当作触发的开始
			//通过firingStart
			firingIndex = firingStart || 0;

			//复位
			firingStart = 0;

			var firingLength = list.length;
			for (; list && firingIndex < firingLength; firingIndex++) {
				//触发所有的回调,并且传递对应的上下文与参数
				list[firingIndex].apply(data[0], data[1])
			}

			if ( list ) {
				if ( stack ) { 
					if ( stack.length ) {
						fire( stack.shift() );
					}
				} else if ( memory ) {//如果设置了记忆
					list = [];
				} else { //如果配置只执行一次
					self.disable();
				}
			}

		}

		//提供外面调用的接口
		var self = {

			//队列的长队
			length: 0,

			/**
			 * 增加一个回调函数
			 */
			add: function() {
				if (list) {
					//取出开始的长度,用户缓存记忆调出最后一个
					var start = list.length;

					//入队列
					//用()()的写法是为产生add自己的命名空间
					//让[object]情况下可以递归
					(function add(args) {
						aAron.each(args, function(_, arg) {
							var type = aAron.type(arg);
							if (type === "function") {
								list.push(arg);
								//[object]情况,需要递归
							} else if (arg && arg.length && type !== "string") {
								add(arg);
							}
						});
					})(arguments);

					//如果选择了记忆
					if (memory) {
						//记录下需要记忆处理的索引位置
						firingStart = start;
						_fire(memory);
					}

					self.length = list.length;
				}

				return this;
			},

			/**
			 * 在回调列表中移除指定的回调函数
			 * 通过indexOf找到索引名
			 */
			remove: function() {
				//删除指定fn名
				aAron.each(arguments, function(_, arg) {
					var index;
					//假如能找到这个索引的位置
					while ((index = aAron.inArray(arg, list, index)) > -1) {
						list.splice(index, 1); //删除这个队列
					}
				});
				self.length = list.length;
				return this;
			},

			/**
			 * 清除列表
			 * 针对once的处理,只调用一次
			 * @return {[type]} [description]
			 */
			disable:function(){
				list = stack = undefined;
				return this;
			},

			/**
			 * 加锁
			 * 锁列表的当前状态
			 * @return {[type]} [description]
			 */
			lock:function(){
				stack = undefined;
				if ( !memory ) {
					self.disable();
				}
				return this;
			},

			/**
			 * 传入触发的指定上下文
			 * @return {[type]} [description]
			 */
			fireWith: function(context, args) {
				if(list){
					args = args || [];
					//合并参数
					args = [context, args.slice ? args.slice() : args];
					_fire(args);					
				}
				return this;
			},

			/**
			 * 触发
			 * @return {[type]} [description]
			 */
			fire: function() {
				self.fireWith(this, arguments);
				return this;
			}
		}

		return self;
	}

	return aAron
})


