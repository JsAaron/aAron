//===================================
//		
//	步队列
//	延迟对象，在jQuery的1.5引入，是通过调用jQuery.Deferred()方法创建一个可链式调用的工具对象。 
//	它可以注册多个回调到回调队列， 调用回调队列，准备代替任何同步或异步函数的成功或失败状态。
//	延迟对象是可链式调用的，类似于jQuery对象是可链接的方式，  但它有其自己的方法。
//	创建一个Deferred（延迟）对象后，你可以通过使用下面任何方法 直接从对象创建或者链式调用 或 保存对象的一个变量，
//	调用该变量的一个或多个方法。
//		
//===================================
define([
	"./core",
	"./callbacks"
], function(aAron) {

	aAron.extend({

		Deferred: function(func) {

			//开始状态,构建
			var state = "pending";

			var tuples = [
				// 添加成功, 失败,变化侦听器
				["resolve", "done", aAron.Callbacks("once memory"), "resolved"],
				["reject", "fail", aAron.Callbacks("once memory"), "rejected"],
				["notify", "progress", aAron.Callbacks("memory")]
			];

			var promise = {
				state: function() {

				},
				always: function() {

				},
				then: function() {

				},
				promise: function() {

				}
			};


			aAron.each(tuples, function(i, tuple) {
				//获取回调对象
				var list = tuple[2],
					stateString = tuple[3];

				//给promise添加[ done | fail | progress ] = list.add
				promise[ tuple[1] ] = list.add;

				if (stateString) {
					//注册成功后处理
					//1 resolved或者rejected后修正状态
					//2 [ reject_list | resolve_list ].disable
					//3 progress_list.lock
					list.add(function() {
						state = stateString;
					}, tuples[i ^ 1][2].disable, tuples[2][2].lock);
				}



			});

			console.log(promise)



		},

		when: function() {

		}

	})



	return aAron;
});