import Mustache from 'mustache';
import _ from 'lodash';

class SMS {
  constructor() {
    this._templates = null;
    this._defaultTemplates = null;
    this._providers = null;
    this._defaultProvider = null;
  }

  use(name, provider) {
    if (!provider) {
      provider = name;
      name = provider.name;
    }

    if (!name) {
      throw new Error('SMS provider must have a name');
    }

    if (!this._providers) {
      this._defaultProvider = provider;
      this._providers = {};
    }

    this._providers[name] = provider;
    return this;
  }

  template(name, content) {
    if (_.isObject(name)) {
      this._templates = name;
    } else {
      if (!content) {
        throw new Error('SMS template must have name and content');
      }

      if (!this._templates) {
        this._defaultTemplates = content;
        this._templates = {};
      }

      this._templates[name] = content;
    }
  }

  send(options, callback = () => {}) {
    if (_.isString(options) && _.isString(callback)) {
      options = {
        to: options,
        body: callback
      };

      callback = arguments[2] !== undefined ? arguments[2] : () => {};
    }

    if (!_.isObject(options)) {
      throw new Error('options must be object');
    }

    if (!_.isFunction(callback)) {
      throw new Error('callback must be function');
    }

    if (!options.to || !options.body) {
      throw new Error('Send to or message body missing');
    }

    if (!this._providers) {
      throw new Error('No provider');
    }

    let content = null;

    if (_.isString(options.body)) {
      content = options.body;
    } else if (_.isObject(options.body)) {
      if (!this._templates) {
        throw new Error('No templates');
      }

      let template = options.template ? this._templates[options.template] : this._defaultTemplates;

      content = Mustache.render(template, options.body);
    } else {
      throw new Error('Message body must be string or object');
    }

    let provider = options.provider ? this._providers[options.provider] : this._defaultProvider;

    provider.send(options.to, content, options.params, callback);
  }
}

export default new SMS();