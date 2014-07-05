//=======================================
//
//	数据缓存:
//		方法允许我们在DOM元素上绑定任意类型的数据,避免了循环引用的内存泄漏风险。
//		
//=======================================
define([
	"./core"
], function(aAron) {

	/**
	 * 确保是一个对象有数据
	 */
	aAron.acceptData = function( owner ) {
		//只接受几种类型
		//元素节点
		//文档节点
		//任何对象
		return owner.nodeType === 1 || owner.nodeType === 9 || !( +owner.nodeType );
	};


	function Data() {
		//向下兼容
		//旧版本的Webkit没有对象的定义
		Object.defineProperty(this.cache = {}, 0, {
			get: function() {

			}
		})

		//UUID基于版本号+随机数
		//避免一个用户引入多个版本的同样的库
		this.expando = aAron.expando + Math.random();
	}

	//生成唯一的UUID
	Data.uid = 1;

	var dataProto = Data.prototype;


	dataProto.key = function(){


	}


	dataProto.set = function(){

		
	}


	dataProto.get = function(){

		
	}



	//内部使用的缓存
	var data_priv = new Data();

	//用户使用的缓存
	var data_user = new Data();

	console.log(data_user)


	/**
	 * 扩展静态方法
	 */
	aAron.extend({
		data:function(){

		}
	});


	/**
	 * 扩展实例方法
	 */
	aAron.fn.extend({
		data:function(){

		}
	});



	return aAron;
})