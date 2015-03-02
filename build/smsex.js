"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var Mustache = _interopRequire(require("mustache"));

var _ = _interopRequire(require("lodash"));

var SMS = (function () {
  function SMS() {
    _classCallCheck(this, SMS);

    this._templates = null;
    this._defaultTemplates = null;
    this._providers = null;
    this._defaultProvider = null;
  }

  _prototypeProperties(SMS, null, {
    use: {
      value: function use(name, provider) {
        if (!provider) {
          provider = name;
          name = provider.name;
        }

        if (!name) {
          throw new Error("SMS provider must have a name");
        }

        if (!this._providers) {
          this._defaultProvider = provider;
          this._providers = {};
        }

        this._providers[name] = provider;
        return this;
      },
      writable: true,
      configurable: true
    },
    template: {
      value: function template(name, content) {
        if (_.isObject(name)) {
          this._templates = name;
        } else {
          if (!content) {
            throw new Error("SMS template must have name and content");
          }

          if (!this._templates) {
            this._defaultTemplates = content;
            this._templates = {};
          }

          this._templates[name] = content;
        }
      },
      writable: true,
      configurable: true
    },
    send: {
      value: function send(options) {
        var callback = arguments[1] === undefined ? function () {} : arguments[1];
        if (_.isString(options) && _.isString(callback)) {
          options = {
            to: options,
            body: callback
          };

          callback = arguments[2] !== undefined ? arguments[2] : function () {};
        }

        if (!_.isObject(options)) {
          throw new Error("options must be object");
        }

        if (!_.isFunction(callback)) {
          throw new Error("callback must be function");
        }

        if (!options.to || !options.body) {
          throw new Error("Send to or message body missing");
        }

        if (!this._providers) {
          throw new Error("No provider");
        }

        var content = null;

        if (_.isString(options.body)) {
          content = options.body;
        } else if (_.isObject(options.body)) {
          if (!this._templates) {
            throw new Error("No templates");
          }

          var template = options.template ? this._templates[options.template] : this._defaultTemplates;

          content = Mustache.render(template, options.body);
        } else {
          throw new Error("Message body must be string or object");
        }

        var provider = options.provider ? this._providers[options.provider] : this._defaultProvider;

        provider.send(options.to, content, options.params, callback);
      },
      writable: true,
      configurable: true
    }
  });

  return SMS;
})();

module.exports = new SMS();
//# sourceMappingURL=smsex.js.map