function tplEng(tpl, data) { // 规定返回渲染结果
	tpl = tpl.replace(/[\n]/g, '').replace("'", "\'") //预处理

	var delimiter = ['[%', '%]']
	var codeArr = []
	codeArr.push('var __arr=[];')

	while(tpl && tpl.length > 0) {

		var a = tpl.indexOf(delimiter[0])
		if(a < 0) { // 不需要处理了
			codeArr.push("__arr.push('" + tpl + "');")
			break;
		}

		var b = tpl.indexOf(delimiter[1], a + 2)
		if(b < a + 2) {
			throw 'please check the template, seem like miss ' + delimiter[1] + ' for ' + delimiter[0]
		}

		var leftStr = tpl.substring(0, a)
		var middleExp = tpl.substring(a + 2, b).trim().replace('&lt;','<').replace('&gt;','>')//避免<,> 转译后出问题
		if(middleExp.indexOf(delimiter[0]) > 0 || middleExp.indexOf(delimiter[1]) > 0) {
			throw "can't support nested " + delimiter[0] + "  " + delimiter[1]
		}

		var rightTpl = tpl.substring(b + 2)
		codeArr.push("__arr.push('" + leftStr + "');")
		if(middleExp.charAt(0) != '=') { // 逻辑语句
			codeArr.push(middleExp)
		} else { // 赋值语句
			codeArr.push('__arr.push(' + middleExp.substring(1) + ');')
		}

		tpl = rightTpl // 进入下一个循环继续解析
	}

	codeArr.push("return __arr.join('');") //确保代码执行完以后返回结果, 如果__arr  包含undefined join 的结果里会忽略。

	return new Function(codeArr.join('')).call(data) //构造函数并且返回结果

}

function domEngin(tpl_dom,data) {
	var result=tplEng(tpl_dom.innerHTML,data)
	var div=document.createElement('div')
	div.innerHTML=result // 此处赋值的是dom字符串
	return div.children[0] //此处返回的dom 对象
}
