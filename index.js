'use strict';

const serialize = require('./libs/serialize');

class Share {
  constructor(appId, redirectUrl) {
    this.setAppId(appId);
    this.setRedirectUrl(redirectUrl);

    if (!this.appId) {
      throw new Error('missing appid!');
    }

    if (!this.redirectUrl) {
      throw new Error('missing redirect url app!');
    }
  }
  
  static randomstring(L) {
    let s = '';
    const randomchar = () => {
      let n = Math.floor(Math.random() * 62);
      if (n < 10) return n; //1-10
      if (n < 36) return String.fromCharCode(n + 55); //A-Z
      return String.fromCharCode(n + 61); //a-z
    };
    while (s.length < L) s += randomchar();
    return s;
  }

  setAppId(appId) {
    this.appId = appId;
    return this;
  }

  setRedirectUrl(redirectUrl) {
    this.redirectUrl = redirectUrl;
    return this;
  }

  build(data, options) {
    if (!data.url) {
      throw new Error('Parameter URL is required');
    }

    if (!data.image) {
      throw new Error('Parameter image is required');
    }

    if (false == options instanceof Object) {
      options = {};
    }

    const defaultOptions = {
      'action_type': 'og.likes',
      'display': 'popup', // only avaiable touch and popup
      'version': 'v2.11'
    };

    options = Object.assign(defaultOptions, options);

    const connectUrl = 'https://staticxx.facebook.com/connect/xd_arbiter/r/lY4eZXm_YWu.js';
    const targetUrlParams = {
      u: data.url,
      h: Share.randomstring(23),
      s: 1
    };
    const targetUrl = 'https://l.facebook.com/l.php?' + serialize(targetUrlParams);
    const parameter = {
      action_properties: JSON.stringify({
        object: {
          'type': 'object',
          'url': targetUrl,
          'title': data.title ? data.title : '',
          'image': data.image,
          'description': data.description ? data.description : ''
        }
      }),
      action_type: options.action_type,
      app_id: this.appId,
      display: options.display,
      next: () => {
        const parameter = serialize({
          version: '42#cb=f178bb82679399',
          domain: this.redirectUrl,
          origin: 'https://' + this.redirectUrl + '/f3ec09ca44bdc94',
          relation: 'opener',
          frame: 'f295fa5752ca374',
          result: '"xxRESULTTOKENxx"'
        });
        const url = connectUrl + '?' + parameter;
        return decodeURIComponent(url);
      },
      sdk: 'joey',
      version: options.version,
      '_rdc': true,
      '_rdr': ''
    };

    const url = 'https://web.facebook.com/' + options.version + '/dialog/share_open_graph?' + serialize(parameter);

    return url;
  }
}

module.exports = Share;