//=================================
//		
//	sizzle选择器 引擎
//	1 html
//	2 xml
//=================================
define(["./core"], function(aAron) {

	var Sizzle = (function(window) {

		var Expr,
			support,
			isXML,
			docElem,
			document,
			setDocument,
			documentIsHTML,

			//css3选择器支持
			rbuggyQSA,
			rbuggyMatches,
				
			//包含
			contains, 
			//排序
			sortOrder,

			preferredDoc = window.document,

			//实例方法
			hasOwn      = ({}).hasOwnProperty,
			arr         = [],
			pop         = arr.pop,
			push_native = arr.push,
			push        = arr.push;


		var expando = "sizzle" + -(new Date());
		var rnative = /^[^{]+\{\s*\[native \w/;


		//做push的处理，push支不支持Nodelist
		//因为Nodelist不是数组，所以在某些浏览器下没有Push方法，
		//需要伪造一个支持nodelist的push方法
		try {
			push.apply(
				(arr = slice.call( preferredDoc.childNodes )),
				preferredDoc.childNodes
			);
			// 防止安卓4.0以下版本静默失败(失败了但不报错)。
			arr[ preferredDoc.childNodes.length ].nodeType;
		} catch ( e ) {
		    //如果arr有值，即arr.length > 0，
		    //说明上述push方法是有效的，使用原生API，否则换成自己的方法
			push = { apply: arr.length ?

				function( target, els ) {
					//这里一定要用apply,否则会把整个els给Push进去而不是拆成一个个push
					push_native.apply( target, slice.call(els) );
				} :
				// Support: IE<9
				// Otherwise append directly
				function( target, els ) {
					var j = target.length,
						i = 0;
					// Can't trust NodeList.length
					while ( (target[j++] = els[i++]) ) {}
					target.length = j - 1;
				}
			};
		}


		/**
		 * 选择器入口
		 */
		function Sizzle() {

		}


		/**
		 * 选择器的表达式
		 * @type {[type]}
		 */
		Expr = Sizzle.selectors = {

			find: {},

			filter: function() {

			}
		}



		/**
		 * 做功能测试,直接操作元素节点特性判断
		 * 通过创建一个div元素，检测被传入的fn是否被当前浏览器支持
		 * @param {Function} 
		 */
		function assert(fn) {
			var div = document.createElement("div");
			//此处用try-catch的原因是：被传入的fn很有可能是会报错的。
			//因为fn中用的方法或属性很可能不被当前浏览器所支持。
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


		//主要功能是根据各个浏览器对原生方法的支持情况对当前浏览器是否支持某方法进行判别
		setDocument = Sizzle.setDocument = function(node) {

			var hasCompare,
				// node是入口函数中传入的context。例如：$( "a", b )。 这里的node指的就是b
				// 如果传入了node，则拿到node所在的document，如果node没有ownerDocument，说
				// 明它本身就是document； 如果没有传入node，则使用preferredDoc（它的值是window.document）
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
			 * IE7中通过getAttribute获取input的placeholder，结果是null
			 * 使用getAttributeNode得到属性节点，再通过nodeValue得到该属性节点的值
			 * https://www.imququ.com/post/getattribute-and-getattributenode.html
			 * @param  {[type]} div [description]
			 * @return {[type]}     [description]
			 */
			support.attributes = assert(function( div ) {
				div.className = "i"; //设置一个属性
				return !div.getAttribute("className");
			});

			/**
			 * getElementsByTagName() 方法可返回带有指定标签名的对象的集合。
			 * 判断getEBTN是否只返回元素节点（某些浏览器使用该方法会返回元素节点和注释节点）
			 * @param  {[type]} div [description]
			 * @return {[type]}     [description]
			 */
			support.getElementsByTagName = assert(function( div ) {
				div.appendChild( doc.createComment("") );
				return !div.getElementsByTagName("*").length;
			});


			support.getElementsByClassName = rnative.test( doc.getElementsByClassName ) && assert(function( div ) {
				div.innerHTML = "<div class='a'></div><div class='a i'></div>";
				div.firstChild.className = "i";
				return div.getElementsByClassName("i").length === 2;
			});


			support.getById = assert(function( div ) {
				docElem.appendChild( div ).id = expando;
				return !doc.getElementsByName || !doc.getElementsByName( expando ).length;
			});


		    //Expr里的函数分为查找和过滤两种功能类型。
		    //接下来分别进行这两种函数功能性的检测和支持
			if ( support.getById ) {
				Expr.find["ID"] = function( id, context ) {
					if ( typeof context.getElementById !== strundefined && documentIsHTML ) {
						var m = context.getElementById( id );
						return m && m.parentNode ? [ m ] : [];
					}
				};
				Expr.filter["ID"] = function( id ) {
					var attrId = id.replace( runescape, funescape );
					return function( elem ) {
						return elem.getAttribute("id") === attrId;
					};
				};
			} else {
				// Support: IE6/7
				// getElementById并不可靠,找到捷径
				delete Expr.find["ID"];
				Expr.filter["ID"] =  function( id ) {
					var attrId = id.replace( runescape, funescape );
					return function( elem ) {
						var node = typeof elem.getAttributeNode !== strundefined && elem.getAttributeNode("id");
						return node && node.value === attrId;
					};
				};
			}

			// Tag
			Expr.find["TAG"] = support.getElementsByTagName ?
				function( tag, context ) {
					if ( typeof context.getElementsByTagName !== strundefined ) {
						return context.getElementsByTagName( tag );
					}
				} :
				function( tag, context ) {
					var elem,
						tmp = [],
						i = 0,
						results = context.getElementsByTagName( tag );

					// Filter out possible comments
					if ( tag === "*" ) {
						while ( (elem = results[i++]) ) {
							if ( elem.nodeType === 1 ) {
								tmp.push( elem );
							}
						}

						return tmp;
					}
					return results;
				};

			// Class
			Expr.find["CLASS"] = support.getElementsByClassName && function( className, context ) {
				if ( typeof context.getElementsByClassName !== strundefined && documentIsHTML ) {
					return context.getElementsByClassName( className );
				}
			};



			/* QSA/matchesSelector
			 * 如果浏览器支持querySelectorAll
			 * 修复各种浏览器下的兼容问题
			---------------------------------------------------------------------- */

			// matchesSelector(:active) reports false when true (IE9/Opera 11.5)
			rbuggyMatches = [];

			// qSa(:focus) reports false when true (Chrome 21)
			// We allow this because of a bug in IE8/9 that throws an error
			// whenever `document.activeElement` is accessed on an iframe
			// So, we allow :focus to pass through QSA all the time to avoid the IE error
			// See http://bugs.jquery.com/ticket/13378
			// 用来存放有bug的QSA字符串，最后用|连接起来当作正则表达式，用来检测选择符是否有bug
			rbuggyQSA = [];


			//检测在不同版本存在的qsa的BUG
			if ( (support.qsa = rnative.test( doc.querySelectorAll )) ) {
				// Build QSA regex
				// Regex strategy adopted from Diego Perini
				// 这两个assert没有返回值，主要是把有bug的QSA字符串检测出来。
				assert(function( div ) {
					// Select is set to empty string on purpose
					// This is to test IE's treatment of not explicitly
					// setting a boolean content attribute,
					// since its presence should be enough
					// http://bugs.jquery.com/ticket/12359
					div.innerHTML = "<select msallowclip=''><option selected=''></option></select>";

					// Support: IE8, Opera 11-12.16
					// Nothing should be selected when empty strings follow ^= or $= or *=
					// The test attribute must be unknown in Opera but "safe" for WinRT
					// http://msdn.microsoft.com/en-us/library/ie/hh465388.aspx#attribute_section
					if ( div.querySelectorAll("[msallowclip^='']").length ) {
						rbuggyQSA.push( "[*^$]=" + whitespace + "*(?:''|\"\")" );
					}

					// Support: IE8
					// Boolean attributes and "value" are not treated correctly
					if ( !div.querySelectorAll("[selected]").length ) {
						rbuggyQSA.push( "\\[" + whitespace + "*(?:value|" + booleans + ")" );
					}

					// Webkit/Opera - :checked should return selected option elements
					// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
					// IE8 throws error here and will not see later tests
					if ( !div.querySelectorAll(":checked").length ) {
						rbuggyQSA.push(":checked");
					}
				});

				assert(function( div ) {
					// Support: Windows 8 Native Apps
					// The type and name attributes are restricted during .innerHTML assignment
					var input = doc.createElement("input");
					input.setAttribute( "type", "hidden" );
					div.appendChild( input ).setAttribute( "name", "D" );

					// Support: IE8
					// Enforce case-sensitivity of name attribute
					if ( div.querySelectorAll("[name=d]").length ) {
						rbuggyQSA.push( "name" + whitespace + "*[*^$|!~]?=" );
					}

					// FF 3.5 - :enabled/:disabled and hidden elements (hidden elements are still enabled)
					// IE8 throws error here and will not see later tests
					if ( !div.querySelectorAll(":enabled").length ) {
						rbuggyQSA.push( ":enabled", ":disabled" );
					}

					// Opera 10-11 does not throw on post-comma invalid pseudos
					div.querySelectorAll("*,:x");
					rbuggyQSA.push(",.*:");
				});
			}

			if ( (support.matchesSelector = rnative.test( (matches = docElem.matches ||
				docElem.webkitMatchesSelector ||
				docElem.mozMatchesSelector ||
				docElem.oMatchesSelector ||
				docElem.msMatchesSelector) )) ) {
				assert(function( div ) {
					// Check to see if it's possible to do matchesSelector
					// on a disconnected node (IE 9)
					support.disconnectedMatch = matches.call( div, "div" );
					// This should fail with an exception
					// Gecko does not error, returns false instead
					matches.call( div, "[s!='']:x" );
					rbuggyMatches.push( "!=", pseudos );
				});
			}

			rbuggyQSA = rbuggyQSA.length && new RegExp( rbuggyQSA.join("|") );
			rbuggyMatches = rbuggyMatches.length && new RegExp( rbuggyMatches.join("|") );


			/* Contains
			 * 确定一个元素是否被包含在另外一个元素当中
			 * contains()是ie下的写法，ff不支持
			 * compareDocumentPosition()是w3c的标准，所以ff会支持。
			---------------------------------------------------------------------- */
			hasCompare = rnative.test( docElem.compareDocumentPosition );

			contains = hasCompare || rnative.test( docElem.contains ) ?
				function( a, b ) {
					var adown = a.nodeType === 9 ? a.documentElement : a,
						bup = b && b.parentNode;
					return a === bup || !!( bup && bup.nodeType === 1 && (
						adown.contains ?
							adown.contains( bup ) :
							a.compareDocumentPosition && a.compareDocumentPosition( bup ) & 16
					));
				} :
				function( a, b ) {
					if ( b ) {
						while ( (b = b.parentNode) ) {
							if ( b === a ) {
								return true;
							}
						}
					}
					return false;
				};


			/* 排序
			---------------------------------------------------------------------- */

			// Document order sorting
			sortOrder = hasCompare ?

			function( a, b ) {

				// Flag for duplicate removal
				if ( a === b ) {
					hasDuplicate = true;
					return 0;
				}

				// Sort on method existence if only one input has compareDocumentPosition
				var compare = !a.compareDocumentPosition - !b.compareDocumentPosition;
				if ( compare ) {
					return compare;
				}

				// Calculate position if both inputs belong to the same document
				compare = ( a.ownerDocument || a ) === ( b.ownerDocument || b ) ?
					a.compareDocumentPosition( b ) :

					// Otherwise we know they are disconnected
					1;

				// Disconnected nodes
				if ( compare & 1 ||
					(!support.sortDetached && b.compareDocumentPosition( a ) === compare) ) {

					// Choose the first element that is related to our preferred document
					if ( a === doc || a.ownerDocument === preferredDoc && contains(preferredDoc, a) ) {
						return -1;
					}
					if ( b === doc || b.ownerDocument === preferredDoc && contains(preferredDoc, b) ) {
						return 1;
					}

					// Maintain original order
					return sortInput ?
						( indexOf.call( sortInput, a ) - indexOf.call( sortInput, b ) ) :
						0;
				}

				return compare & 4 ? -1 : 1;
			} :
			function( a, b ) {
				// Exit early if the nodes are identical
				if ( a === b ) {
					hasDuplicate = true;
					return 0;
				}

				var cur,
					i = 0,
					aup = a.parentNode,
					bup = b.parentNode,
					ap = [ a ],
					bp = [ b ];

				// Parentless nodes are either documents or disconnected
				if ( !aup || !bup ) {
					return a === doc ? -1 :
						b === doc ? 1 :
						aup ? -1 :
						bup ? 1 :
						sortInput ?
						( indexOf.call( sortInput, a ) - indexOf.call( sortInput, b ) ) :
						0;

				// If the nodes are siblings, we can do a quick check
				} else if ( aup === bup ) {
					return siblingCheck( a, b );
				}

				// Otherwise we need full lists of their ancestors for comparison
				cur = a;
				while ( (cur = cur.parentNode) ) {
					ap.unshift( cur );
				}
				cur = b;
				while ( (cur = cur.parentNode) ) {
					bp.unshift( cur );
				}

				// Walk down the tree looking for a discrepancy
				while ( ap[i] === bp[i] ) {
					i++;
				}

				return i ?
					// Do a sibling check if the nodes have a common ancestor
					siblingCheck( ap[i], bp[i] ) :

					// Otherwise nodes in our document sort first
					ap[i] === preferredDoc ? -1 :
					bp[i] === preferredDoc ? 1 :
					0;
			};

			return doc;
		};


		//初始化兼容处理
		setDocument();



		return Sizzle();

	})(window);

	//扩展静态方法
	aAron.find = Sizzle;

	return aAron;
})