import {mix} from './oop.js';

export function autoBind(instance, proto) {
    var propertyNames = Object.getOwnPropertyNames(proto);

    for (var i = 0; i < propertyNames.length; i++) {
        var key = propertyNames[i];
        var value = proto[key];
        if (typeof value == 'function') {
            instance[key] = proto[key].bind(instance);
        }
    }
}

export function bindActionCreator(actionCreator, dispatch, instance) {
    return function () {
        dispatch(actionCreator.apply(instance, [].slice.call(arguments, 0)));
    };
}

export function resetAction() {
    return {
        type: this.namespace + '.RESET'
    };
}

export function updateAction(data) {
    return {
        type: this.namespace + '.UPDATE',
        payload: data
    };
}

export function getState() {
    var state = this.getRootState();
    var ns = this.namespace;

    ns.split('.').forEach((n) => {
        state = state[n];
    });
    return state;
}

export default function createAct(store, namespace, proto) {
    var actionCreator = proto.actionCreator || {};
    var act = null;

    mix(actionCreator, {
        reset: resetAction,
        update: updateAction
    });

    mix(proto, {
        namespace,
        actionCreator,
        dispatch: store.dispatch,
        getRootState: store.getState,
        getState
    });

    delete proto.actionCreator;

    act = Object.create(proto);

    Object.keys(actionCreator).forEach((key) => {
        if (process.env.NODE_ENV !== 'production') {
            if (key in act) {
                console.error(
                    'The actionCreator was <' + key + '> alreay binded.'
                );
            }
        }
        act[key] = bindActionCreator(actionCreator[key], store.dispatch, act);
    });

    autoBind(act, proto);

    return act;
}
