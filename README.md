# smsex
SMS服务扩展，提供统一的基于模板的短信服务接口，便于在各种短信服务提供商之间自由切换。

## Installation

```
$ npm install smsex
```

## Examples

  使用前必须先定义提供商，实现发送短信方法。提供商定义参见[`Provider`](#provider)。
```js
var smsex = require('smsex');
var YourProvider = require('your_provider');

smsex.use(new YourProvider('account', 'password'));

smsex.send('13800000000', '千年田地八百主，田是主人人是客。', function (err, result) {
  if (!err) { console.log(result); }
});
```

  由于绝大多数供应商不支持直接发送短信，而必须事先定义好短信模板，因此以上方法不推荐使用。定义模板发送如下：
```js
smsex.template('register', '您的验证码是：{{code}}，请不要把验证码泄露给其他人。');

smsex.send({
  to: '13800000000',
  body: {
    code: 850119
  }
}, function (err, result) {});
```

  可以同时使用多家短信提供商，不同的提供商按名称(name)区分。自定义多个模板举例：
```js
smsex.use(new AProvider('account', 'password'));
smsex.use(new BProvider('appKey', 'appSecret'));
smsex.template('register', '您的验证码是：{{code}}，请不要把验证码泄露给其他人。');
smsex.template('order', '您的订单[编号：{{number}}]{{status}}，下载客户端({{url}})实时查看您的订单状态。');
smsex.send({
  to: '13800000000',
  body: {
    number: '850119850119850119',
    status: '已发货',
    url: 'https://github.com/loulin'
  },
  provider: 'a',
  template: 'order'
}, function (err, result) {});
```

## API

### `use([name], provider)`
- `name` - 可选的供应商名称，不提供时使用provider.name
- `provider` - 供应商实例，第一次调用时会被设置为默认供应商

### `template(name, content)`
- `name` - 模板名称
- `content` - 模板内容，第一次调用时会被设置为默认模板。模板使用`Mustache`引擎，语法请参考[Mustache文档](https://github.com/janl/mustache.js#templates)。

### `template(templates)`
- `templates` - 批量模板对象，可同时指定多个模板名值对(name, content)，如`{name1: 'content1', name2, 'content2'}`。

### `send(options, [callback])`
- `options` - 发送选项:
  - `to` - 必选，目标手机号码。
  - `body` - 必选，发送内容，String或者Object，为Object时作为模板数据源。
  - `provider` - 可选，供应商名称，不选时使用默认供应商。
  - `template` - 可选，模板名称，不选时使用默认模板。
  - `params` - 可选，为具体的供应商提供参数。

## Provider

  Provider类必须实现以下方法
```
function send(mobile, content, params, cb) {}
* `mobile` - 目标手机号(String)
* `content` - 发送内容(String)
* `params` - 适用于当前供应商的参数(Object)
* `cb` - 回调函数(Function)
```

举例(ES6)：
```
class AProvider {
  constructor(account, password) {
    this.account = account;
    this.password = password;
    this.name = 'a';
  }

  send(mobile, content, params, cb) {
    return request.post('https://github.com/loulin', {
        account: this.account,
        password: this.password,
        mobile: mobile,
        content: content,
        // extend(params)
      }).then((err, res) => {
      if (err) {
        return cb(error);
      }
      return cb(null, res.body);
    });
  }
}

export default AProvider;
```

## TODO
* 提供基于模板编号的服务商支持
* 由于不同供应商可能使用不同的模板，考虑实现供应商模板
* use提供商时检查提供商名称是否存在

## License

  MIT
