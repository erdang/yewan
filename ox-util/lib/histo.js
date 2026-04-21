"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.Histo = void 0;

var _events = _interopRequireDefault(require("events"));

var _oop = require("./oop.js");

var _browser = _interopRequireDefault(require("./browser.js"));

var _url = _interopRequireDefault(require("./url.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var Histo = function Histo(disabledSpa) {
  Histo.superclass.constructor.call(this);
  this.spa = !disabledSpa && this._supportPushState();
  this._current = this.getPath();
  this._popstateHandler = this._popstateHandler.bind(this);

  this._getGlobalScope().addEventListener('popstate', this._popstateHandler, false);
};

exports.Histo = Histo;
(0, _oop.extend)(Histo, _events["default"], {
  getPath: function getPath() {
    var loc = this._getLocation();

    return loc.pathname + loc.search;
  },
  push: function push(url, stateObject) {
    this._changeState(url, stateObject);
  },
  replace: function replace(url, stateObject) {
    this._changeState(url, stateObject, true);
  },
  destroy: function destroy() {
    this._getGlobalScope().removeEventListener('popstate', this._popstateHandler, false);
  },
  _getGlobalScope: function _getGlobalScope() {
    return window;
  },
  _getLocation: function _getLocation() {
    return window.location;
  },
  _getHistory: function _getHistory() {
    return window.history;
  },
  _supportPushState: function _supportPushState() {
    var poorSupport = _browser["default"].ios && (_browser["default"].getiOSVersion() < 5 || _browser["default"].chrome) || _browser["default"].android && !_browser["default"].chrome && _browser["default"].getandroidVersion() < 4.2;
    return 'pushState' in this._getHistory() && !poorSupport;
  },
  _getPathBaseOnCurrent: function _getPathBaseOnCurrent(urlObj, currentUrlObj) {
    var result = '';

    if (!urlObj.host) {
      result = (urlObj.pathname || currentUrlObj.pathname) + urlObj.search;
    }

    return result;
  },
  _popstateHandler: function _popstateHandler(event) {
    var oldPath = this._current;

    var oldPathObj = _url["default"].parse(oldPath);

    var path = this.getPath();

    var pathObj = _url["default"].parse(path);

    this._current = path;
    this.emit('change', path);

    if (oldPathObj.pathname == pathObj.pathname) {
      this.emit('change-query', path);
    }
  },
  _changeState: function _changeState(url, stateObject, replace) {
    var loc = this._getLocation();

    var current = this._current;

    var currentObj = _url["default"].parse(current);

    var urlObj = _url["default"].parse(url);

    var pathnameWithSearch = this._getPathBaseOnCurrent(urlObj, currentObj);

    var pathnameWithSearchObj = _url["default"].parse(pathnameWithSearch);

    if (pathnameWithSearch && current != pathnameWithSearch && this.spa) {
      this.emit(replace ? 'replace' : 'push', url);

      this._getHistory()[replace ? 'replaceState' : 'pushState'](stateObject || null, null, pathnameWithSearch);

      this._current = pathnameWithSearch;
      this.emit('change', pathnameWithSearch);

      if (currentObj.pathname == pathnameWithSearchObj.pathname) {
        this.emit('change-query', pathnameWithSearch);
      }
    } else {
      loc[replace ? 'replace' : 'assign'](url);
    }
  }
});

var _default = new Histo();

exports["default"] = _default;