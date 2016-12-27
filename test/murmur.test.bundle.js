/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	let Murmur = __webpack_require__(1);
	console.log(Murmur);
	let wxParser = __webpack_require__(7);
	let root = wxParser.parseStart(`<div class="{position}" data-resourceid="4902196" mm-repeat="a in repeat">
	<p>{name}</p>is {position} {src}
	<img src='{src}'/>
	</div>`);

	let rootDom = Murmur.convert(root);
	document.body.appendChild(rootDom.create({
	    src: 'http://ggoer.com/favicon.ico',
	    name: 'luwenxu',
	    position: 'fe',
	    repeat: [1, 2]
	}));
	console.log(rootDom);
	setTimeout(function () {
	    rootDom.update({
	        name: 'daidai',
	        position: 'be'
	    });
	}, 3000);

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	let Murmur = __webpack_require__(2)['default'];
	module.exports = Murmur;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var murmur_creator_1 = __webpack_require__(3);
	function isMurmur(obj) {
	    return obj instanceof Murmur;
	}
	var Murmur = function () {
	    function Murmur(tagName, attr, children) {
	        this._fileds = {};
	        this.nodeName = tagName;
	        this.attr = attr;
	        this.children = children;
	    }
	    Murmur.prototype.create = function (model) {
	        if (model === void 0) {
	            model = null;
	        }
	        this.model = model;
	        return this._connected = murmur_creator_1.default().create(this, model);
	    };
	    Murmur.prototype.update = function (updateObj) {
	        var newKeys = Object.keys(updateObj),
	            oldKeys = Object.keys(this._fileds);
	        for (var _i = 0, newKeys_1 = newKeys; _i < newKeys_1.length; _i++) {
	            var nk = newKeys_1[_i];
	            if (oldKeys.indexOf(nk) !== -1) {
	                var v = updateObj[nk],
	                    field = this._fileds[nk];
	                if (field.attrCatcher) {
	                    field.attrCatcher.value = v;
	                } else {
	                    this._connected.textContent = v;
	                }
	            }
	        }
	        for (var _a = 0, _b = this.children; _a < _b.length; _a++) {
	            var child = _b[_a];
	            if (isMurmur(child)) {
	                child.update(updateObj);
	            }
	        }
	    };
	    Murmur.convert = function (obj) {
	        if (obj.nodeName) {
	            var nodeName = obj.nodeName,
	                attr = obj.attr,
	                children = obj.children;
	            children = children.map(function (child) {
	                return Murmur.convert(child);
	            });
	            attr = attr.map(function (a) {
	                var attrNode = document.createAttribute(a.name);
	                attrNode.value = a.value;
	                return attrNode;
	            });
	            return new Murmur(nodeName, attr, children);
	        } else {
	            return obj;
	        }
	    };
	    return Murmur;
	}();
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = Murmur;

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var murmur_field_1 = __webpack_require__(4);
	var tools = __webpack_require__(5);
	var murmur_type_1 = __webpack_require__(6);
	var MurmurCreator = function () {
	    function MurmurCreator() {
	        this.extractValueRegexr = /\{\w+\}/g;
	    }
	    MurmurCreator.prototype.create = function (murmur, model) {
	        if (murmur.nodeName === murmur_type_1.MurmurRegexType.TEXTNODE) {
	            return this.createTextNode(murmur, model);
	        } else {
	            var dom = document.createElement(murmur.nodeName);
	            this.attachAttr(dom, model, murmur);
	            this.appendChildren(dom, model, murmur);
	            return dom;
	        }
	    };
	    MurmurCreator.prototype.attachAttr = function (dom, model, murmur) {
	        for (var _i = 0, _a = murmur.attr; _i < _a.length; _i++) {
	            var a = _a[_i];
	            // let key = this.extractFromModel(a.name, model, murmur, MurmurFieldType.ATTR),
	            var value = this.extractFromModel(a.value, model, murmur, a, murmur_type_1.MurmurFieldType.ATTR);
	            // a.name=key;
	            a.value = value;
	            dom.setAttributeNode(a);
	        }
	    };
	    MurmurCreator.prototype.appendChildren = function (parent, model, murmur) {
	        for (var _i = 0, _a = murmur.children; _i < _a.length; _i++) {
	            var child = _a[_i];
	            parent.appendChild(child.create(model));
	        }
	    };
	    MurmurCreator.prototype.createTextNode = function (murmur, model) {
	        var onlyChild = murmur.children[0];
	        var textNode;
	        try {
	            if (tools.isSimpleValue(onlyChild)) {
	                textNode = document.createTextNode(this.extractFromModel(onlyChild, model, murmur));
	            } else {
	                throw new TypeError();
	            }
	        } catch (err) {
	            console.error(err);
	            textNode = document.createTextNode('');
	        } finally {
	            return textNode;
	        }
	    };
	    MurmurCreator.prototype.extractFromModel = function (val, model, murmur, attr, fieldType) {
	        if (attr === void 0) {
	            attr = null;
	        }
	        if (fieldType === void 0) {
	            fieldType = murmur_type_1.MurmurFieldType.TEXT;
	        }
	        var newString = val;
	        if (!tools.isNothing(val)) {
	            var matches = val.match(this.extractValueRegexr);
	            if (matches) {
	                for (var _i = 0, matches_1 = matches; _i < matches_1.length; _i++) {
	                    var m = matches_1[_i];
	                    var key = tools.removeBraceOfValue(m),
	                        value = model[key];
	                    murmur._fileds[key] = new murmur_field_1.default(value, fieldType, attr || null);
	                    newString = val.replace(m, value);
	                }
	            }
	        }
	        return newString;
	    };
	    return MurmurCreator;
	}();
	var MurmurCreatorFactory = function () {
	    var creatorInstance;
	    return function () {
	        return creatorInstance || (creatorInstance = new MurmurCreator());
	    };
	}();
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = MurmurCreatorFactory;

