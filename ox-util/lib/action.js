"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var Action = function Action(store, ns) {
  var _this = this;

  this.dispatch = store.dispatch;
  this.getRootState = store.getState;
  this.ns = ns || undefined;
  var actions = this.actionCreator;

  if (this.ns) {
    actions.init = actions.init || this._initActionCreator;
    actions.update = actions.update || this._updateActionCreator;
  }

  Object.keys(actions).forEach(function (key) {
    if (process.env.NODE_ENV !== 'production') {
      if (key in _this) {
        console.error('The actionCreator was <' + key + '> alreay binded.');
      }
    }

    _this[key] = _this._bindActionCreator(key);
  });
};

Action.prototype = {
  actionCreator: {},
  getState: function getState() {
    var state = this.getRootState();
    var ns = this.ns;

    if (ns) {
      ns.split('.').forEach(function (n) {
        state = state[n];
      });
    }

    return state;
  },
  _bindActionCreator: function _bindActionCreator(actionCreatorName) {
    return function () {
      this.dispatch(this.actionCreator[actionCreatorName].apply(this, [].slice.call(arguments, 0)));
    }.bind(this);
  },
  _initActionCreator: function _initActionCreator() {
    return {
      type: (this.ns ? this.ns + '.' : '') + 'INIT'
    };
  },
  _updateActionCreator: function _updateActionCreator(data) {
    return {
      type: (this.ns ? this.ns + '.' : '') + 'UPDATE',
      payload: data
    };
  },
  _bindSelf: function _bindSelf() {
    var args = [].slice.call(arguments, 0);
    var i = 0;

    for (; i < args.length; i++) {
      if (typeof this[args[i]] == 'function') {
        this[args[i]] = this[args[i]].bind(this);
      }
    }
  }
};
var _default = Action;
exports["default"] = _default;