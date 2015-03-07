var smsex = require("../");
var expect = require('chai').expect;

describe('SMS', function () {
  var provider = {
    name: 'mock',
    send: function (options, cb) {
      cb(null, {
        message: {
          to: options.to,
          content: options.content,
          params: options.params,
          template: options.template,
          provider: 'mock'
        },
        status: 200
      });
    }
  };
  smsex.use(provider);
  smsex.template('register', '您的验证码是：{{code}}。请不要把验证码泄露给其他人。');

  it('use provider without name should throw an exception', function () {
    var provider = {};
    expect(smsex.use.bind(smsex, provider)).to.throw(Error);
  });

  it('should successfully send a plain message', function () {
    smsex.send({
      to: '13800000000',
      body: 'Send a test message'
    }, function (err, result) {
      expect(err).to.not.be.ok;
      expect(result).to.be.an('object');
    });
  });

  it('should set proper templates', function () {
    var template = 'Your order number is {number}';
    smsex.template('global', template);
    expect(smsex.template('global')).to.equal(template);
  });

  it('should successfully send a message using default template', function (done) {
    var code = '850119';

    smsex.send({
      to: '13800000000',
      body: {
        code: code
      },
      provider: 'mock',
      template: 'register'
    }, function (err, result) {
      expect(err).to.not.be.ok;
      expect(result.status).to.equal(200);
      expect(result.message.provider).to.equal('mock');
      expect(result.message.content).to.equal('您的验证码是：' + code + '。请不要把验证码泄露给其他人。');
      done();
    });
  });

  it('should successfully send a message using provider template', function (done) {
    var code = '850119';

    smsex.template('register', '[Mock]您的验证码是：{{code}}。请不要把验证码泄露给其他人。', 'mock');

    smsex.send({
      to: '13800000000',
      body: {
        code: code
      },
      provider: 'mock',
      template: 'register'
    }, function (err, result) {
      expect(err).to.not.be.ok;
      expect(result.status).to.equal(200);
      expect(result.message.provider).to.equal('mock');
      expect(result.message.content).to.equal('[Mock]您的验证码是：' + code + '。请不要把验证码泄露给其他人。');
      done();
    });
  });
});