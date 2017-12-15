let cc = window.cc;

export default {
  init: function () {
    this.LANG_KEY = 'game_language';

    //盐城话
    this.LANG_YC = 'yanchenghua';

    //普通话
    this.LANG_PTH = 'putonghua';

    //默认语言
    this.LANG_DEFAULT = this.LANG_YC;

    var lang = cc.sys.localStorage.getItem(this.LANG_KEY);
    if (lang == null) {
      cc.sys.localStorage.setItem(this.LANG_KEY, this.LANG_DEFAULT);
    }

  },

  getLanguage: function () {
    var lang = cc.sys.localStorage.getItem(this.LANG_KEY);
    if (lang == null) {
      return this.LANG_DEFAULT;
    }
    return lang;
  },

  setLanguage: function (lang) {
    if (lang == this.LANG_YC || lang == this.LANG_PTH) {
      cc.sys.localStorage.setItem(this.LANG_KEY, lang);

      return;
    }
    console.log('invalid language type.');
    return;

  }
}