/***/ },
/* 4 */
/***/ function(module, exports) {

	"use strict";

	var MurmurField = function () {
	    function MurmurField(value, type, attrCatcher) {
	        this.value = value;
	        this.type = type;
	        this.attrCatcher = attrCatcher;
	    }
	    return MurmurField;
	}();
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = MurmurField;

/***/ },
/* 5 */
/***/ function(module, exports) {

	"use strict";
	/**
	 * 判断是否是简单值
	 *
	 * @param {any} val
	 * @returns
	 */

	function isSimpleValue(val) {
	    var type = typeof val;
	    return type === 'string' || type === 'number' || false;
	}
	exports.isSimpleValue = isSimpleValue;
	/**
	 * 去除两侧大括号
	 *
	 * @param {string} str
	 * @returns {string}
	 */
	function removeBraceOfValue(str) {
	    return str.slice(1, str.length - 1);
	}
	exports.removeBraceOfValue = removeBraceOfValue;
	/**
	 * 快速排序
	 *
	 * @param {Array} arr
	 * @param {String} arr
	 * @returns
	 */
	function quickSort(arr, sortField) {
	    if (sortField === void 0) {
	        sortField = null;
	    }
	    if (arr.length <= 1) {
	        return arr;
	    }
	    var pivotIndex = Math.floor(arr.length / 2);
	    var pivot = arr.splice(pivotIndex, 1)[0],
	        pivotField = sortField ? pivot[sortField] : pivot;
	    var left = [],
	        right = [];
	    for (var _i = 0, arr_1 = arr; _i < arr_1.length; _i++) {
	        var item = arr_1[_i];
	        var itemField = sortField ? item[sortField] : item;
	        if (itemField < pivotField) {
	            left.push(item);
	        } else {
	            right.push(item);
	        }
	    }
	    return quickSort(left, sortField).concat([pivot], quickSort(right, sortField));
	}
	exports.quickSort = quickSort;
	;
	/**
	 * 判断是否是null或者undefined
	 *
	 * @param {any} val
	 * @returns
	 */
	function isNothing(val) {
	    return val === null || val === undefined;
	}
	exports.isNothing = isNothing;
	/**
	 * 设置默认值并返回
	 *
	 * @param {any} val
	 * @param {any} expected
	 * @returns
	 */
	function setDefault(val, expected) {
	    return isNothing(val) ? val = expected : val;
	}
	exports.setDefault = setDefault;
	/**
	 * 去除等号两侧的空格
	 *
	 * @param {string} str
	 * @returns {string}
	 */
	function removeEqualSpace(str) {
	    return str.replace(/\s*\=\s*/g, '=');
	}
	exports.removeEqualSpace = removeEqualSpace;
	/**
	 * 移除多余的空格
	 *
	 * @param {string} str
	 * @returns {string}
	 */
	function removeMultiSpace(str) {
	    return str.replace(/\s{2,}/g, " ");
	}
	exports.removeMultiSpace = removeMultiSpace;

/***/ },
/* 6 */
/***/ function(module, exports) {

	"use strict";

	exports.MurmurRegexType = {
	    TEXTNODE: 'TEXTNODE',
	    NODESTART: 'NODESTART',
	    NODEEND: 'NODEEND',
	    NODECLOSESELF: 'NODECLOSESELF'
	};
	exports.MurmurFieldType = {
	    ATTR: 'ATTR',
	    TEXT: 'TEXT'
	};

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	module.exports=__webpack_require__(8)['default']();

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var wxParser_tool_1 = __webpack_require__(9);
	var wxParser_type_1 = __webpack_require__(10);
	function isText(obj) {
	    return obj.type == wxParser_type_1.TEXTNODE;
	}
	var WxDomParser = (function () {
	    function WxDomParser() {
	        this.nodeRegex = /(<(\w+)\s*([\s\S]*?)(\/){0,1}>)|<\/(\w+)>|(\{\w+\})/g;
	        this.attrRegex = /[\w\-]+=['"][\s\S]*?['"]/g;
	    }
	    WxDomParser.prototype.parseStart = function (htmlStr) {
	        var matchResult = this.findAllNodes(htmlStr);
	        return this.makeWxTree(matchResult);
	    };
	    WxDomParser.prototype.findAllNodes = function (htmlStr) {
	        var result;
	        var allMatches = [], nextIndex = 0;
	        while (result = this.nodeRegex.exec(htmlStr)) {
	            var match = result[0], startTag = result[1], startTagName = result[2], attr = result[3], endSelf = result[4], endTagName = result[5], exp = result[6];
	            var index = result.index, length_1 = match.length;
	            if (index > nextIndex) {
	                allMatches.push({
	                    type: wxParser_type_1.TEXTNODE,
	                    value: htmlStr.slice(nextIndex, index)
	                });
	            }
	            if (exp) {
	                allMatches.push({
	                    type: wxParser_type_1.TEXTNODE,
	                    value: exp
	                });
	            }
	            nextIndex = index + length_1;
	            var type = void 0;
	            if (startTagName) {
	                type = wxParser_type_1.NODESTART;
	            }
	            else if (endTagName) {
	                type = wxParser_type_1.NODEEND;
	            }
	            else {
	                type = wxParser_type_1.NODECLOSESELF;
	            }
	            allMatches.push({
	                type: type, match: match, attr: attr, startTag: startTag, startTagName: startTagName, endSelf: endSelf, endTagName: endTagName, index: index, length: length_1
	            });
	        }
	        return allMatches;
	    };
	    WxDomParser.prototype.makeWxTree = function (results) {
	        var openTreeList = [{ nodeName: 'ROOT', attr: [], children: [] }];
	        for (var _i = 0, results_1 = results; _i < results_1.length; _i++) {
	            var node = results_1[_i];
	            this.make(node, openTreeList);
	        }
	        return openTreeList[0];
	    };
	    WxDomParser.prototype.make = function (result, openTreeList) {
	        var tree = openTreeList[openTreeList.length - 1];
	        if (isText(result)) {
	            if (wxParser_tool_1.removeAllSpace(result.value).length !== 0) {
	                tree.children.push({ nodeName: wxParser_type_1.TEXTNODE, attr: [], children: [result.value] });
	            }
	        }
	        else {
	            if (result.endTagName) {
	                openTreeList.pop();
	            }
	            else {
	                var nodeName = result.startTagName;
	                if (result.endSelf) {
	                    tree.children.push({ nodeName: nodeName, attr: this.getAttributes(result.attr), children: [] });
	                }
	                else if (nodeName) {
	                    var newOpenTree = { nodeName: nodeName, attr: this.getAttributes(result.attr), children: [] };
	                    tree.children.push(newOpenTree);
	                    openTreeList.push(newOpenTree);
	                }
	            }
	        }
	    };
	    WxDomParser.prototype.getAttributes = function (attr) {
	        var slimAttr = wxParser_tool_1.removeMultiSpace(wxParser_tool_1.removeEqualSpace(attr));
	        var attrArray = [];
	        var attrExpression;
	        while (attrExpression = this.attrRegex.exec(attr)) {
	            var p = attrExpression[0].split('=');
	            attrArray.push({
	                name: p[0],
	                value: p[1].replace(/["']/g, '')
	            });
	        }
	        return attrArray;
	    };
	    return WxDomParser;
	}());
	var wxDomParserFactory = (function () {
	    var wxDomParser;
	    return function () {
	        return wxDomParser || (wxDomParser = new WxDomParser());
	    };
	})();
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = wxDomParserFactory;


/***/ },
/* 9 */
/***/ function(module, exports) {

	"use strict";
	/**
	 * 去除等号两侧的空格
	 *
	 * @param {string} str
	 * @returns {string}
	 */
	function removeEqualSpace(str) {
	    return str.replace(/\s*\=\s*/g, '=');
	}
	exports.removeEqualSpace = removeEqualSpace;
	/**
	 * 修正长度大于2的空格，修正为1
	 *
	 * @param {string} str
	 * @returns {string}
	 */
	function removeMultiSpace(str) {
	    return str.replace(/\s{2,}/g, " ");
	}
	exports.removeMultiSpace = removeMultiSpace;
	/**
	 * 移除所有的空格
	 *
	 * @export
	 * @param {string} str
	 * @returns {string}
	 */
	function removeAllSpace(str) {
	    return str.replace(/\s*/g, '');
	}
	exports.removeAllSpace = removeAllSpace;


/***/ },
/* 10 */
/***/ function(module, exports) {

	"use strict";
	exports.TEXTNODE = 'TEXTNODE';
	exports.NODESTART = 'NODESTART';
	exports.NODEEND = 'NODEEND';
	exports.NODECLOSESELF = 'NODECLOSESELF';


/***/ }
/******/ ]);