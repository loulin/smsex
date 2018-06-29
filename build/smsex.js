"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var Mustache = _interopRequire(require("mustache"));

var _ = _interopRequire(require("lodash"));

var SMS = (function () {
  function SMS() {
    _classCallCheck(this, SMS);

    this._templates = {};
    this._providers = null;
    this._defaultProvider = null;
  }

  _createClass(SMS, {
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
      }
    },
    template: {

      /**
       * Set template global or specified provider.
       *
       * @method template
       * @param {Object} templateObj The plain template object, name value pair
       * or
       * @param {String} name template name
       * @param {String} content template content
       */

      value: function template(name, content) {
        if (arguments.length === 0) {
          return this._templates;
        }

        var templates = undefined;
        if (_.isObject(name)) {
          templates = name;
        } else {
          if (!content) {
            return this._templates[name];
          }
          templates = {};
          templates[name] = content;
        }

        _.assign(this._templates, templates);
      }
    },
    send: {
      value: function send(options) {
        var callback = arguments[1] === undefined ? function () {} : arguments[1];

        if (!this._providers) {
          throw new Error("No SMS provider");
        }

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
          throw new Error("send to or message body missing");
        }

        var provider = options.provider ? this._providers[options.provider] : this._defaultProvider;

        if (_.isString(options.body)) {
          options.content = options.body;
        } else if (_.isObject(options.body)) {
          if (!options.template) {
            throw new Error("template name missing");
          }

          var template = provider.templates ? provider.templates[options.template] : null;

          if (!template) {
            template = this._templates ? this._templates[options.template] : null;
            if (!template) {
              throw new Error("Provider \"" + provider.name + "\" does not implement or no default \"" + options.template + "\" template");
            }
          }

          var isInteger = function (n) {
            return !isNaN(parseInt(n)) && isFinite(n) && n % 1 === 0;
          };

          if (isInteger(template)) {
            options.template = template;
          } else {
            options.content = Mustache.render(template, options.body);
          }
        } else {
          throw new Error("Message body must be string or object");
        }

        return provider.send(options, callback);
      }
    }
  });

  return SMS;
})();

module.exports = new SMS();
//# sourceMappingURL=smsex.js.map