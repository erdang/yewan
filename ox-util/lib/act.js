"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.autoBind = autoBind;
exports.bindActionCreator = bindActionCreator;
exports.resetAction = resetAction;
exports.updateAction = updateAction;
exports.getState = getState;
exports["default"] = createAct;

var _oop = require("./oop.js");

function autoBind(instance, proto) {
  var propertyNames = Object.getOwnPropertyNames(proto);

  for (var i = 0; i < propertyNames.length; i++) {
    var key = propertyNames[i];
    var value = proto[key];

    if (typeof value == 'function') {
      instance[key] = proto[key].bind(instance);
    }
  }
}

function bindActionCreator(actionCreator, dispatch, instance) {
  return function () {
    dispatch(actionCreator.apply(instance, [].slice.call(arguments, 0)));
  };
}

function resetAction() {
  return {
    type: this.namespace + '.RESET'
  };
}

function updateAction(data) {
  return {
    type: this.namespace + '.UPDATE',
    payload: data
  };
}

function getState() {
  var state = this.getRootState();
  var ns = this.namespace;
  ns.split('.').forEach(function (n) {
    state = state[n];
  });
  return state;
}

function createAct(store, namespace, proto) {
  var actionCreator = proto.actionCreator || {};
  var act = null;
  (0, _oop.mix)(actionCreator, {
    reset: resetAction,
    update: updateAction
  });
  (0, _oop.mix)(proto, {
    namespace: namespace,
    actionCreator: actionCreator,
    dispatch: store.dispatch,
    getRootState: store.getState,
    getState: getState
  });
  delete proto.actionCreator;
  act = Object.create(proto);
  Object.keys(actionCreator).forEach(function (key) {
    if (process.env.NODE_ENV !== 'production') {
      if (key in act) {
        console.error('The actionCreator was <' + key + '> alreay binded.');
      }
    }

    act[key] = bindActionCreator(actionCreator[key], store.dispatch, act);
  });
  autoBind(act, proto);
  return act;
}