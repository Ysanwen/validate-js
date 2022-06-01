# validate-js 0.0.1

一个用来进行输入验证的组件，基于[validator.js][validator-url]和[tooltip.js][tooltip-url],可在node和browser环境下使用。
无需更多的其他依赖。**同validator一致,所有验证的value需为str类型**。

### 模块化安装使用

通过github地址安装: `npm install git+https://git@github.com/Ysanwen/validate-js.git`。

在node环境下使用:

```javascript
var validate = require('validate-js');

validate.isInt('abc'); //=> false

```
支持的方法请参考:[validator.js][validator-url]

通过组件化引入浏览器端使用:

```javascript
import validate from 'validate-js'

validate.autoValidate()    //对含有class="validate"的input元素进行验证，验证时机通过设置input的validate-trigger属性决定。默认为onchange
validate.validateAll()     //对全部class="validate"的input元素进行验证。

validate.doValidate(el)    //验证指定的input元素, 返回验证结果 true/false
```

### 浏览器端直接引入 

```html
<script type="text/javascript" src="validate-js.min.js"></script>
<script type="text/javascript">
  validate.isEmail('foo@bar.com'); //=> true
  validate.autoValidate();
</script>
```

### 验证规则

- 待验证的元素必须包含`validate`的class name
- 验证时机,validate.autoValidate的验证时机由`validate-trigger`指定,不指定则默认的为`onchange`时触发验证。
  触发时机可以设定为`change`, `keypress`, `keydown`, `keyup`, `blur`之中的任意一种。
- 验证规则通过`validate-rule`指定，规则之间通过`|`分割,由左至右的顺序执行,遇到验证失败直接停止并提示信息。
  例如:`validate-rule="doTrim|int:{min:1,max:10}"`
- 提示信息,`validate-success`自定义验证通过时显示信息,不设置则不显示。`validate-fail`自定义验证失败时的显示信息,不设置则显示默认信息。
- 提示信息位置`validate-tips-position`,默认位置为'bottom-start',即在被验证元素底部,左侧对齐位置显示验证结果。可接受的value为:

```
  'top', 'top-start',  'top-end', 
  'right', 'right-start', 'right-end', 
  'bottom', 'bottom-start', 'bottom-end', 
  'left', 'left-start', 'left-end'
```
![position](/position.png)

### 示例

```html
<input class="validate" validate-rule="int|len:{min:3,max:5}" validate-success="输入正确" validate-fail="请输入数字" placeholder="输入整数">

<script type="text/javascript">
  validate.autoValidate();
</script>
```
![样例](/sample.gif)

支持自定义验证规则

```html
<input class="validate" validate-rule="myRule:{min:1,max:2}" placeholder="自定义规则">

<script type="text/javascript">
  function myRuleFunction (inputValue, ruleParams) {
    /* 
    ** inputValue为input标签获取的value,自定义的rule函数需接受此参数,不可省略。
    ** ruleParams为验证规则的参数,即为示例中的{min:1,max:2},无需规则参数时可以省略
    ** 
     */
    }
    // 此处进行相关验证或是其他处理逻辑
    return true //必须返回true 或 false
  }
  validate.addRule('myRule', myRuleFunction)  //增加规则到validate对象。'myRule'需与validate-rule中一致。
  validate.autoValidate();
</script>
```

对于radio和checkbox可能存在的组合验证，可通过validate-group指定相同的名称进行组合，一组相同的validate-group只需
在其中的一个element中指定validate-rule,相关的验证结果会显示在具有validate-rule的element下面。

```html
<div><input type="radio" class="validate" name="radio" value="radio1" validate-group="group1"/> radio1</div>
<div><input type="radio" class="validate" name="radio" value="radio2" validate-group="group1" validate-rule="in:[radio2,radio3]"/> radio2</div>
```

### 支持的规则

同[validator.js][validator-url]一致，参数部分通过`:`分割，例如:`len:{min:6,max:50}`,`in:['a','b']`,`str|contains:"abc"`

```bash
contains, equals, afterDate, alpha, alphanumeric, ascii, base64, beforeDate, boolean, byteLen, creditCard, 
currency, uri, decimal, divisibleBy, email, domain, float ,withFullWidth, withHalfWidth, hexColor, hexadecimal,
empty, ip, isbn, issn, isin, date, isrc, in, int, json, len, lowercase, macAdd, md5, mobile, mongoId, multiByte,
numeric, surrogatePair, url, uuid, uppercase, variableWidth, whiteList, matches,
doRemoveBlackList, doEscape, doUnescape, doTrimLeft, doTrimRight, doRemoveLowercase, doToBoolean, doToDate,
doToFloat, doToInt, doTrim, doToString, doKeepWhiteList, doNormalizeEmail

```

### 基于源文件开发

```bash
# git clone

npm install

npm run dev    # 开启dev调试server,对src文件夹下的源文件作出修改后,可在http://localhost:8088/增加相应的规则进行检测

npm run build  # 生成对应的dist模块文件以及validate-js.min.js文件 

```

### License (MIT)

Code and documentation copyright 2017 Ysanwen. Code released under the [MIT license][mit-url]


[validator-url]: https://github.com/chriso/validator.js
[tooltip-url]: https://github.com/FezVrasta/popper.js
[mit-url]: https://github.com/FezVrasta/popper.js/blob/master/LICENSE.md